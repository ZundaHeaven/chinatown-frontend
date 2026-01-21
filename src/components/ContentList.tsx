import React from 'react';
import ArticleCard from './ArticleCard';
import RecipeCard from './RecipeCard';
import BookCard from './BookCard';
import styles from './ContentList.module.css';
import { Article } from '@/types/article';
import { ContentType } from '@/types/common';
import { Book } from '@/types/book';
import { Recipe } from '@/types/recipe';

interface ContentListProps {
  contentType: ContentType;
  items: any[];
}

const ContentList: React.FC<ContentListProps> = ({ contentType, items }) => {
  const renderContent = () => {
    if (items.length === 0) {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <h3 className={styles.emptyTitle}>Контент не найден</h3>
          <p className={styles.emptyDescription}>
            Попробуйте изменить параметры фильтров
          </p>
        </div>
      );
    }
    
    switch (contentType) {
      case 'articles':
        return items.map((article: Article) => (
          <ArticleCard key={article.id} article={article} />
        ));
      case 'recipes':
        return items.map((recipe: Recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ));
      case 'books':
        return items.map((book: Book) => (
          <BookCard key={book.id} book={book} />
        ));
      default:
        return null;
    }
  };
  
  return (
    <div className={styles.contentList}>
      <div className={styles.listHeader}>
        <h2 className={styles.listTitle}>
          {contentType === 'articles' && 'Статьи'}
          {contentType === 'recipes' && 'Рецепты'}
          {contentType === 'books' && 'Книги'}
        </h2>
        <span className={styles.itemsCount}>{items.length} записей</span>
      </div>
      
      <div className={styles.itemsContainer}>
        {renderContent()}
      </div>
    </div>
  );
};

export default ContentList;