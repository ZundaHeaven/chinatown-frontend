'use client';

import React, { useState, useEffect } from 'react';
import ContentTabs from '@/components/ContentTabs';
import FilterPanel from '@/components/FilterPanel';
import ContentList from '@/components/ContentList';
import styles from './page.module.css';
import { getArticles } from '@/services/article';
import { getArticleTypes } from '@/services/article-type';
import { getBooks } from '@/services/book';
import { getGenres } from '@/services/genre';
import { getRecipes } from '@/services/recipe';
import { getRecipeTypes } from '@/services/recipe-type';
import { Article, ArticleFilter } from '@/types/article';
import { Book, BookFilter } from '@/types/book';
import { ContentType } from '@/types/common';
import { Recipe, RecipeFilter } from '@/types/recipe';
import { getRegions } from '@/services/region';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ContentType>('articles');
  const [loading, setLoading] = useState(false);
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  
  const [articleFilters, setArticleFilters] = useState<ArticleFilter>({
    search: null,
    type: null,
    authorId: null,
    sort: null,
    status: 'Published'
  });
  
  const [bookFilters, setBookFilters] = useState<BookFilter>({
    title: null,
    authorName: null,
    genreIds: [],
    yearMin: null,
    yearMax: null,
    available: true,
    sort: null
  });
  
  const [recipeFilters, setRecipeFilters] = useState<RecipeFilter>({
    title: null,
    recipeDifficulty: null,
    recipeTypeIds: null,
    regionIds: null,
    cookTimeMin: null,
    cookTimeMax: null,
    available: true,
    sort: null
  });
  
  const [articleTypes, setArticleTypes] = useState<{ id: string; name: string }[]>([]);
  const [genres, setGenres] = useState<{ id: string; name: string }[]>([]);
  const [recipeTypes, setRecipeTypes] = useState<{ id: string; name: string }[]>([]);
  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const loadFilterData = async () => {
      if (activeTab === 'articles') {
        const types = await getArticleTypes();
        setArticleTypes(types.map(t => ({ id: t.id, name: t.name })));
      } else if (activeTab === 'books') {
        const genreList = await getGenres();
        setGenres(genreList.map(g => ({ id: g.id, name: g.name })));
      } else if (activeTab === 'recipes') {
        const types = await getRecipeTypes();
        const regionList = await getRegions();
        setRecipeTypes(types.map(t => ({ id: t.id, name: t.name })));
        setRegions(regionList.map(r => ({ id: r.id, name: r.name })));
      }
    };
    
    loadFilterData();
  }, [activeTab]);

  const loadContent = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'articles':
          const articlesData = await getArticles(articleFilters);
          setArticles(articlesData);
          break;
        case 'books':
          const booksData = await getBooks(bookFilters);
          setBooks(booksData);
          break;
        case 'recipes':
          const recipesData = await getRecipes(recipeFilters);
          setRecipes(recipesData);
          break;
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [activeTab, articleFilters, bookFilters, recipeFilters]);

  const handleTabChange = (tab: ContentType) => {
    setActiveTab(tab);
  };

  const handleArticleFilterChange = (newFilters: ArticleFilter) => {
    newFilters.status = 'Published';
    setArticleFilters(newFilters);
  };

  const handleBookFilterChange = (newFilters: BookFilter) => {
    setBookFilters(newFilters);
  };

  const handleRecipeFilterChange = (newFilters: RecipeFilter) => {
    setRecipeFilters(newFilters);
  };

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'articles': return articles;
      case 'recipes': return recipes;
      case 'books': return books;
      default: return [];
    }
  };

  const getCurrentFilters = () => {
    switch (activeTab) {
      case 'articles': return articleFilters;
      case 'books': return bookFilters;
      case 'recipes': return recipeFilters;
      default: return {};
    }
  };

  const handleFilterChange = (newFilters: any) => {
    switch (activeTab) {
      case 'articles':
        handleArticleFilterChange(newFilters);
        break;
      case 'books':
        handleBookFilterChange(newFilters);
        break;
      case 'recipes':
        handleRecipeFilterChange(newFilters);
        break;
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
            filters={getCurrentFilters()}
            filterData={{
              articleTypes,
              genres,
              recipeTypes,
              regions
            }}
          />
        </aside>
        
        <main className={styles.contentArea}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Загрузка...</p>
            </div>
          ) : (
            <ContentList 
              contentType={activeTab}
              items={getCurrentContent()}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;