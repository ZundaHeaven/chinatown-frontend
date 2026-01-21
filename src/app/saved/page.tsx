'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Like, ContentType, ContentStatus } from '@/types/common';
import { getMyLikes } from '@/services/like';
import { getArticleById } from '@/services/article';
import { getBookById } from '@/services/book';
import { getRecipeById } from '@/services/recipe';
import { getImageUrl } from '@/lib/file';
import styles from './SavedPage.module.css';

interface SavedContent {
  id: string;
  contentType: ContentType;
  title: string;
  excerpt: string;
  imageId?: string;
  coverFileId?: string;
  authorName: string;
  createdOn: Date;
  likesCount: number;
  slug: string;
  status: ContentStatus;
}

const SavedPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  const [content, setContent] = useState<SavedContent[]>([]);
  const [filteredContent, setFilteredContent] = useState<SavedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState<ContentType | 'all'>('all');

  useEffect(() => {
    if (user) {
      loadSavedContent();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadSavedContent = async () => {
    setIsLoading(true);
    setError('');

    try {
      const likes = await getMyLikes();
      
      const contentPromises = likes.map(async (like: Like) => {
        try {
          switch (like.contentType) {
            case 'Article':
              const article = await getArticleById(like.contentId);
              return {
                id: article.id,
                contentType: 'articles',
                title: article.title,
                excerpt: article.excerpt,
                authorName: article.authorName,
                createdOn: like.createdOn,
                likesCount: article.likesCount,
                slug: article.slug,
                status: article.status,
              } as SavedContent;
              
            case 'Book':
              const book = await getBookById(like.contentId);
              return {
                id: book.id,
                contentType: 'books',
                title: book.title,
                excerpt: book.excerpt,
                coverFileId: book.coverFileId,
                authorName: book.authorName,
                createdOn: like.createdOn,
                likesCount: book.likesCount,
                slug: book.slug,
                status: book.status,
              } as SavedContent;
              
            case 'Recipe':
              const recipe = await getRecipeById(like.contentId);
              return {
                id: recipe.id,
                contentType: 'recipes' as ContentType,
                title: recipe.title,
                excerpt: recipe.excerpt,
                imageId: recipe.imageId,
                authorName: recipe.username,
                createdOn: like.createdOn,
                likesCount: recipe.likesCount,
                slug: recipe.slug,
                status: 'Published',
              } as SavedContent;
              
            default:
              return null;
          }
        } catch (err) {
          console.error(`Ошибка загрузки контента ${like.contentId}:`, err);
          return null;
        }
      });

      const contentResults = await Promise.all(contentPromises);
      const validContent = contentResults.filter((item): item is SavedContent => item !== null);
      
      validContent.sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());
      
      setContent(validContent);
      setFilteredContent(validContent);
      
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки сохраненного контента');
      console.error('Ошибка загрузки лайков:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filter: ContentType | 'all') => {
    setActiveFilter(filter);
    
    if (filter === 'all') {
      setFilteredContent(content);
    } else {
      setFilteredContent(content.filter(item => item.contentType === filter));
    }
  };

  const handleContentClick = (contentItem: SavedContent) => {
    router.push(`/${contentItem.contentType}/${contentItem.id}`);
  };

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'articles':
        return '📝';
      case 'books':
        return '📚';
      case 'recipes':
        return '🍳';
      default:
        return '⭐';
    }
  };

  const getContentTypeLabel = (type: ContentType) => {
    switch (type) {
      case 'articles':
        return 'Статья';
      case 'books':
        return 'Книга';
      case 'recipes':
        return 'Рецепт';
      default:
        return 'Контент';
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className={styles.authRequired}>
        <div className={styles.authIcon}>🔒</div>
        <h2>Требуется авторизация</h2>
        <p>Для просмотра сохраненного контента необходимо войти в систему.</p>
        <button
          onClick={() => router.push('/auth/login')}
          className={styles.authButton}
        >
          Войти
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка сохраненного контента...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Сохраненный контент</h1>
          <p className={styles.subtitle}>
            Все материалы, которые вы отметили лайком
          </p>
        </div>
        
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{content.length}</span>
            <span className={styles.statLabel}>Всего</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {content.filter(c => c.contentType === 'articles').length}
            </span>
            <span className={styles.statLabel}>Статей</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {content.filter(c => c.contentType === 'books').length}
            </span>
            <span className={styles.statLabel}>Книг</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {content.filter(c => c.contentType === 'recipes').length}
            </span>
            <span className={styles.statLabel}>Рецептов</span>
          </div>
        </div>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <span className={styles.errorIcon}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className={styles.filters}>
        <button
          className={`${styles.filterButton} ${activeFilter === 'all' ? styles.active : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          Все ({content.length})
        </button>
        <button
          className={`${styles.filterButton} ${activeFilter === 'articles' ? styles.active : ''}`}
          onClick={() => handleFilterChange('articles')}
        >
          📝 Статьи ({content.filter(c => c.contentType === 'articles').length})
        </button>
        <button
          className={`${styles.filterButton} ${activeFilter === 'books' ? styles.active : ''}`}
          onClick={() => handleFilterChange('books')}
        >
          📚 Книги ({content.filter(c => c.contentType === 'books').length})
        </button>
        <button
          className={`${styles.filterButton} ${activeFilter === 'recipes' ? styles.active : ''}`}
          onClick={() => handleFilterChange('recipes')}
        >
          🍳 Рецепты ({content.filter(c => c.contentType === 'recipes').length})
        </button>
      </div>

      {filteredContent.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💾</div>
          <h3>Нет сохраненного контента</h3>
          <p>
            {activeFilter === 'all'
              ? 'Вы еще не сохранили ни одного материала. Отмечайте понравившийся контент лайками, и он появится здесь.'
              : `Вы еще не сохранили ни одного ${getContentTypeLabel(activeFilter as ContentType).toLowerCase()}.`}
          </p>
          <div className={styles.emptyActions}>
            <button
              onClick={() => router.push('/articles')}
              className={styles.exploreButton}
            >
              📝 Искать статьи
            </button>
            <button
              onClick={() => router.push('/books')}
              className={styles.exploreButton}
            >
              📚 Искать книги
            </button>
            <button
              onClick={() => router.push('/recipes')}
              className={styles.exploreButton}
            >
              🍳 Искать рецепты
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.contentGrid}>
          {filteredContent.map((item) => (
            <div
              key={`${item.contentType}-${item.id}`}
              className={styles.contentCard}
              onClick={() => handleContentClick(item)}
            >
              <div className={styles.cardHeader}>
                <div className={styles.contentTypeBadge}>
                  <span className={styles.typeIcon}>
                    {getContentTypeIcon(item.contentType)}
                  </span>
                  <span className={styles.typeLabel}>
                    {getContentTypeLabel(item.contentType)}
                  </span>
                </div>
                
                <div className={`${styles.statusBadge} ${styles[item.status?.toLowerCase() || 'published']}`}>
                  {item.status === 'Published' ? 'Опубликовано' : 
                   item.status === 'Draft' ? 'Черновик' : 
                   item.status === 'Archived' ? 'В архиве' : 'Опубликовано'}
                </div>
              </div>
              
              <div className={styles.cardImage}>
                {item.contentType === 'books' && item.coverFileId ? (
                  <img
                    src={getImageUrl(item.coverFileId)}
                    alt={item.title}
                    className={styles.image}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove(styles.hidden);
                    }}
                  />
                ) : item.contentType === 'recipes' && item.imageId ? (
                  <img
                    src={getImageUrl(item.imageId)}
                    alt={item.title}
                    className={styles.image}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove(styles.hidden);
                    }}
                  />
                ) : null}
                
                <div className={`${styles.imagePlaceholder} ${
                  (item.contentType === 'books' && item.coverFileId) || 
                  (item.contentType === 'recipes' && item.imageId) ? styles.hidden : ''
                }`}>
                  <span className={styles.placeholderIcon}>
                    {getContentTypeIcon(item.contentType)}
                  </span>
                </div>
              </div>
              
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardExcerpt}>{item.excerpt || 'Без описания'}</p>
                
                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaIcon}>👤</span>
                    <span className={styles.metaText}>{item.authorName}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaIcon}>📅</span>
                    <span className={styles.metaText}>
                      Сохранено: {formatDate(item.createdOn)}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaIcon}>❤️</span>
                    <span className={styles.metaText}>{item.likesCount} лайков</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.cardActions}>
                <button className={styles.viewButton}>
                  Перейти к материалу →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPage;