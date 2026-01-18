import React from 'react';
import styles from './ContentList.module.css';
import { ArticleDto } from '@/types/article';
import { BookDto } from '@/types/book';
import { ContentType } from '@/types/common';
import { RecipeDto } from '@/types/recipe';
import ArticleCard from './ArticleCard';
import BookCard from './BookCard';
import RecipeCard from './RecipeCard';

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
            Попробуйте изменить параметры фильтров или загрузите контент
          </p>
        </div>
      );
    }
    
    switch (contentType) {
      case 'articles':
        return items.map((article: ArticleDto) => (
          <ArticleCard key={article.id} article={article} />
        ));
      case 'recipes':
        return items.map((recipe: RecipeDto) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ));
      case 'books':
        return items.map((book: BookDto) => (
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