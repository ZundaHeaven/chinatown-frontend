'use client';

import React, { useState, useEffect } from 'react';
import { BookCreateRequest } from '@/types/book';
import { Genre } from '@/types/genre';
import { createBook, uploadBookCover, uploadBookFile } from '@/services/book';
import { getGenres } from '@/services/genre';
import styles from './CreateModal.module.css';

interface CreateBookModalProps {
  onClose: () => void;
  onSuccess: (id: string) => void;
}

const CreateBookModal: React.FC<CreateBookModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<BookCreateRequest>({
    title: '',
    authorName: '',
    pageAmount: '',
    yearOfPublish: new Date().getFullYear(),
    genreIds: [],
    description: ''
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenresLoading, setIsGenresLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      setIsGenresLoading(true);
      const genresData = await getGenres();
      setGenres(genresData);
    } catch (err) {
      console.error('Ошибка загрузки жанров:', err);
    } finally {
      setIsGenresLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.title.trim()) {
        throw new Error('Название книги обязательно');
      }
      if (!formData.authorName.trim()) {
        throw new Error('Автор обязателен');
      }
      if (!bookFile) {
        throw new Error('Файл книги обязателен');
      }

      const bookData : BookCreateRequest = {
        title: formData.title,
        authorName: formData.authorName,
        pageAmount: formData.pageAmount,
        yearOfPublish: formData.yearOfPublish,
        genreIds: formData.genreIds,
        description: formData.description
      }

      const book = await createBook(bookData);

      await uploadBookFile(book.id, bookFile);

      if (coverFile) {
        await uploadBookCover(book.id, coverFile);
      }

      onSuccess(book.id);
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании книги');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yearOfPublish' || name === 'pageAmount' ? parseInt(value) || 0 : value,
    }));
  };

  const handleGenreChange = (genreId: string) => {
    setFormData(prev => {
      const currentGenreIds = prev.genreIds;
      const updatedGenreIds = currentGenreIds.includes(genreId)
        ? currentGenreIds.filter(id => id !== genreId)
        : [...currentGenreIds, genreId];
      return {
        ...prev,
        genreIds: updatedGenreIds,
      };
    });
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Файл должен быть изображением');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Размер изображения не должен превышать 5MB');
        return;
      }
      setCoverFile(file);
    }
  };

  const handleBookFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/epub+zip', 'text/plain'];
      if (!allowedTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.epub')) {
        setError('Поддерживаются только файлы PDF и EPUB');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setError('Размер файла не должен превышать 50MB');
        return;
      }
      setBookFile(file);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} style={{ maxWidth: '700px' }}>
        <div className={styles.modalHeader}>
          <h2>Создать новую книгу</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorAlert}>
              <span className={styles.errorIcon}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="title">Название книги *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Введите название книги"
            />
          </div>

        <div className={styles.formGroup}>
            <label htmlFor="description">Описание книги *</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Введите описание книги"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="authorName">Автор *</label>
            <input
              type="text"
              id="authorName"
              name="authorName"
              value={formData.authorName}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Введите имя автора"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="yearOfPublish">Год издания *</label>
              <input
                type="number"
                id="yearOfPublish"
                name="yearOfPublish"
                value={formData.yearOfPublish}
                onChange={handleChange}
                min="1000"
                max={new Date().getFullYear()}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="pageAmount">Количество страниц</label>
              <input
                type="number"
                id="pageAmount"
                name="pageAmount"
                value={formData.pageAmount}
                onChange={handleChange}
                min="1"
                className={styles.input}
                placeholder="Опционально"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bookFile">Файл книги * (PDF или EPUB)</label>
            <input
              type="file"
              id="bookFile"
              accept=".pdf,.epub"
              name="bookFile"
              onChange={handleBookFileChange}
              required
              className={styles.fileInput}
            />
            {bookFile && (
              <div className={styles.fileInfo}>
                <span className={styles.fileIcon}>📚</span>
                <span>{bookFile.name}</span>
                <span className={styles.fileSize}>
                  ({(bookFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="coverFile">Обложка книги (изображение)</label>
            <input
              type="file"
              id="coverFile"
              accept="image/*"
              onChange={handleCoverChange}
              className={styles.fileInput}
            />
            {coverFile && (
              <div className={styles.fileInfo}>
                <span className={styles.fileIcon}>🖼️</span>
                <span>{coverFile.name}</span>
                <span className={styles.fileSize}>
                  ({(coverFile.size / 1024).toFixed(2)} KB)
                </span>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Жанры *</label>
            {isGenresLoading ? (
              <div className={styles.loading}>Загрузка жанров...</div>
            ) : (
              <div className={styles.checkboxGroup}>
                {genres.map(genre => (
                  <div key={genre.id} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      id={`genre-${genre.id}`}
                      checked={formData.genreIds.includes(genre.id)}
                      onChange={() => handleGenreChange(genre.id)}
                    />
                    <label htmlFor={`genre-${genre.id}`}>{genre.name}</label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading || !bookFile}
            >
              {isLoading ? 'Создание...' : 'Создать книгу'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBookModal;