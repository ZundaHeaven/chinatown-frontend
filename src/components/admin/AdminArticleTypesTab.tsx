'use client';

import React, { useState, useEffect } from 'react';
import { ArticleType, ArticleTypeCreateRequest, ArticleTypeUpdateRequest } from '@/types/article-type';
import { getArticleTypes, createArticleType, updateArticleType, deleteArticleType } from '@/services/article-type';
import styles from './AdminTab.module.css';

const AdminArticleTypesTab: React.FC = () => {
  const [articleTypes, setArticleTypes] = useState<ArticleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newType, setNewType] = useState<ArticleTypeCreateRequest>({
    name: '',
  });
  
  const [editData, setEditData] = useState<ArticleTypeUpdateRequest>({
    name: '',
  });

  useEffect(() => {
    loadArticleTypes();
  }, []);

  const loadArticleTypes = async () => {
    setIsLoading(true);
    setError('');

    try {
      const typesData = await getArticleTypes();
      setArticleTypes(typesData);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки типов статей');
      console.error('Ошибка загрузки типов статей:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newType.name.trim()) {
      setError('Название типа обязательно');
      return;
    }

    try {
      const createdType = await createArticleType(newType);
      setArticleTypes(prev => [...prev, createdType]);
      setNewType({ name: '' });
      setIsCreating(false);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании типа статьи');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editData.name.trim()) {
      setError('Название типа обязательно');
      return;
    }

    try {
      const updatedType = await updateArticleType(id, editData);
      setArticleTypes(prev => prev.map(type => 
        type.id === id ? updatedType : type
      ));
      setEditingId(null);
      setEditData({ name: '' });
      setError('');
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении типа статьи');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Вы уверены, что хотите удалить тип статьи "${name}"? Это действие нельзя отменить.`)) {
      return;
    }

    try {
      await deleteArticleType(id);
      setArticleTypes(prev => prev.filter(type => type.id !== id));
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении типа статьи');
    }
  };

  const startEdit = (type: ArticleType) => {
    setEditingId(type.id);
    setEditData({ name: type.name });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: '' });
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка типов статей...</p>
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <div>
          <h2 className={styles.tabTitle}>Управление типами статей</h2>
          <p className={styles.tabDescription}>
            Создавайте, редактируйте и удаляйте категории для статей. Всего типов: {articleTypes.length}
          </p>
        </div>
        
        <button
          onClick={() => setIsCreating(!isCreating)}
          className={styles.createButton}
        >
          {isCreating ? 'Отмена' : '+ Добавить тип'}
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
          <h3 className={styles.formTitle}>Новый тип статьи</h3>
          <form onSubmit={handleCreate} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="typeName">Название типа *</label>
              <input
                type="text"
                id="typeName"
                value={newType.name}
                onChange={(e) => setNewType({ name: e.target.value })}
                placeholder="Например: Новости, Блог, Исследование"
                className={styles.input}
                required
              />
              <div className={styles.helpText}>
                Используйте понятные названия, которые помогут пользователям находить нужный контент
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                Создать тип статьи
              </button>
            </div>
          </form>
        </div>
      )}

      {articleTypes.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📑</div>
          <h3>Типы статей не найдены</h3>
          <p>Создайте первую категорию для статей в системе.</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>ID</th>
                <th className={styles.th}>Название</th>
                <th className={styles.th}>Создан</th>
                <th className={styles.th}>Обновлен</th>
                <th className={styles.th}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {articleTypes.map((type) => (
                <tr key={type.id} className={styles.tr}>
                  <td className={styles.td}>
                    <span className={styles.idCell}>{type.id.slice(0, 8)}...</span>
                  </td>
                  
                  {editingId === type.id ? (
                    <>
                      <td className={styles.td}>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ name: e.target.value })}
                          className={styles.editInput}
                          placeholder="Название типа"
                        />
                      </td>
                      <td className={styles.td}>
                        <span className={styles.dateCell}>{formatDate(type.createdOn)}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.dateCell}>{formatDate(type.modifiedOn)}</span>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => handleUpdate(type.id)}
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
                        <span className={styles.nameCell}>{type.name}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.dateCell}>{formatDate(type.createdOn)}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.dateCell}>{formatDate(type.modifiedOn)}</span>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => startEdit(type)}
                            className={styles.editButton}
                          >
                            Редактировать
                          </button>
                          <button
                            onClick={() => handleDelete(type.id, type.name)}
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

export default AdminArticleTypesTab;