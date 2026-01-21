'use client';

import React, { useState, useEffect } from 'react';
import { User, UserUpdateRequest } from '@/types/user';
import { getUsers, deleteUser } from '@/services/user';
import styles from './AdminTab.module.css';

const AdminUsersTab: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editData, setEditData] = useState<UserUpdateRequest>({
    username: '',
    email: '',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    setError('');

    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки пользователей');
      console.error('Ошибка загрузки пользователей:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, username: string) => {
    if (!confirm(`Вы уверены, что хотите удалить пользователя "${username}"? Это действие нельзя отменить.`)) {
      return;
    }

    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении пользователя');
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFilteredUsers = () => {
    if (!searchTerm.trim()) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(user =>
      user.username.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка пользователей...</p>
      </div>
    );
  }

  const filteredUsers = getFilteredUsers();

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <div>
          <h2 className={styles.tabTitle}>Управление пользователями</h2>
          <p className={styles.tabDescription}>
            Просмотр и управление пользователями системы. Всего пользователей: {users.length}
          </p>
        </div>
        
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Поиск по имени, email или роли..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <span className={styles.errorIcon}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {filteredUsers.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>👥</div>
          <h3>Пользователи не найдены</h3>
          <p>
            {searchTerm ? 'По вашему запросу ничего не найдено.' : 'В системе пока нет пользователей.'}
          </p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>ID</th>
                <th className={styles.th}>Имя</th>
                <th className={styles.th}>Email</th>
                <th className={styles.th}>Роль</th>
                <th className={styles.th}>Дата регистрации</th>
                <th className={styles.th}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className={styles.tr}>
                  <td className={styles.td}>
                    <span className={styles.idCell}>{user.id.slice(0, 8)}...</span>
                  </td>
                  
                  {editingId === user.id ? (
                    <>
                      <td className={styles.td}>
                        <input
                          type="text"
                          value={editData.username}
                          onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                          className={styles.editInput}
                          placeholder="Имя пользователя"
                        />
                      </td>
                      <td className={styles.td}>
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                          className={styles.editInput}
                          placeholder="Email"
                        />
                      </td>
                      <td className={styles.td}>
                        <span className={styles.dateCell}>{formatDate(user.createdOn)}</span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className={styles.td}>
                        <div className={styles.userCell}>
                          <span className={styles.avatarPlaceholder}>
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                          <span className={styles.nameCell}>{user.username}</span>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.emailCell}>{user.email}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={`${styles.roleBadge} ${styles[user.role.toLowerCase()]}`}>
                          {user.role === 'Admin' ? 'Админ' : 
                           user.role === 'Moderator' ? 'Модератор' : 'Пользователь'}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.dateCell}>{formatDate(user.createdOn)}</span>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.actionButtons}>
                          {user.role !== 'Admin' && (
                            <button
                              onClick={() => handleDelete(user.id, user.username)}
                              className={styles.deleteButton}
                            >
                              Удалить
                            </button>
                          )}
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

export default AdminUsersTab;