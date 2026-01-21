'use client';

import React, { useState, useEffect } from 'react';
import { Article } from '@/types/article';
import { Book } from '@/types/book';
import { Recipe } from '@/types/recipe';
import { ContentStatus, ContentType } from '@/types/common';
import { getArticles, changeArticleStatus, deleteArticle } from '@/services/article';
import { getBooks, changeBookStatus, deleteBook } from '@/services/book';
import { getRecipes, changeRecipeStatus, deleteRecipe } from '@/services/recipe';
import styles from './AdminTab.module.css';

type ContentItem = {
  id: string;
  type: ContentType;
  title: string;
  status: ContentStatus;
  author: string;
  createdOn: Date;
  likes: number;
  comments: number;
};

const AdminContentTab: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<ContentType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [articles, books, recipes] = await Promise.all([
        getArticles(),
        getBooks(),
        getRecipes(),
      ]);

      const allContent: ContentItem[] = [
        ...articles.map(article => ({
          id: article.id,
          type: 'articles' as ContentType,
          title: article.title,
          status: article.status,
          author: article.authorName,
          createdOn: article.createdOn,
          likes: article.likesCount,
          comments: article.commentsCount,
        })),
        ...books.map(book => ({
          id: book.id,
          type: 'books' as ContentType,
          title: book.title,
          status: book.status,
          author: book.authorName,
          createdOn: book.createdOn,
          likes: book.likesCount,
          comments: book.commentsCount,
        })),
        ...recipes.map(recipe => ({
          id: recipe.id,
          type: 'recipes' as ContentType,
          title: recipe.title,
          status: recipe.status,
          author: recipe.username,
          createdOn: recipe.createdOn,
          likes: recipe.likesCount,
          comments: recipe.commentsCount,
        })),
      ];

      allContent.sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());
      setContent(allContent);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки контента');
      console.error('Ошибка загрузки контента:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, type: ContentType, newStatus: ContentStatus) => {
    try {
      switch (type) {
        case 'articles':
          await changeArticleStatus(id, newStatus);
          break;
        case 'books':
          await changeBookStatus(id, newStatus);
          break;
        case 'recipes':
          await changeRecipeStatus(id, newStatus);
          break;
      }

      setContent(prev => prev.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ));
    } catch (err: any) {
      setError(err.message || 'Ошибка при изменении статуса');
    }
  };

  const handleDelete = async (id: string, type: ContentType, title: string) => {
    if (!confirm(`Вы уверены, что хотите удалить "${title}"? Это действие нельзя отменить.`)) {
      return;
    }

    try {
      switch (type) {
        case 'articles':
          await deleteArticle(id);
          break;
        case 'books':
          await deleteBook(id);
          break;
        case 'recipes':
          await deleteRecipe(id);
          break;
      }

      setContent(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении');
    }
  };

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'articles': return '📝';
      case 'books': return '📚';
      case 'recipes': return '🍳';
      default: return '📄';
    }
  };

  const getTypeLabel = (type: ContentType) => {
    switch (type) {
      case 'articles': return 'Статья';
      case 'books': return 'Книга';
      case 'recipes': return 'Рецепт';
      default: return 'Контент';
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFilteredContent = () => {
    let filtered = content;

    if (filter !== 'all') {
      filtered = filtered.filter(item => item.type === filter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.author.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка контента...</p>
      </div>
    );
  }

  const filteredContent = getFilteredContent();

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <div>
          <h2 className={styles.tabTitle}>Управление контентом</h2>
          <p className={styles.tabDescription}>
            Просмотр и управление всем контентом системы. Всего материалов: {content.length}
          </p>
        </div>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <span className={styles.errorIcon}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className={styles.filtersBar}>
        <div className={styles.filterGroup}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as ContentType | 'all')}
            className={styles.filterSelect}
          >
            <option value="all">Все типы</option>
            <option value="articles">Статьи</option>
            <option value="books">Книги</option>
            <option value="recipes">Рецепты</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ContentStatus | 'all')}
            className={styles.filterSelect}
          >
            <option value="all">Все статусы</option>
            <option value="Published">Опубликовано</option>
            <option value="Draft">Черновики</option>
            <option value="Archived">В архиве</option>
          </select>
          
          <input
            type="text"
            placeholder="Поиск по названию или автору..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <button
          onClick={loadContent}
          className={styles.refreshButton}
        >
          Обновить
        </button>
      </div>

      {filteredContent.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📄</div>
          <h3>Контент не найден</h3>
          <p>
            {searchTerm || filter !== 'all' || statusFilter !== 'all' 
              ? 'По вашему запросу ничего не найдено.'
              : 'В системе пока нет контента.'}
          </p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Тип</th>
                <th className={styles.th}>Название</th>
                <th className={styles.th}>Автор</th>
                <th className={styles.th}>Статус</th>
                <th className={styles.th}>Дата</th>
                <th className={styles.th}>Статистика</th>
                <th className={styles.th}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredContent.map((item) => (
                <tr key={`${item.type}-${item.id}`} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.typeCell}>
                      <span className={styles.typeIcon}>{getTypeIcon(item.type)}</span>
                      <span className={styles.typeLabel}>{getTypeLabel(item.type)}</span>
                    </div>
                  </td>
                  
                  <td className={styles.td}>
                    <span className={styles.titleCell}>{item.title}</span>
                  </td>
                  
                  <td className={styles.td}>
                    <span className={styles.authorCell}>{item.author}</span>
                  </td>
                  
                  <td className={styles.td}>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, item.type, e.target.value as ContentStatus)}
                      className={styles.statusSelect}
                    >
                      <option value="Draft">Черновик</option>
                      <option value="Published">Опубликовано</option>
                      <option value="Archived">В архиве</option>
                    </select>
                  </td>
                  
                  <td className={styles.td}>
                    <span className={styles.dateCell}>{formatDate(item.createdOn)}</span>
                  </td>
                  
                  <td className={styles.td}>
                    <div className={styles.statsCell}>
                      <span className={styles.statItem}>❤️ {item.likes}</span>
                      <span className={styles.statItem}>💬 {item.comments}</span>
                    </div>
                  </td>
                  
                  <td className={styles.td}>
                    <div className={styles.actionButtons}>
                      <button
                        onClick={() => window.open(`/${item.type}/${item.id}`, '_blank')}
                        className={styles.viewButton}
                      >
                        Просмотр
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.type, item.title)}
                        className={styles.deleteButton}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminContentTab;