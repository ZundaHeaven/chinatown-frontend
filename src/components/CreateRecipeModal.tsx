'use client';

import React, { useState, useEffect } from 'react';
import { RecipeCreateRequest, RecipeDifficulty } from '@/types/recipe';
import { RecipeType } from '@/types/recipe-type';
import { Region } from '@/types/region';
import { createRecipe, uploadRecipeImage } from '@/services/recipe';
import { getRecipeTypes } from '@/services/recipe-type';
import { getRegions } from '@/services/region';
import styles from './CreateModal.module.css';

interface CreateRecipeModalProps {
  onClose: () => void;
  onSuccess: (id: string) => void;
}

const CreateRecipeModal: React.FC<CreateRecipeModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<RecipeCreateRequest>({
    title: '',
    difficulty: RecipeDifficulty.Medium,
    ingredients: '',
    instructions: '',
    cookTimeMinutes: 30,
    recipeTypeIds: [],
    regionIds: [],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
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
      if (!formData.title.trim()) {
        throw new Error('Название рецепта обязательно');
      }
      if (!formData.ingredients.trim()) {
        throw new Error('Ингредиенты обязательны');
      }
      if (!formData.instructions.trim()) {
        throw new Error('Инструкции обязательны');
      }

      let difficulty = parseInt(formData.difficulty.toString()) as RecipeDifficulty;

      const data : RecipeCreateRequest = {
        title: formData.title,
        difficulty: difficulty,
        ingredients: formData.ingredients,
        instructions: formData.instructions,
        cookTimeMinutes: formData.cookTimeMinutes,
        recipeTypeIds: [...formData.recipeTypeIds],
        regionIds: [...formData.regionIds]
      }

      const recipe = await createRecipe(data);

      if (imageFile) {
        await uploadRecipeImage(recipe.id, imageFile);
      }

      onSuccess(recipe.id);
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании рецепта');
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Файл должен быть изображением');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Размер изображения не должен превышать 5MB');
        return;
      }
      setImageFile(file);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} style={{ maxWidth: '800px' }}>
        <div className={styles.modalHeader}>
          <h2>Создать новый рецепт</h2>
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
            <label htmlFor="title">Название рецепта *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Введите название рецепта"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="cookTimeMinutes">Время приготовления (минуты) *</label>
              <input
                type="number"
                id="cookTimeMinutes"
                name="cookTimeMinutes"
                value={formData.cookTimeMinutes}
                onChange={handleChange}
                min="1"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="difficulty">Сложность *</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
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
            <label htmlFor="imageFile">Фотография рецепта</label>
            <input
              type="file"
              id="imageFile"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
            {imageFile && (
              <div className={styles.fileInfo}>
                <span className={styles.fileIcon}>📸</span>
                <span>{imageFile.name}</span>
                <span className={styles.fileSize}>
                  ({(imageFile.size / 1024).toFixed(2)} KB)
                </span>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ingredients">Ингредиенты * (каждый ингредиент с новой строки)</label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              rows={4}
              required
              className={styles.textarea}
              placeholder="Пример:
200 г муки
2 яйца
100 мл молока
Соль по вкусу"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="instructions">Инструкции * (каждый шаг с новой строки)</label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={6}
              required
              className={styles.textarea}
              placeholder="Пример:
1. Смешайте муку и соль
2. Добавьте яйца и молоко
3. Тщательно перемешайте до однородности
4. Жарьте на сковороде 3-4 минуты с каждой стороны"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Типы рецепта *</label>
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
              {isLoading ? 'Создание...' : 'Создать рецепт'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipeModal;