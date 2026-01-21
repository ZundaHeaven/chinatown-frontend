'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminGenresTab from '@/components/admin/AdminGenresTab';
import AdminRecipeTypesTab from '@/components/admin/AdminRecipeTypesTab';
import AdminRegionsTab from '@/components/admin/AdminRegionsTab';
import AdminUsersTab from '@/components/admin/AdminUsersTab';
import AdminContentTab from '@/components/admin/AdminContentTab';
import AdminArticleTypesTab from '@/components/admin/AdminArticleTypesTab';
import styles from './AdminPage.module.css';

type AdminTab = 'content' | 'article-types' | 'genres' | 'recipe-types' | 'regions' | 'users';

const AdminPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<AdminTab>('content');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'Admin') {
      router.push('/');
      return;
    }

    setIsLoading(false);
  }, [user, router]);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Проверка прав доступа...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Панель администратора</h1>
          <p className={styles.subtitle}>
            Управление контентом, категориями и пользователями системы
          </p>
        </div>
        
        <div className={styles.adminInfo}>
          <div className={styles.adminBadge}>
            <span className={styles.badgeIcon}>👑</span>
            <span className={styles.badgeText}>Администратор</span>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.username}</span>
            <span className={styles.userEmail}>{user?.email}</span>
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'content' ? styles.active : ''}`}
            onClick={() => handleTabChange('content')}
          >
            <span className={styles.tabIcon}>📊</span>
            <span className={styles.tabText}>Контент</span>
          </button>
          
          <button
            className={`${styles.tab} ${activeTab === 'article-types' ? styles.active : ''}`}
            onClick={() => handleTabChange('article-types')}
          >
            <span className={styles.tabIcon}>📑</span>
            <span className={styles.tabText}>Типы статей</span>
          </button>
          
          <button
            className={`${styles.tab} ${activeTab === 'genres' ? styles.active : ''}`}
            onClick={() => handleTabChange('genres')}
          >
            <span className={styles.tabIcon}>🏷️</span>
            <span className={styles.tabText}>Жанры</span>
          </button>
          
          <button
            className={`${styles.tab} ${activeTab === 'recipe-types' ? styles.active : ''}`}
            onClick={() => handleTabChange('recipe-types')}
          >
            <span className={styles.tabIcon}>🍲</span>
            <span className={styles.tabText}>Типы рецептов</span>
          </button>
          
          <button
            className={`${styles.tab} ${activeTab === 'regions' ? styles.active : ''}`}
            onClick={() => handleTabChange('regions')}
          >
            <span className={styles.tabIcon}>🌍</span>
            <span className={styles.tabText}>Регионы</span>
          </button>
          
          <button
            className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
            onClick={() => handleTabChange('users')}
          >
            <span className={styles.tabIcon}>👥</span>
            <span className={styles.tabText}>Пользователи</span>
          </button>
        
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'content' && <AdminContentTab />}
          {activeTab === 'article-types' && <AdminArticleTypesTab />}
          {activeTab === 'genres' && <AdminGenresTab />}
          {activeTab === 'recipe-types' && <AdminRecipeTypesTab />}
          {activeTab === 'regions' && <AdminRegionsTab />}
          {activeTab === 'users' && <AdminUsersTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;