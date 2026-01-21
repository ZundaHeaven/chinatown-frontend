'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Article } from '@/types/article';
import { getMyArticles, deleteArticle, changeArticleStatus } from '@/services/article';
import { getImageUrl } from '@/lib/file';
import styles from './MyContentTab.module.css';
import { ContentType } from '@/types/common';

interface MyArticlesTabProps {
  onDataLoaded: (data: Article[]) => void;
}

const MyArticlesTab: React.FC<MyArticlesTabProps> = ({ onDataLoaded }) => {
  const router = useRouter();
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'Published' | 'Draft' | 'Archived'>('all');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setIsLoading(true);
    setError('');

    try {
      const articlesData = await getMyArticles();
      setArticles(articlesData);
      onDataLoaded(articlesData);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки статей');
      console.error('Ошибка загрузки статей:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'Published' | 'Draft' | 'Archived') => {
    try {
      await changeArticleStatus(id, newStatus);
      setArticles(prev => prev.map(article => 
        article.id === id ? { ...article, status: newStatus } : article
      ));
    } catch (err: any) {
      setError(err.message || 'Ошибка при изменении статуса');
    }
  };

  const handleView = (id: string) => {
    router.push(`/articles/${id}`);
  };

  const getFilteredArticles = () => {
    if (filter === 'all') return articles;
    return articles.filter(article => article.status as string == filter);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка статей...</p>
      </div>
    );
  }

  const filteredArticles = getFilteredArticles();

  return (
    <div className={styles.tabContent}>
      {error && (
        <div className={styles.errorAlert}>
          <span className={styles.errorIcon}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className={styles.tabHeader}>
        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            Все ({articles.length})
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'Published' ? styles.active : ''}`}
            onClick={() => setFilter('Published')}
          >
            Опубликовано ({articles.filter(a => a.status === 'Published').length})
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'Draft' ? styles.active : ''}`}
            onClick={() => setFilter('Draft')}
          >
            Черновики ({articles.filter(a => a.status === 'Draft').length})
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'Archived' ? styles.active : ''}`}
            onClick={() => setFilter('Archived')}
          >
            Архив ({articles.filter(a => a.status === 'Archived').length})
          </button>
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => router.push('/create')}
            className={styles.createButton}
          >
            + Новая статья
          </button>
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📝</div>
          <h3>Статьи не найдены</h3>
          <p>
            {filter === 'all'
              ? 'У вас еще нет созданных статей. Создайте свою первую статью!'
              : `У вас нет статей со статусом "${filter === 'Published' ? 'Опубликовано' : filter === 'Draft' ? 'Черновик' : 'Архив'}".`}
          </p>
          <button
            onClick={() => router.push('/create')}
            className={styles.createFirstButton}
          >
            Создать первую статью
          </button>
        </div>
      ) : (
        <div className={styles.contentGrid}>
          {filteredArticles.map((article) => (
            <div key={article.id} className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <div className={`${styles.statusBadge} ${styles[article.status.toLowerCase()]}`}>
                  {article.status === 'Published' ? 'Опубликовано' : 
                   article.status === 'Draft' ? 'Черновик' : 
                   'В архиве'}
                </div>
                <div className={styles.articleType}>
                  {article.articleType}
                </div>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{article.title}</h3>
                <p className={styles.cardExcerpt}>{article.excerpt || 'Без описания'}</p>
                
                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaIcon}>⏱️</span>
                    <span className={styles.metaText}>{article.readingTimeMinutes} мин чтения</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaIcon}>❤️</span>
                    <span className={styles.metaText}>{article.likesCount} лайков</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaIcon}>💬</span>
                    <span className={styles.metaText}>{article.commentsCount} комментариев</span>
                  </div>
                </div>

                <div className={styles.cardDates}>
                  <div className={styles.dateItem}>
                    <span className={styles.dateLabel}>Создано:</span>
                    <span className={styles.dateValue}>{formatDate(article.createdOn)}</span>
                  </div>
                  <div className={styles.dateItem}>
                    <span className={styles.dateLabel}>Обновлено:</span>
                    <span className={styles.dateValue}>{formatDate(article.modifiedOn)}</span>
                  </div>
                </div>
              </div>

              <div className={styles.cardActions}>
                <div className={styles.actionButtons}>
                  <button
                    onClick={() => handleView(article.id)}
                    className={styles.viewButton}
                  >
                    Просмотр
                  </button>
                </div>

                <div className={styles.statusActions}>
                  <select
                    value={article.status}
                    onChange={(e) => handleStatusChange(article.id, e.target.value as any)}
                    className={styles.statusSelect}
                  >
                    <option value="Draft">Черновик</option>
                    <option value="Published">Опубликовать</option>
                    <option value="Archived">В архив</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyArticlesTab;