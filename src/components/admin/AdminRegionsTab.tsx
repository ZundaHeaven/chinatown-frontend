'use client';

import React, { useState, useEffect } from 'react';
import { Region, RegionCreateRequest, RegionUpdateRequest } from '@/types/region';
import { getRegions, createRegion, deleteRegion, updateRegion } from '@/services/region';
import styles from './AdminTab.module.css';

const AdminRegionsTab: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newRegion, setNewRegion] = useState<RegionCreateRequest>({
    name: '',
  });
  
  const [editData, setEditData] = useState<RegionUpdateRequest>({
    name: '',
  });

  useEffect(() => {
    loadRegions();
  }, []);

  const loadRegions = async () => {
    setIsLoading(true);
    setError('');

    try {
      const regionsData = await getRegions();
      setRegions(regionsData);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки регионов');
      console.error('Ошибка загрузки регионов:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegion.name.trim()) {
      setError('Название региона обязательно');
      return;
    }

    try {
      const createdRegion = await createRegion(newRegion);
      setRegions(prev => [...prev, createdRegion]);
      setNewRegion({ name: '' });
      setIsCreating(false);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании региона');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Вы уверены, что хотите удалить регион "${name}"? Это действие нельзя отменить.`)) {
      return;
    }

    try {
      await deleteRegion(id);
      setRegions(prev => prev.filter(region => region.id !== id));
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении региона');
    }
  };

  const startEdit = (region: Region) => {
    setEditingId(region.id);
    setEditData({ name: region.name });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: '' });
  };

  const handleUpdate = async (id: string) => {
    if (!editData.name.trim()) {
      setError('Название региона обязательно');
      return;
    }

    try {
      const updatedRegion = await updateRegion(id, editData);
      setRegions(prev => prev.map(region => 
        region.id === id ? updatedRegion : region
      ));
      setEditingId(null);
      setEditData({ name: '' });
      setError('');
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении региона');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка регионов...</p>
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <div>
          <h2 className={styles.tabTitle}>Управление регионами</h2>
          <p className={styles.tabDescription}>
            Создавайте, редактируйте и удаляйте регионы для рецептов. Всего регионов: {regions.length}
          </p>
        </div>
        
        <button
          onClick={() => setIsCreating(!isCreating)}
          className={styles.createButton}
        >
          {isCreating ? 'Отмена' : '+ Добавить регион'}
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
          <h3 className={styles.formTitle}>Новый регион</h3>
          <form onSubmit={handleCreate} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="regionName">Название региона *</label>
              <input
                type="text"
                id="regionName"
                value={newRegion.name}
                onChange={(e) => setNewRegion({ name: e.target.value })}
                placeholder="Например: Итальянская"
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                Создать регион
              </button>
            </div>
          </form>
        </div>
      )}

      {regions.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🌍</div>
          <h3>Регионы не найдены</h3>
          <p>Создайте первый регион для рецептов в системе.</p>
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
              {regions.map((region) => (
                <tr key={region.id} className={styles.tr}>
                  <td className={styles.td}>
                    <span className={styles.idCell}>{region.id.slice(0, 8)}...</span>
                  </td>
                  
                  {editingId === region.id ? (
                    <>
                      <td className={styles.td}>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ name: e.target.value })}
                          className={styles.editInput}
                          placeholder="Название региона"
                        />
                      </td>
                      <td className={styles.td}>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => handleUpdate(region.id)}
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
                        <span className={styles.nameCell}>{region.name}</span>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.actionButtons}>
                          <button
                            onClick={() => startEdit(region)}
                            className={styles.editButton}
                          >
                            Редактировать
                          </button>
                          <button
                            onClick={() => handleDelete(region.id, region.name)}
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

export default AdminRegionsTab;