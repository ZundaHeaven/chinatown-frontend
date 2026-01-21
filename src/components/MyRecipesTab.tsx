'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Recipe, RecipeDifficulty } from '@/types/recipe';
import { getMyRecipes, deleteRecipe, changeRecipeStatus } from '@/services/recipe';
import { getImageUrl } from '@/lib/file';
import styles from './MyContentTab.module.css';

interface MyRecipesTabProps {
  onDataLoaded: (data: Recipe[]) => void;
}

const MyRecipesTab: React.FC<MyRecipesTabProps> = ({ onDataLoaded }) => {
  const router = useRouter();
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'Published' | 'Draft' | 'Archived'>('all');

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    setIsLoading(true);
    setError('');

    try {
      const recipesData = await getMyRecipes();
      setRecipes(recipesData);
      onDataLoaded(recipesData);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки рецептов');
      console.error('Ошибка загрузки рецептов:', err);
    } finally {
      setIsLoading(false);
    }
  };


  const handleStatusChange = async (id: string, newStatus: 'Published' | 'Draft' | 'Archived') => {
    try {
      await changeRecipeStatus(id, newStatus);
      setRecipes(prev => prev.map(recipe => 
        recipe.id === id ? { ...recipe, status: newStatus } : recipe
      ));
    } catch (err: any) {
      setError(err.message || 'Ошибка при изменении статуса');
    }
  };

  const handleView = (id: string) => {
    router.push(`/recipes/${id}`);
  };

  const getFilteredRecipes = () => {
    if (filter === 'all') return recipes;
    return recipes.filter(recipe => recipe.status as string === filter);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDifficultyText = (difficulty: RecipeDifficulty) => {
    switch (difficulty) {
      case RecipeDifficulty.Easy: return 'Легко';
      case RecipeDifficulty.Medium: return 'Средне';
      case RecipeDifficulty.Hard: return 'Сложно';
      case RecipeDifficulty.Expert: return 'Эксперт';
      default: return 'Неизвестно';
    }
  };

  const getDifficultyColor = (difficulty: RecipeDifficulty) => {
    switch (difficulty) {
      case RecipeDifficulty.Easy: return '#10b981';
      case RecipeDifficulty.Medium: return '#f59e0b';
      case RecipeDifficulty.Hard: return '#ef4444';
      case RecipeDifficulty.Expert: return '#7c3aed';
      default: return '#6b7280';
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка рецептов...</p>
      </div>
    );
  }

  const filteredRecipes = getFilteredRecipes();

  return (
    <div className={styles.tabContent}>
      {error && (
        <div className={styles.errorAlert}>
          <span className={styles.errorIcon}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className={styles.tabHeader}>
        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            Все ({recipes.length})
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'Published' ? styles.active : ''}`}
            onClick={() => setFilter('Published')}
          >
            Опубликовано ({recipes.filter(r => r.status === 'Published').length})
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'Draft' ? styles.active : ''}`}
            onClick={() => setFilter('Draft')}
          >
            Черновики ({recipes.filter(r => r.status === 'Draft').length})
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'Archived' ? styles.active : ''}`}
            onClick={() => setFilter('Archived')}
          >
            Архив ({recipes.filter(r => r.status === 'Archived').length})
          </button>
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => router.push('/create')}
            className={styles.createButton}
          >
            + Новый рецепт
          </button>
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🍳</div>
          <h3>Рецепты не найдены</h3>
          <p>
            {filter === 'all'
              ? 'У вас еще нет созданных рецептов. Создайте свой первый рецепт!'
              : `У вас нет рецептов со статусом "${filter === 'Published' ? 'Опубликовано' : filter === 'Draft' ? 'Черновик' : 'Архив'}".`}
          </p>
          <button
            onClick={() => router.push('/create')}
            className={styles.createFirstButton}
          >
            Создать первый рецепт
          </button>
        </div>
      ) : (
        <div className={styles.contentGrid}>
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <div className={`${styles.statusBadge} ${styles[recipe.status.toLowerCase()]}`}>
                  {recipe.status === 'Published' ? 'Опубликовано' : 
                   recipe.status === 'Draft' ? 'Черновик' : 
                   'В архиве'}
                </div>
                <div 
                  className={styles.difficultyBadge}
                  style={{ 
                    backgroundColor: getDifficultyColor(recipe.difficulty),
                    color: 'white'
                  }}
                >
                  {getDifficultyText(recipe.difficulty)}
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.recipeImage}>
                  {recipe.imageId ? (
                    <img
                      src={getImageUrl(recipe.imageId)}
                      alt={recipe.title}
                      className={styles.image}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove(styles.hidden);
                      }}
                    />
                  ) : null}
                  <div className={`${styles.imagePlaceholder} ${recipe.imageId ? styles.hidden : ''}`}>
                    <span className={styles.placeholderIcon}>🍳</span>
                  </div>
                </div>

                <div className={styles.recipeDetails}>
                  <h3 className={styles.cardTitle}>{recipe.title}</h3>
                  <p className={styles.cardExcerpt}>{recipe.excerpt || 'Без описания'}</p>
                  
                  <div className={styles.recipeInfo}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Время:</span>
                      <span className={styles.infoValue}>{recipe.cookTimeMinutes} мин</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Ингредиентов:</span>
                      <span className={styles.infoValue}>
                        {recipe.ingredients.split('\n').filter(l => l.trim()).length}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Шагов:</span>
                      <span className={styles.infoValue}>
                        {recipe.instructions.split('\n').filter(l => l.trim()).length}
                      </span>
                    </div>
                  </div>

                  <div className={styles.tags}>
                    {recipe.recipeTypes.slice(0, 2).map(type => (
                      <span key={type.id} className={styles.tag}>
                        {type.name}
                      </span>
                    ))}
                    {recipe.recipeTypes.length > 2 && (
                      <span className={styles.moreTags}>+{recipe.recipeTypes.length - 2}</span>
                    )}
                  </div>

                  <div className={styles.cardMeta}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaIcon}>❤️</span>
                      <span className={styles.metaText}>{recipe.likesCount} лайков</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaIcon}>💬</span>
                      <span className={styles.metaText}>{recipe.commentsCount} комментариев</span>
                    </div>
                  </div>

                  <div className={styles.cardDates}>
                    <div className={styles.dateItem}>
                      <span className={styles.dateLabel}>Создано:</span>
                      <span className={styles.dateValue}>{formatDate(recipe.createdOn)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.cardActions}>
                <div className={styles.actionButtons}>
                  <button
                    onClick={() => handleView(recipe.id)}
                    className={styles.viewButton}
                  >
                    Просмотр
                  </button>

                </div>

                <div className={styles.statusActions}>
                  <select
                    value={recipe.status}
                    onChange={(e) => handleStatusChange(recipe.id, e.target.value as any)}
                    className={styles.statusSelect}
                  >
                    <option value="Draft">Черновик</option>
                    <option value="Published">Опубликовать</option>
                    <option value="Archived">В архив</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecipesTab;