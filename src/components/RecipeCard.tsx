import React from 'react';
import styles from './ContentCard.module.css';
import { RecipeDifficulty, RecipeDto } from '@/types/recipe';

interface RecipeCardProps {
  recipe: RecipeDto;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const getDifficultyText = (difficulty: RecipeDifficulty) => {
    switch (difficulty) {
      case RecipeDifficulty.Easy: return 'Легко';
      case RecipeDifficulty.Medium: return 'Средне';
      case RecipeDifficulty.Hard: return 'Сложно';
      case RecipeDifficulty.Expert: return 'Эксперт';
      default: return 'Не указано';
    }
  };
  
  return (
    <div className={`${styles.card} ${styles.recipeCard}`}>
      <div className={styles.cardHeader}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <span className={styles.avatarText}>
              {recipe.authorName.charAt(0)}
            </span>
          </div>
          <div className={styles.userDetails}>
            <span className={styles.username}>Пользователь</span>
            <span className={styles.postMeta}>
              {getDifficultyText(recipe.difficulty)} • {recipe.cookTimeMinutes} мин
            </span>
          </div>
        </div>
      </div>
      
      <div className={styles.recipeContent}>
        <div className={styles.recipeImage}>
          <div className={styles.imagePlaceholder}>
            <span className={styles.imageIcon}>🍜</span>
          </div>
        </div>
        
        <div className={styles.recipeDetails}>
          <h3 className={styles.cardTitle}>{recipe.title}</h3>
          
          <p className={styles.cardExcerpt}>{recipe.excerpt}</p>
          
          <div className={styles.recipeTags}>
            {recipe.recipeTypeClaims.slice(0, 2).map((type) => (
              <span key={type.id} className={styles.tag}>
                {type.name}
              </span>
            ))}
            {recipe.recipeRegions.slice(0, 1).map((region) => (
              <span key={region.id} className={styles.tag}>
                {region.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className={styles.cardStats}>
        <div className={styles.stat}>
          <span className={styles.statIcon}>❤️</span>
          <span className={styles.statValue}>{recipe.likesCount}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>💬</span>
          <span className={styles.statValue}>{recipe.commentsCount}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>⏱️</span>
          <span className={styles.statValue}>
            {recipe.cookTimeMinutes} мин
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;