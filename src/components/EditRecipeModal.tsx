'use client';

import React, { useState, useEffect } from 'react';
import { Recipe, RecipeUpdateRequest, RecipeDifficulty } from '@/types/recipe';
import { RecipeType } from '@/types/recipe-type';
import { Region } from '@/types/region';
import { getRecipeTypes } from '@/services/recipe-type';
import { getRegions } from '@/services/region';
import styles from './EditModal.module.css';

interface EditRecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onUpdate: (data: RecipeUpdateRequest) => Promise<void>;
}

const EditRecipeModal: React.FC<EditRecipeModalProps> = ({ recipe, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<RecipeUpdateRequest>({
    title: recipe.title,
    difficulty: recipe.difficulty,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    cookTimeMinutes: recipe.cookTimeMinutes,
    recipeTypeIds: recipe.recipeTypes.map(type => type.id),
    regionIds: recipe.regions.map(region => region.id),
    status: recipe.status
  });

  const [recipeTypes, setRecipeTypes] = useState<RecipeType[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsDataLoading(true);
      const [typesData, regionsData] = await Promise.all([
        getRecipeTypes(),
        getRegions(),
      ]);
      setRecipeTypes(typesData);
      setRegions(regionsData);
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await onUpdate(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении рецепта');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value,
    }));
  };

  const handleRecipeTypeChange = (typeId: string) => {
    setFormData(prev => {
      const currentTypeIds = prev.recipeTypeIds;
      const updatedTypeIds = currentTypeIds.includes(typeId)
        ? currentTypeIds.filter(id => id !== typeId)
        : [...currentTypeIds, typeId];
      return {
        ...prev,
        recipeTypeIds: updatedTypeIds,
      };
    });
  };

  const handleRegionChange = (regionId: string) => {
    setFormData(prev => {
      const currentRegionIds = prev.regionIds;
      const updatedRegionIds = currentRegionIds.includes(regionId)
        ? currentRegionIds.filter(id => id !== regionId)
        : [...currentRegionIds, regionId];
      return {
        ...prev,
        regionIds: updatedRegionIds,
      };
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Редактировать рецепт</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorAlert}>
              <span className={styles.errorIcon}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="title">Название</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="cookTimeMinutes">Время приготовления (минуты)</label>
              <input
                type="number"
                id="cookTimeMinutes"
                name="cookTimeMinutes"
                value={formData.cookTimeMinutes}
                onChange={handleChange}
                min="1"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="difficulty">Сложность</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className={styles.select}
              >
                <option value={RecipeDifficulty.Easy}>Легко</option>
                <option value={RecipeDifficulty.Medium}>Средне</option>
                <option value={RecipeDifficulty.Hard}>Сложно</option>
                <option value={RecipeDifficulty.Expert}>Эксперт</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ingridients">Ингредиенты (каждый ингредиент с новой строки)</label>
            <textarea
              id="ingridients"
              name="ingridients"
              value={formData.ingredients}
              onChange={handleChange}
              rows={5}
              required
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="instructions">Инструкции (каждый шаг с новой строки)</label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={5}
              required
              className={styles.textarea}
            />
          </div>

            <div className={styles.formGroup}>
              <label htmlFor="status">Сложность</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="Draft">Черновик</option>
                <option value="Published">Опубликовано</option>
                <option value="Archived">Заархивировано</option>
              </select>
            </div>

          <div className={styles.formGroup}>
            <label>Типы рецепта</label>
            {isDataLoading ? (
              <div className={styles.loading}>Загрузка типов...</div>
            ) : (
              <div className={styles.checkboxGroup}>
                {recipeTypes.map(type => (
                  <div key={type.id} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      id={`type-${type.id}`}
                      checked={formData.recipeTypeIds.includes(type.id)}
                      onChange={() => handleRecipeTypeChange(type.id)}
                    />
                    <label htmlFor={`type-${type.id}`}>{type.name}</label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Регионы</label>
            {isDataLoading ? (
              <div className={styles.loading}>Загрузка регионов...</div>
            ) : (
              <div className={styles.checkboxGroup}>
                {regions.map(region => (
                  <div key={region.id} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      id={`region-${region.id}`}
                      checked={formData.regionIds.includes(region.id)}
                      onChange={() => handleRegionChange(region.id)}
                    />
                    <label htmlFor={`region-${region.id}`}>{region.name}</label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecipeModal;