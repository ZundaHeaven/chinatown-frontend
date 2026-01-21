'use client';

import React, { useState, useEffect } from 'react';
import { Book, BookUpdateRequest } from '@/types/book';
import { Genre } from '@/types/genre';
import { getGenres } from '@/services/genre';
import styles from './EditModal.module.css';

interface EditBookModalProps {
  book: Book;
  onClose: () => void;
  onUpdate: (data: BookUpdateRequest) => Promise<void>;
}

const EditBookModal: React.FC<EditBookModalProps> = ({ book, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<BookUpdateRequest>({
    title: book.title,
    authorName: book.authorName,
    status: book.status,
    pageAmount: book.pageAmount.toString(),
    yearOfPublish: book.yearOfPublish,
    genreIds: book.genres.map(genre => genre.id),
    description: book.description
  });

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
      await onUpdate(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении книги');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Редактировать книгу</h2>
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
            <label htmlFor="title">Название</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="authorName">Автор</label>
            <input
              type="text"
              id="authorName"
              name="authorName"
              value={formData.authorName}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="yearOfPublish">Год издания</label>
              <input
                type="number"
                id="yearOfPublish"
                name="yearOfPublish"
                value={formData.yearOfPublish}
                onChange={handleChange}
                min="1000"
                max="2099"
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
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Описание</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Статус</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="Draft">Черновик</option>
              <option value="Published">Опубликовано</option>
              <option value="Archived">В архиве</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Жанры</label>
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
              disabled={isLoading}
            >
              {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookModal;