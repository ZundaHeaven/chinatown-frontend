'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from '../Auth.module.css';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка входа. Проверьте данные и попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Вход в CHINATOWN</h1>
          <p className={styles.authSubtitle}>Добро пожаловать обратно!</p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <span className={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="usernameOrEmail" className={styles.formLabel}>
              Имя пользователя или Email
            </label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Введите имя пользователя или email"
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Введите пароль"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Вход...
              </>
            ) : (
              'Войти'
            )}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p className={styles.authText}>
            Нет аккаунта?{' '}
            <Link href="/register" className={styles.authLink}>
              Зарегистрируйтесь
            </Link>
          </p>
          <p className={styles.authText}>
            <Link href="/forgot-password" className={styles.authLink}>
              Забыли пароль?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;