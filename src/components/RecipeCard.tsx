import React from 'react';
import styles from './ContentCard.module.css';
import { Recipe, RecipeDifficulty } from '@/types/recipe';
import Link from 'next/link';
import { API_URL } from '@/lib/auth';

interface RecipeCardProps {
  recipe: Recipe;
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
              {recipe.username?.charAt(0) || 'П'}
            </span>
          </div>
          <div className={styles.userDetails}>
            <Link href={`/users/${recipe.userId}`}>
              <span className={styles.username}>{recipe.username}</span>
            </Link>
            <span className={styles.postMeta}>
              {getDifficultyText(recipe.difficulty)} • {recipe.cookTimeMinutes} мин
            </span>
          </div>
        </div>
      </div>
      
      <Link href={`/recipes/${recipe.id}`}>
        <div className={styles.recipeContent}>
        <div className={styles.recipeImage}>
          <div className={styles.imagePlaceholder}>
            <img src={`${API_URL}/images/${recipe.imageId}`} alt="" className={styles.bookImageCover}/>
          </div>
        </div>
        
        <div className={styles.recipeDetails}>
          <h3 className={styles.cardTitle}>{recipe.title}</h3>
          
          <p className={styles.cardExcerpt}>{recipe.excerpt}</p>
          
          <div className={styles.recipeTags}>
            {recipe.recipeTypes?.slice(0, 2).map((type) => (
              <span key={type.id} className={styles.tag}>
                {type.name}
              </span>
            ))}
            {recipe.regions?.slice(0, 1).map((region) => (
              <span key={region.id} className={styles.tag}>
                {region.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      </Link>

      
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