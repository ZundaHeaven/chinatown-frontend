import React, { useState, useEffect } from 'react';
import styles from './FilterPanel.module.css';
import { ContentType } from '@/types/common';

interface FilterPanelProps {
  contentType: ContentType;
  onFilterChange: (filters: any) => void;
  filters: any;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ contentType, onFilterChange, filters }) => {
  const [localFilters, setLocalFilters] = useState<any>(filters);
  
  const [articleTypes, setArticleTypes] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  
  useEffect(() => {
    if (contentType === 'articles') {
      setArticleTypes(['Технологии', 'Культура', 'История', 'Философия']);
    } else if (contentType === 'books') {
      setGenres(['Фантастика', 'Философия', 'История', 'Поэзия', 'Драма']);
    }
  }, [contentType]);
  
  const handleInputChange = (name: string, value: any) => {
    const newFilters = { ...localFilters, [name]: value };
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
          value={localFilters.titleSearch || ''}
          onChange={(e) => handleInputChange('titleSearch', e.target.value)}
        />
      </div>
      
      <div className={styles.filterField}>
        <label className={styles.filterLabel}>Тип статьи</label>
        <select
          className={styles.filterSelect}
          value={localFilters.articleType || ''}
          onChange={(e) => handleInputChange('articleType', e.target.value)}
        >
          <option value="">Все типы</option>
          {articleTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
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
          value={localFilters.titleSearch || ''}
          onChange={(e) => handleInputChange('titleSearch', e.target.value)}
        />
      </div>
      
      <div className={styles.filterField}>
        <label className={styles.filterLabel}>Жанры</label>
        <div className={styles.checkboxGroup}>
          {genres.map((genre) => (
            <label key={genre} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={(localFilters.genres || []).includes(genre)}
                onChange={(e) => {
                  const currentGenres = localFilters.genres || [];
                  const newGenres = e.target.checked
                    ? [...currentGenres, genre]
                    : currentGenres.filter((g: string) => g !== genre);
                  handleInputChange('genres', newGenres);
                }}
              />
              <span>{genre}</span>
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
            value={localFilters.yearFrom || ''}
            onChange={(e) => handleInputChange('yearFrom', e.target.value)}
          />
          <span className={styles.rangeSeparator}>—</span>
          <input
            type="number"
            className={styles.filterInput}
            placeholder="До"
            value={localFilters.yearTo || ''}
            onChange={(e) => handleInputChange('yearTo', e.target.value)}
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
          value={localFilters.titleSearch || ''}
          onChange={(e) => handleInputChange('titleSearch', e.target.value)}
        />
      </div>
      
      <div className={styles.filterField}>
        <label className={styles.filterLabel}>Время приготовления</label>
        <div className={styles.rangeInputs}>
          <input
            type="number"
            className={styles.filterInput}
            placeholder="От (мин)"
            value={localFilters.timeFrom || ''}
            onChange={(e) => handleInputChange('timeFrom', e.target.value)}
          />
          <span className={styles.rangeSeparator}>—</span>
          <input
            type="number"
            className={styles.filterInput}
            placeholder="До (мин)"
            value={localFilters.timeTo || ''}
            onChange={(e) => handleInputChange('timeTo', e.target.value)}
          />
        </div>
      </div>
      
      <div className={styles.filterField}>
        <label className={styles.filterLabel}>Сложность</label>
        <div className={styles.checkboxGroup}>
          {[1, 2, 3, 4].map((level) => (
            <label key={level} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={(localFilters.difficulty || []).includes(level)}
                onChange={(e) => {
                  const current = localFilters.difficulty || [];
                  const newLevels = e.target.checked
                    ? [...current, level]
                    : current.filter((l: number) => l !== level);
                  handleInputChange('difficulty', newLevels);
                }}
              />
              <span>Уровень {level}</span>
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
          <option value="most_time">По времени приготовления</option>
          <option value="most_liked">Самые популярные</option>
          <option value="most_commented">Самые обсуждаемые</option>
        </select>
      </div>
    </div>
  );
  
  return (
    <div className={styles.filterPanel}>
      {contentType === 'articles' && renderArticleFilters()}
      {contentType === 'books' && renderBookFilters()}
      {contentType === 'recipes' && renderRecipeFilters()}
    </div>
  );
};

export default FilterPanel;