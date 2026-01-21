'use client';

import React, { useState, useEffect } from 'react';
import { RecipeType, RecipeTypeCreateRequest, RecipeTypeUpdateRequest } from '@/types/recipe-type';
import { getRecipeTypes, createRecipeType, deleteRecipeType, updateRecipeType } from '@/services/recipe-type';
import styles from './AdminTab.module.css';

const AdminRecipeTypesTab: React.FC = () => {
  const [recipeTypes, setRecipeTypes] = useState<RecipeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newType, setNewType] = useState<RecipeTypeCreateRequest>({
    name: '',
  });
  
  const [editData, setEditData] = useState<RecipeTypeUpdateRequest>({
    name: '',
  });

  useEffect(() => {
    loadRecipeTypes();
  }, []);

  const loadRecipeTypes = async () => {
    setIsLoading(true);
    setError('');

    try {
      const typesData = await getRecipeTypes();
      setRecipeTypes(typesData);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки типов рецептов');
      console.error('Ошибка загрузки типов рецептов:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newType.name.trim()) {
      setError('Название типа обязательно');
      return;
    }

    try {
      const createdType = await createRecipeType(newType);
      setRecipeTypes(prev => [...prev, createdType]);
      setNewType({ name: '' });
      setIsCreating(false);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании типа рецепта');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Вы уверены, что хотите удалить тип рецепта "${name}"? Это действие нельзя отменить.`)) {
      return;
    }

    try {
      await deleteRecipeType(id);
      setRecipeTypes(prev => prev.filter(type => type.id !== id));
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении типа рецепта');
    }
  };

  const startEdit = (type: RecipeType) => {
    setEditingId(type.id);
    setEditData({ name: type.name });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: '' });
  };

  const handleUpdate = async (id: string) => {
    if (!editData.name.trim()) {
      setError('Название типа обязательно');
      return;
    }

    try {
      const updatedType = await updateRecipeType(id, editData);
      setRecipeTypes(prev => prev.map(type => 
        type.id === id ? updatedType : type
      ));
      setEditingId(null);
      setEditData({ name: '' });
      setError('');
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении типа рецепта');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка типов рецептов...</p>
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <div>
          <h2 className={styles.tabTitle}>Управление типами рецептов</h2>
          <p className={styles.tabDescription}>
            Создавайте, редактируйте и удаляйте категории рецептов. Всего типов: {recipeTypes.length}
          </p>
        </div>
        
        <button
          onClick={() => setIsCreating(!isCreating)}
          className={styles.createButton}
        >
          {isCreating ? 'Отмена' : '+ Добавить тип'}
        </button>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <span className={styles.errorIcon}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {isCreating && (
        <div className={styles.createForm}>
          <h3 className={styles.formTitle}>Новый тип рецепта</h3>
          <form onSubmit={handleCreate} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="typeName">Название типа *</label>
              <input
                type="text"
                id="typeName"
                value={newType.name}
                onChange={(e) => setNewType({ name: e.target.value })}
                placeholder="Например: Десерт"
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                Создать тип
              </button>
            </div>
          </form>
        </div>
      )}

      {recipeTypes.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🍲</div>
          <h3>Типы рецептов не найдены</h3>
          <p>Создайте первую категорию для рецептов в системе.</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>ID</th>
                <th className={styles.th}>Название</th>
                <th className={styles.th}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {recipeTypes.map((type) => (
                <tr key={type.id} className={styles.tr}>
                  <td className={styles.td}>
                    <span className={styles.idCell}>{type.id.slice(0, 8)}...</span>
                  </td>
                  
                  {editingId === type.id ? (
                    <>
                      <td className={styles.td}>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ name: e.target.value })}
                          className={styles.editInput}
                          placeholder="Название типа"
                        />
                      </td>
                      <td className={styles.td}>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => handleUpdate(type.id)}
                            className={styles.saveButton}
                          >
                            Сохранить
                          </button>
                          <button
                            onClick={cancelEdit}
                            className={styles.cancelButton}
                          >
                            Отмена
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className={styles.td}>
                        <span className={styles.nameCell}>{type.name}</span>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => startEdit(type)}
                            className={styles.editButton}
                          >
                            Редактировать
                          </button>
                          <button
                            onClick={() => handleDelete(type.id, type.name)}
                            className={styles.deleteButton}
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRecipeTypesTab;