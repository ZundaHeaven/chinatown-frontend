'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import styles from './UserProfile.module.css';
import { deleteAvatar, deleteUser, getAvatarUrl, getUserById, updateUser, uploadAvatar } from '@/services/user';
import { User, UserUpdateRequest } from '@/types/user';

const UserProfilePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser, logout } = useAuth();
  const authContext = useAuth();
  
  const userId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserUpdateRequest>({
    username: '',
    email: '',
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const userData = await getUserById(userId);
      console.log('User=' + userData);
      if (userData) {
        setUser(userData);
        setEditForm({
          username: userData.username,
          email: userData.email,
        });
      } else {
        setError('Пользователь не найден');
      }
    } catch (err: any) {
      console.log(err.message);
      setError(err.message || 'Ошибка загрузки данных пользователя');
    } finally {
      console.log('Hello');
      setIsLoading(false);
    }
  };
  
  const isOwnProfile = currentUser?.id === userId;
  const canEdit = isOwnProfile || authContext.user?.role == "Admin";
  const canDelete = authContext.user?.role == "Admin" && !isOwnProfile;
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async () => {
    if (!user) return;
    
    setError('');
    setSuccess('');
    
    try {
      const updatedUser = await updateUser(user.id, editForm);
      setUser(updatedUser);
      setSuccess('Данные успешно обновлены');
      setIsEditing(false);
      
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении данных');
    }
  };
  
  const handleCancel = () => {
    if (user) {
      setEditForm({
        username: user.username,
        email: user.email,
      });
    }
    setIsEditing(false);
  };
  
  const handleDeleteAvatar = async () => {
    if (!user || !user.avatarId) return;
    
    if (!confirm('Удалить аватар?')) return;
    
    setError('');
    
    try {
      await deleteAvatar(user.id);
      setUser(prev => prev ? { ...prev, avatarId: null } : null);
      setSuccess('Аватар удален');
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении аватара');
    }
  };
  
  const handleDeleteUser = async () => {
    if (!user || !canDelete) return;
    
    if (!confirm(`Вы уверены, что хотите удалить пользователя ${user.username}? Это действие нельзя отменить.`)) {
      return;
    }
    
    setError('');
    
    try {
      await deleteUser(user.id);
      setSuccess('Пользователь удален');
      router.push('/users');
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении пользователя');
    }
  };
  
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const formatDateTime = (date: Date | string) => {
    return new Date(date).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка профиля...</p>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>❌</div>
        <h2>Пользователь не найден</h2>
        <p>Запрошенный профиль не существует или был удален.</p>
        <button
          onClick={() => router.push('/')}
          className={styles.backButton}
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      {(error || success) && (
        <div className={`${styles.message} ${error ? styles.error : styles.success}`}>
          {error ? '⚠️' : '✅'} {error || success}
        </div>
      )}
      
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.profileTitle}>
              {isOwnProfile ? 'Мой профиль' : `Профиль: ${user.username}`}
            </h1>
            {user.role && (
              <span className={`${styles.roleBadge} ${styles[user.role.toLowerCase()]}`}>
                {user.role}
              </span>
            )}
          </div>
          
          {canEdit && !isEditing && (
            <div className={styles.headerActions}>
              <button
                onClick={() => setIsEditing(true)}
                className={styles.editButton}
              >
                Редактировать
              </button>
              {canDelete && (
                <button
                  onClick={handleDeleteUser}
                  className={styles.deleteButton}
                >
                  Удалить пользователя
                </button>
              )}
            </div>
          )}
          
          {isEditing && (
            <div className={styles.headerActions}>
              <button
                onClick={handleSave}
                className={styles.saveButton}
                disabled={!editForm.username.trim() || !editForm.email.trim()}
              >
                Сохранить
              </button>
              <button
                onClick={handleCancel}
                className={styles.cancelButton}
              >
                Отмена
              </button>
            </div>
          )}
        </div>
        
        <div className={styles.profileContent}>
          <div className={styles.leftColumn}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarContainer}>
                {user.avatarId ? (
                  <div className={styles.avatarWrapper}>
                    <img
                      src={getAvatarUrl(user.avatarId)}
                      alt={user.username}
                      className={styles.avatarImage}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove(styles.hidden);
                      }}
                    />
                    <div className={`${styles.avatarFallback} ${!user.avatarId ? '' : styles.hidden}`}>
                      <span className={styles.avatarText}>
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.avatarFallback}>
                    <span className={styles.avatarText}>
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.statsSection}>
              <h3 className={styles.sectionTitle}>Статистика</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Роль</span>
                  <span className={styles.statValue}>{user.role}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Регистрация</span>
                  <span className={styles.statValue}>{formatDate(user.createdOn)}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Обновлен</span>
                  <span className={styles.statValue}>{formatDate(user.modifiedOn)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.rightColumn}>
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>Основная информация</h3>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Имя пользователя</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={editForm.username}
                    onChange={handleEditChange}
                    className={styles.formInput}
                    placeholder="Введите имя пользователя"
                  />
                ) : (
                  <div className={styles.formValue}>{user.username}</div>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className={styles.formInput}
                    placeholder="Введите email"
                  />
                ) : (
                  <div className={styles.formValue}>{user.email}</div>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>ID пользователя</label>
                <div className={styles.formValue}>
                  <code className={styles.userId}>{user.id}</code>
                </div>
              </div>
            </div>
            
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>Детали аккаунта</h3>
              
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Дата создания</span>
                  <span className={styles.detailValue}>
                    {formatDateTime(user.createdOn)}
                  </span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Последнее обновление</span>
                  <span className={styles.detailValue}>
                    {formatDateTime(user.modifiedOn)}
                  </span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Статус</span>
                  <span className={styles.detailValue}>
                    <span className={styles.statusActive}>Активный</span>
                  </span>
                </div>
              </div>
            </div>
            
            {isOwnProfile && (
              <div className={styles.actionsSection}>
                <h3 className={styles.sectionTitle}>Действия с аккаунтом</h3>
                
                <div className={styles.actionButtons}>
                  <button
                    onClick={async () => {
                      await logout();
                      router.push('/');
                    }}
                    className={styles.logoutButton}
                  >
                    Выйти из аккаунта
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.profileFooter}>
          <div className={styles.footerInfo}>
            <p className={styles.footerText}>
              Профиль создан {formatDateTime(user.createdOn)}
            </p>
            {user.createdOn !== user.modifiedOn && (
              <p className={styles.footerText}>
                Последнее обновление {formatDateTime(user.modifiedOn)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;