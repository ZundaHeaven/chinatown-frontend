// components/modals/CreateArticleModal.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { ArticleCreateRequest } from '@/types/article';
import { createArticle } from '@/services/article';
import styles from './CreateModal.module.css';
import { ArticleType } from '@/types/article-type';
import { getArticleTypes } from '@/services/article-type';

interface CreateArticleModalProps {
  onClose: () => void;
  onSuccess: (id: string) => void;
}

const CreateArticleModal: React.FC<CreateArticleModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<ArticleCreateRequest>({
    title: '',
    body: '',
    excerpt: '',
    articleTypeId: '',
    readingTimeMinutes: 5,
  });

  const [isDataLoading, setIsDataLoading] = useState(true);
  const [articleTypes, setArticleTypes] = useState<ArticleType[]>([]);


  useEffect(() => {
    async function loadTypes() {
      setIsDataLoading(true);

      try {
        const articleTypesData = await getArticleTypes();
        setArticleTypes(articleTypesData);
      }
      catch {
        alert('Ошибка загрузки данных')
      }

      setIsDataLoading(false);
      
    }

    loadTypes();
  }, [])

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.title.trim()) {
        throw new Error('Заголовок обязателен');
      }
      if (!formData.body.trim()) {
        throw new Error('Содержание обязательно');
      }
      if (!formData.articleTypeId) {
        throw new Error('Выберите тип статьи');
      }

      const data : ArticleCreateRequest = {
        title: formData.title,
        body: formData.body,
        excerpt: formData.excerpt,
        articleTypeId: formData.articleTypeId,
        readingTimeMinutes: formData.readingTimeMinutes
      }

      const article = await createArticle(data);
      onSuccess(article.id);
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании статьи');
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
          <h2>Создать новую статью</h2>
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
            <label htmlFor="title">Заголовок *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Введите заголовок статьи"
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
              placeholder="Краткое описание (отображается в превью)"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="body">Содержание *</label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              rows={8}
              required
              className={styles.textarea}
              placeholder="Основной текст статьи"
            />
            <div className={styles.helpText}>
              Используйте пустые строки для разделения параграфов
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="readingTimeMinutes">Время чтения (минуты) *</label>
              <input
                type="number"
                id="readingTimeMinutes"
                name="readingTimeMinutes"
                value={formData.readingTimeMinutes}
                onChange={handleChange}
                min="1"
                max="120"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="articleTypeId">Тип статьи *</label>
              <select
                id="articleTypeId"
                name="articleTypeId"
                value={formData.articleTypeId}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="">Выберите тип</option>
                {articleTypes.map((a) => 
                  (
                  <option value={a.id}>{a.name}</option>
                  ))}
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
              {isLoading ? 'Создание...' : 'Создать статью'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateArticleModal;