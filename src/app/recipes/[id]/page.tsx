'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LikeButton from '@/components/LikeButton';
import CommentsSection from '@/components/CommentsSection';
import styles from '../../ContentPage.module.css';
import { getImageUrl } from '@/lib/file';
import { getRecipeById, deleteRecipe, updateRecipe } from '@/services/recipe';
import { Recipe, RecipeUpdateRequest, RecipeDifficulty } from '@/types/recipe';
import EditRecipeModal from '@/components/EditRecipeModal';

const RecipePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const recipeId = params.id as string;
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadRecipe();
  }, [recipeId]);

  const loadRecipe = async () => {
    if (!recipeId) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const recipeData = await getRecipeById(recipeId);
      if (recipeData) {
        setRecipe(recipeData);
      } else {
        setError('Рецепт не найден');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки рецепта');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!recipe) return;
    
    if (!confirm(`Вы уверены, что хотите удалить рецепт "${recipe.title}"? Это действие нельзя отменить.`)) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      await deleteRecipe(recipe.id);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении рецепта');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (updateData: RecipeUpdateRequest) => {
    try {
      const updatedRecipe = await updateRecipe(recipeId, updateData);
      setRecipe(updatedRecipe);
      setIsEditModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении рецепта');
    }
  };

  const handleLikeUpdate = (newLikesCount: number) => {
    if (recipe) {
      setRecipe({
        ...recipe,
        likesCount: newLikesCount,
      });
    }
  };

  const handleCommentCountChange = (newCount: number) => {
    if (recipe) {
      setRecipe({
        ...recipe,
        commentsCount: newCount,
      });
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDifficultyText = (difficulty: RecipeDifficulty) => {
    const difficultyMap = {
      [RecipeDifficulty.Easy]: { label: 'Легко', color: '#10b981' },
      [RecipeDifficulty.Medium]: { label: 'Средне', color: '#f59e0b' },
      [RecipeDifficulty.Hard]: { label: 'Сложно', color: '#ef4444' },
      [RecipeDifficulty.Expert]: { label: 'Эксперт', color: '#7c3aed' },
    };
    
    const diffInfo = difficultyMap[difficulty];
    return (
      <span 
        className={styles.difficultyBadge}
        style={{ backgroundColor: diffInfo.color }}
      >
        {diffInfo.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка рецепта...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>❌</div>
        <h2>Рецепт не найден</h2>
        <p>Запрошенный рецепт не существует или был удален.</p>
        <button
          onClick={() => router.push('/')}
          className={styles.backButton}
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  const isAuthor = user?.id == recipe.userId;
  const canEdit = isAuthor || user?.role == "Admin";
  const canDelete = isAuthor || user?.role == "Admin";

  return (
    <>
      <div className={styles.contentContainer}>
        {error && (
          <div className={styles.errorAlert}>
            <span className={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className={styles.contentCard}>
          <div className={styles.contentHeader}>
            <div>
              <h1 className={styles.contentTitle}>{recipe.title}</h1>
              <div className={styles.metaInfo}>
                <span className={styles.author}>Автор: {recipe.username}</span>
                <span className={styles.time}>Время: {recipe.cookTimeMinutes} мин</span>
                <span className={styles.difficulty}>
                  Сложность: {getDifficultyText(recipe.difficulty)}
                </span>
              </div>
            </div>
            
            {(canEdit || canDelete) && (
              <div className={styles.contentActions}>
                {canEdit && (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className={styles.editButton}
                  >
                    Редактировать
                  </button>
                )}
                
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    className={styles.deleteButton}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Удаление...' : 'Удалить'}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className={styles.recipeContent}>
            <div className={styles.recipeImageSection}>
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
                  <span className={styles.imageIcon}>🍜</span>
                </div>
              </div>
            </div>
            
            <div className={styles.recipeDetails}>
              <div className={styles.description}>
                <h3 className={styles.sectionTitle}>Описание</h3>
                <p>{recipe.excerpt}</p>
              </div>
              
              <div className={styles.recipeSections}>
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>Ингредиенты</h4>
                  <div className={styles.ingredients}>
                    {recipe.ingredients.split('\n').map((ingredient, index) => (
                      ingredient.trim() ? (
                        <div key={index} className={styles.ingredientItem}>
                          <span className={styles.ingredientText}>{ingredient}</span>
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>
                
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>Инструкции</h4>
                  <div className={styles.instructions}>
                    {recipe.instructions.split('\n').map((instruction, index) => (
                      instruction.trim() ? (
                        <div key={index} className={styles.instructionStep}>
                          <span className={styles.stepNumber}>{index + 1}.</span>
                          <span className={styles.stepText}>{instruction}</span>
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>
              </div>
              
              <div className={styles.additionalInfo}>
                <div className={styles.infoSection}>
                  <h4 className={styles.infoTitle}>Типы рецепта</h4>
                  <div className={styles.tags}>
                    {recipe?.recipeTypes.map(type => (
                      <span key={type.id} className={styles.tag}>
                        {type.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className={styles.infoSection}>
                  <h4 className={styles.infoTitle}>Регионы</h4>
                  <div className={styles.tags}>
                    {recipe.regions.map(region => (
                      <span key={region.id} className={styles.tag}>
                        {region.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className={styles.infoSection}>
                  <h4 className={styles.infoTitle}>Информация</h4>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Время приготовления:</span>
                      <span className={styles.infoValue}>{recipe.cookTimeMinutes} минут</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Сложность:</span>
                      <span className={styles.infoValue}>
                        {getDifficultyText(recipe.difficulty)}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Добавлено:</span>
                      <span className={styles.infoValue}>{formatDate(recipe.createdOn)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.interactions}>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <LikeButton
                  contentId={recipe.id}
                  initialLikesCount={recipe.likesCount}
                  onLikeUpdate={handleLikeUpdate}
                />
              </div>
              <div className={styles.statItem}>
                <span className={styles.statIcon}>💬</span>
                <span className={styles.statLabel}>Комментарии</span>
                <span className={styles.statValue}>{recipe.commentsCount}</span>
              </div>
            </div>
          </div>

          <CommentsSection
            contentId={recipe.id}
            onCommentCountChange={handleCommentCountChange}
          />
        </div>
      </div>

      {isEditModalOpen && (
        <EditRecipeModal
          recipe={recipe}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
};

export default RecipePage;