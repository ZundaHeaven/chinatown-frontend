'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './MyContentPage.module.css';
import MyArticlesTab from '@/components/MyArticlesTab';
import MyBooksTab from '@/components/MyBooksTab';
import MyRecipesTab from '@/components/MyRecipesTab';

type ContentTab = 'articles' | 'books' | 'recipes';

const MyContentPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [activeTab, setActiveTab] = useState<ContentTab>('articles');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    articles: { total: 0, published: 0, draft: 0, archived: 0 },
    books: { total: 0, published: 0, draft: 0, archived: 0 },
    recipes: { total: 0, published: 0, draft: 0, archived: 0 },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleTabChange = (tab: ContentTab) => {
    setActiveTab(tab);
  };

  const updateStats = (type: ContentTab, data: any[]) => {
    const newStats = {
      total: data.length,
      published: data.filter(item => item.status === 'Published').length,
      draft: data.filter(item => item.status === 'Draft').length,
      archived: data.filter(item => item.status === 'Archived').length,
    };
    
    setStats(prev => ({
      ...prev,
      [type]: newStats,
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Перенаправление на страницу входа...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Мой контент</h1>
          <p className={styles.subtitle}>
            Управляйте всем контентом, который вы создали на платформе
          </p>
        </div>
        
        <button
          onClick={() => router.push('/create')}
          className={styles.createNewButton}
        >
          + Создать новый
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>📝</div>
            <h3 className={styles.statTitle}>Статьи</h3>
          </div>
          <div className={styles.statNumbers}>
            <div className={styles.statNumber}>
              <span className={styles.statValue}>{stats.articles.total}</span>
              <span className={styles.statLabel}>Всего</span>
            </div>
            <div className={styles.statNumber}>
              <span className={`${styles.statValue} ${styles.published}`}>
                {stats.articles.published}
              </span>
              <span className={styles.statLabel}>Опубликовано</span>
            </div>
            <div className={styles.statNumber}>
              <span className={`${styles.statValue} ${styles.draft}`}>
                {stats.articles.draft}
              </span>
              <span className={styles.statLabel}>Черновики</span>
            </div>
            <div className={styles.statNumber}>
              <span className={`${styles.statValue} ${styles.archived}`}>
                {stats.articles.archived}
              </span>
              <span className={styles.statLabel}>В архиве</span>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>📚</div>
            <h3 className={styles.statTitle}>Книги</h3>
          </div>
          <div className={styles.statNumbers}>
            <div className={styles.statNumber}>
              <span className={styles.statValue}>{stats.books.total}</span>
              <span className={styles.statLabel}>Всего</span>
            </div>
            <div className={styles.statNumber}>
              <span className={`${styles.statValue} ${styles.published}`}>
                {stats.books.published}
              </span>
              <span className={styles.statLabel}>Опубликовано</span>
            </div>
            <div className={styles.statNumber}>
              <span className={`${styles.statValue} ${styles.draft}`}>
                {stats.books.draft}
              </span>
              <span className={styles.statLabel}>Черновики</span>
            </div>
            <div className={styles.statNumber}>
              <span className={`${styles.statValue} ${styles.archived}`}>
                {stats.books.archived}
              </span>
              <span className={styles.statLabel}>В архиве</span>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>🍳</div>
            <h3 className={styles.statTitle}>Рецепты</h3>
          </div>
          <div className={styles.statNumbers}>
            <div className={styles.statNumber}>
              <span className={styles.statValue}>{stats.recipes.total}</span>
              <span className={styles.statLabel}>Всего</span>
            </div>
            <div className={styles.statNumber}>
              <span className={`${styles.statValue} ${styles.published}`}>
                {stats.recipes.published}
              </span>
              <span className={styles.statLabel}>Опубликовано</span>
            </div>
            <div className={styles.statNumber}>
              <span className={`${styles.statValue} ${styles.draft}`}>
                {stats.recipes.draft}
              </span>
              <span className={styles.statLabel}>Черновики</span>
            </div>
            <div className={styles.statNumber}>
              <span className={`${styles.statValue} ${styles.archived}`}>
                {stats.recipes.archived}
              </span>
              <span className={styles.statLabel}>В архиве</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'articles' ? styles.active : ''}`}
            onClick={() => handleTabChange('articles')}
          >
            <span className={styles.tabIcon}>📝</span>
            <span className={styles.tabText}>Статьи</span>
            <span className={styles.tabCount}>{stats.articles.total}</span>
          </button>
          
          <button
            className={`${styles.tab} ${activeTab === 'books' ? styles.active : ''}`}
            onClick={() => handleTabChange('books')}
          >
            <span className={styles.tabIcon}>📚</span>
            <span className={styles.tabText}>Книги</span>
            <span className={styles.tabCount}>{stats.books.total}</span>
          </button>
          
          <button
            className={`${styles.tab} ${activeTab === 'recipes' ? styles.active : ''}`}
            onClick={() => handleTabChange('recipes')}
          >
            <span className={styles.tabIcon}>🍳</span>
            <span className={styles.tabText}>Рецепты</span>
            <span className={styles.tabCount}>{stats.recipes.total}</span>
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'articles' && (
            <MyArticlesTab onDataLoaded={(data) => updateStats('articles', data)} />
          )}
          
          {activeTab === 'books' && (
            <MyBooksTab onDataLoaded={(data) => updateStats('books', data)} />
          )}
          
          {activeTab === 'recipes' && (
            <MyRecipesTab onDataLoaded={(data) => updateStats('recipes', data)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyContentPage;