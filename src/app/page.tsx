'use client';

import React, { useState, useEffect } from 'react';
import ContentTabs from '@/components/ContentTabs';
import FilterPanel from '@/components/FilterPanel';
import ContentList from '@/components/ContentList';
import { ContentType } from '@/types';
import styles from './page.module.css';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ContentType>('articles');
  const [filters, setFilters] = useState<any>({});
  
  // Данные для демонстрации (в реальном приложении будут приходить с API)
  const [articles, setArticles] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  
  // Загрузка данных (заглушки)
  useEffect(() => {
    // Заглушки данных
    const mockArticles = [
      {
        id: '1',
        title: 'Искусство китайской каллиграфии',
        slug: 'iskusstvo-kitayskoy-kalligrafii',
        excerpt: 'Исследование истории и техник древнего искусства',
        body: 'Полный текст статьи о каллиграфии...',
        readingTimeMinutes: 8,
        status: 'published',
        articleType: 'Культура',
        articleTypeId: '1',
        authorId: '1',
        authorName: 'Ли Вэй',
        likesCount: 42,
        commentsCount: 12,
        createdOn: new Date('2024-01-15'),
        modifiedOn: new Date('2024-01-15'),
      }
    ];
    
    const mockRecipes = [
      {
        id: '1',
        title: 'Утка по-пекински',
        slug: 'utka-po-pekinski',
        excerpt: 'Классическое блюдо китайской кухни',
        difficulty: 3,
        ingredients: 'Утка, мед, соевый соус, имбирь, чеснок',
        instructions: 'Пошаговый рецепт приготовления...',
        cookTimeMinutes: 120,
        imageId: '1',
        authorId: '2',
        authorName: 'Чжан Ли',
        likesCount: 89,
        commentsCount: 24,
        createdOn: new Date('2024-02-10'),
        modifiedOn: new Date('2024-02-10'),
        recipeTypeClaims: [{ id: '1', name: 'Мясные блюда' }],
        recipeRegions: [{ id: '1', name: 'Пекин' }],
      }
    ];
    
    const mockBooks = [
      {
        id: '1',
        title: 'Дао Дэ Цзин',
        slug: 'dao-de-tszin',
        excerpt: 'Древний китайский философский трактат',
        authorName: 'Лао-цзы',
        description: 'Основополагающий текст даосизма',
        pageAmount: 128,
        yearOfPublish: -400,
        fileSizeBytes: 2048000,
        createdOn: new Date('2024-01-01'),
        modifiedOn: new Date('2024-01-01'),
        genres: [{ id: '1', name: 'Философия' }],
        coverFileId: '1',
        bookFileId: '1',
        status: 2,
        userId: '3',
        username: 'Администратор',
        likesCount: 156,
        commentsCount: 45,
      }
    ];
    
    setArticles(mockArticles);
    setRecipes(mockRecipes);
    setBooks(mockBooks);
  }, []);
  
  const handleTabChange = (tab: ContentType) => {
    setActiveTab(tab);
    setFilters({}); // Сброс фильтров при смене раздела
  };
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // Здесь будет логика фильтрации данных
  };
  
  const getCurrentContent = () => {
    switch (activeTab) {
      case 'articles': return articles;
      case 'recipes': return recipes;
      case 'books': return books;
      default: return [];
    }
  };
  
  return (
    <div className={styles.page}>
      <div className={styles.contentNavigation}>
        <ContentTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
      
      <div className={styles.mainLayout}>
        <aside className={styles.filterPanel}>
          <FilterPanel 
            contentType={activeTab}
            onFilterChange={handleFilterChange}
            filters={filters}
          />
        </aside>
        
        <main className={styles.contentArea}>
          <ContentList 
            contentType={activeTab}
            items={getCurrentContent()}
          />
        </main>
      </div>
    </div>
  );
};

export default HomePage;