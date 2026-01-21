'use client';

import React, { useState, useEffect } from 'react';
import { Genre, GenreCreateRequest, GenreUpdateRequest } from '@/types/genre';
import { getGenres, createGenre, deleteGenre, updateGenre } from '@/services/genre';
import styles from './AdminTab.module.css';

const AdminGenresTab: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newGenre, setNewGenre] = useState<GenreCreateRequest>({
    name: '',
  });
  
  const [editData, setEditData] = useState<GenreUpdateRequest>({
    name: '',
  });

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    setIsLoading(true);
    setError('');

    try {
      const genresData = await getGenres();
      setGenres(genresData);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки жанров');
      console.error('Ошибка загрузки жанров:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGenre.name.trim()) {
      setError('Название жанра обязательно');
      return;
    }

    try {
      const createdGenre = await createGenre(newGenre);
      setGenres(prev => [...prev, createdGenre]);
      setNewGenre({ name: '' });
      setIsCreating(false);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании жанра');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Вы уверены, что хотите удалить жанр "${name}"? Это действие нельзя отменить.`)) {
      return;
    }

    try {
      await deleteGenre(id);
      setGenres(prev => prev.filter(genre => genre.id !== id));
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении жанра');
    }
  };

  const startEdit = (genre: Genre) => {
    setEditingId(genre.id);
    setEditData({ name: genre.name });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: '' });
  };

  const handleUpdate = async (id: string) => {
    if (!editData.name.trim()) {
      setError('Название жанра обязательно');
      return;
    }

    try {
      const updatedGenre =  await updateGenre(id, editData);
      setGenres(prev => prev.map(genre => 
        genre.id === id ? updatedGenre : genre
      ));
      setEditingId(null);
      setEditData({ name: '' });
      setError('');
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении жанра');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка жанров...</p>
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <div>
          <h2 className={styles.tabTitle}>Управление жанрами</h2>
          <p className={styles.tabDescription}>
            Создавайте, редактируйте и удаляйте жанры книг. Всего жанров: {genres.length}
          </p>
        </div>
        
        <button
          onClick={() => setIsCreating(!isCreating)}
          className={styles.createButton}
        >
          {isCreating ? 'Отмена' : '+ Добавить жанр'}
        </button>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <span className={styles.errorIcon}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {isCreating && (
        <div className={styles.createForm}>
          <h3 className={styles.formTitle}>Новый жанр</h3>
          <form onSubmit={handleCreate} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="genreName">Название жанра *</label>
              <input
                type="text"
                id="genreName"
                value={newGenre.name}
                onChange={(e) => setNewGenre({ name: e.target.value })}
                placeholder="Например: Фантастика"
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                Создать жанр
              </button>
            </div>
          </form>
        </div>
      )}

      {genres.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏷️</div>
          <h3>Жанры не найдены</h3>
          <p>Создайте первый жанр для книг в системе.</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>ID</th>
                <th className={styles.th}>Название</th>
                <th className={styles.th}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {genres.map((genre) => (
                <tr key={genre.id} className={styles.tr}>
                  <td className={styles.td}>
                    <span className={styles.idCell}>{genre.id.slice(0, 8)}...</span>
                  </td>
                  
                  {editingId === genre.id ? (
                    <>
                      <td className={styles.td}>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ name: e.target.value })}
                          className={styles.editInput}
                          placeholder="Название жанра"
                        />
                      </td>
                      <td className={styles.td}>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => handleUpdate(genre.id)}
                            className={styles.saveButton}
                          >
                            Сохранить
                          </button>
                          <button
                            onClick={cancelEdit}
                            className={styles.cancelButton}
                          >
                            Отмена
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className={styles.td}>
                        <span className={styles.nameCell}>{genre.name}</span>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => startEdit(genre)}
                            className={styles.editButton}
                          >
                            Редактировать
                          </button>
                          <button
                            onClick={() => handleDelete(genre.id, genre.name)}
                            className={styles.deleteButton}
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminGenresTab;