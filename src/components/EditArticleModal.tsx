'use client';

import React, { useState } from 'react';
import { Article, ArticleUpdateRequest } from '@/types/article';
import styles from './EditModal.module.css';

interface EditArticleModalProps {
  article: Article;
  onClose: () => void;
  onUpdate: (data: ArticleUpdateRequest) => Promise<void>;
}

const EditArticleModal: React.FC<EditArticleModalProps> = ({ article, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<ArticleUpdateRequest>({
    title: article.title,
    body: article.body,
    excerpt: article.excerpt,
    articleTypeId: article.articleTypeId,
    readingTimeMinutes: article.readingTimeMinutes,
    status: article.status,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await onUpdate(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении статьи');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value,
    }));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Редактировать статью</h2>
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
            <label htmlFor="title">Заголовок</label>
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
            <label htmlFor="excerpt">Краткое описание</label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="body">Содержание</label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              rows={10}
              required
              className={styles.textarea}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="readingTimeMinutes">Время чтения (минуты)</label>
              <input
                type="number"
                id="readingTimeMinutes"
                name="readingTimeMinutes"
                value={formData.readingTimeMinutes}
                onChange={handleChange}
                min="1"
                max="120"
                className={styles.input}
              />
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

export default EditArticleModal;