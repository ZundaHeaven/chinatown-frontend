import React, { useState, useEffect } from 'react';
import styles from './FilterPanel.module.css';
import { ContentType } from '@/types/common';
import { RecipeDifficulty } from '@/types/recipe';

interface FilterPanelProps {
  contentType: ContentType;
  onFilterChange: (filters: any) => void;
  filters: any;
  filterData: {
    articleTypes: { id: string; name: string }[];
    genres: { id: string; name: string }[];
    recipeTypes: { id: string; name: string }[];
    regions: { id: string; name: string }[];
  };
}

const FilterPanel: React.FC<FilterPanelProps> = ({ contentType, onFilterChange, filters, filterData }) => {
  const [localFilters, setLocalFilters] = useState<any>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (name: string, value: any) => {
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleMultiSelectChange = (name: string, value: string, checked: boolean) => {
    const currentValues = localFilters[name] || [];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter((v: string) => v !== value);
    
    handleInputChange(name, newValues);
  };

  const handleRangeChange = (minName: string, maxName: string, minValue: string, maxValue: string) => {
    const newFilters = {
      ...localFilters,
      [minName]: minValue ? parseInt(minValue) : null,
      [maxName]: maxValue ? parseInt(maxValue) : null,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const renderArticleFilters = () => (
    <div className={styles.filterSection}>
      <h3 className={styles.filterTitle}>Фильтры статей</h3>
      
      <div className={styles.filterField}>
        <label className={styles.filterLabel}>Поиск по названию</label>
        <input
          type="text"
          className={styles.filterInput}
          placeholder="Введите название..."
          value={localFilters.search || ''}
          onChange={(e) => handleInputChange('search', e.target.value)}
        />
      </div>
      
      <div className={styles.filterField}>
        <label className={styles.filterLabel}>Тип статьи</label>
        <select
          className={styles.filterSelect}
          value={localFilters.type || ''}
          onChange={(e) => handleInputChange('type', e.target.value)}
        >
          <option value="">Все типы</option>
          {filterData.articleTypes.map((type) => (
            <option key={type.id} value={type.name}>{type.name}</option>
          ))}
        </select>
      </div>
      
      <div className={styles.filterField}>
        <label className={styles.filterLabel}>Сортировка</label>
        <select
          className={styles.filterSelect}
          value={localFilters.sort || ''}
          onChange={(e) => handleInputChange('sort', e.target.value)}
        >
          <option value="">По умолчанию</option>
          <option value="oldest">Старые первыми</option>
          <option value="most_liked">Самые популярные</option>
          <option value="most_commented">Самые обсуждаемые</option>
        </select>
      </div>
    </div>
  );

  const renderBookFilters = () => (
    <div className={styles.filterSection}>
      <h3 className={styles.filterTitle}>Фильтры книг</h3>
      
      <div className={styles.filterField}>
        <label className={styles.filterLabel}>Поиск по названию</label>
        <input
          type="text"
          className={styles.filterInput}
          placeholder="Введите название..."
          value={localFilters.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
      </div>
      
      <div className={styles.filterField}>
        <label className={styles.filterLabel}>Жанры</label>
        <div className={styles.checkboxGroup}>
          {filterData.genres.map((genre) => (
            <label key={genre.id} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={(localFilters.genreIds || []).includes(genre.id)}
                onChange={(e) => handleMultiSelectChange('genreIds', genre.id, e.target.checked)}
              />
              <span>{genre.name}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className={styles.filterField}>
        <label className={styles.filterLabel}>Год публикации</label>
        <div className={styles.rangeInputs}>
          <input
            type="number"
            className={styles.filterInput}
            placeholder="От"
            value={localFilters.yearMin || ''}
            onChange={(e) => handleRangeChange('yearMin', 'yearMax', e.target.value, localFilters.yearMax || '')}
          />
          <span className={styles.rangeSeparator}>—</span>
          <input
            type="number"
            className={styles.filterInput}
            placeholder="До"
            value={localFilters.yearMax || ''}
            onChange={(e) => handleRangeChange('yearMin', 'yearMax', localFilters.yearMin || '', e.target.value)}
          />
        </div>
      </div>
      
      <div className={styles.filterField}>
        <label className={styles.filterLabel}>Сортировка</label>
        <select
          className={styles.filterSelect}
          value={localFilters.sort || ''}
          onChange={(e) => handleInputChange('sort', e.target.value)}
        >
          <option value="">По умолчанию</option>
          <option value="year_desc">Год (новые)</option>
          <option value="year_asc">Год (старые)</option>
          <option value="created_desc">Дата добавления</option>
        </select>
      </div>
    </div>
  );

  const renderRecipeFilters = () => (
    <div className={styles.filterSection}>
      <h3 className={styles.filterTitle}>Фильтры рецептов</h3>
      
      <div className={styles.filterField}>
        <label className={styles.filterLabel}>Поиск по названию</label>
        <input
          type="text"
          className={styles.filterInput}
          placeholder="Введите название..."
          value={localFilters.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
      </div>
      
      <div className={styles.filterField}>
        <label className={styles.filterLabel}>Время приготовления (мин)</label>
        <div className={styles.rangeInputs}>
          <input
            type="number"
            className={styles.filterInput}
            placeholder="От"
            value={localFilters.cookTimeMin || ''}
            onChange={(e) => handleRangeChange('cookTimeMin', 'cookTimeMax', e.target.value, localFilters.cookTimeMax || '')}
          />
          <span className={styles.rangeSeparator}>—</span>
          <input
            type="number"
            className={styles.filterInput}
            placeholder="До"
            value={localFilters.cookTimeMax || ''}
            onChange={(e) => handleRangeChange('cookTimeMin', 'cookTimeMax', localFilters.cookTimeMin || '', e.target.value)}
          />
        </div>
      </div>
      
      <div className={styles.filterField}>
        <label className={styles.filterLabel}>Сложность</label>
        <div className={styles.checkboxGroup}>
          {Object.entries(RecipeDifficulty)
            .filter(([key]) => isNaN(Number(key)))
            .map(([key, value]) => (
              <label key={key} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={localFilters.recipeDifficulty === value}
                  onChange={(e) => handleInputChange('recipeDifficulty', e.target.checked ? value : null)}
                />
                <span>{key}</span>
              </label>
            ))}
        </div>
      </div>
      
      <div className={styles.filterField}>
        <label className={styles.filterLabel}>Сортировка</label>
        <select
          className={styles.filterSelect}
          value={localFilters.sort || ''}
          onChange={(e) => handleInputChange('sort', e.target.value)}
        >
          <option value="">По умолчанию</option>
          <option value="cooktime_asc">Время приготовления (↑)</option>
          <option value="cooktime_desc">Время приготовления (↓)</option>
          <option value="difficulty_asc">Сложность (↑)</option>
          <option value="difficulty_desc">Сложность (↓)</option>
          <option value="created_desc">Дата добавления</option>
        </select>
      </div>
    </div>
  );

  const renderFilters = () => {
    switch (contentType) {
      case 'articles': return renderArticleFilters();
      case 'books': return renderBookFilters();
      case 'recipes': return renderRecipeFilters();
      default: return null;
    }
  };

  return (
    <div className={styles.filterPanel}>
      {renderFilters()}
    </div>
  );
};

export default FilterPanel;