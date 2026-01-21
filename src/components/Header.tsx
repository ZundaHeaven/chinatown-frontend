'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  
  const navItems = [
    { id: 'create', label: 'Создание', href: '/create' },
    { id: 'saved', label: 'Сохраненное', href: '/saved' },
    { id: 'my-content', label: 'Мой контент', href: '/my-content' }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logoLink}>
            <h1 className={styles.logoText}>CHINATOWN</h1>
          </Link>
        </div>
        
        <nav className={styles.navContainer}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.id} className={styles.navItem}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${activeItem === item.id ? styles.active : ''}`}
                  onMouseEnter={() => setActiveItem(item.id)}
                  onMouseLeave={() => setActiveItem('')}
                  onClick={() => setActiveItem(item.id)}
                >
                  <span className={styles.navText}>{item.label}</span>
                  <span className={styles.navUnderline}></span>
                </Link>
              </li>
            ))}
            {user?.role === 'Admin' && (
              <Link href="/admin" className={styles.navLink}>
                <span className={styles.navText}>Админка</span>
              </Link>
            )}
          </ul>
          
          <div className={styles.authSection}>
            {isLoading ? (
              <div className={styles.loadingSpinner}></div>
            ) : isAuthenticated && user ? (
              <div className={styles.userMenu}>
                <button
                  className={styles.userButton}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label="Меню пользователя"
                >
                  <div className={styles.userAvatar}>
                    <span className={styles.avatarText}>
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className={styles.userName}>{user.username}</span>
                  <span className={styles.menuArrow}>
                    {showUserMenu ? '▲' : '▼'}
                  </span>
                </button>
                
                {showUserMenu && (
                  <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownHeader}>
                      <span className={styles.dropdownEmail}>{user.email}</span>
                      <span className={styles.dropdownRole}>{user.role}</span>
                    </div>
                    <Link 
                      href={`/users/${user?.id}`}
                      className={styles.dropdownItem}
                      onClick={() => setShowUserMenu(false)}
                    >
                      Мой профиль
                    </Link>
                    <div className={styles.dropdownDivider}></div>
                    <button
                      className={styles.dropdownItem}
                      onClick={handleLogout}
                    >
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.authButtons}>
                <Link href="/login" className={styles.loginButton}>
                  Войти
                </Link>
                <Link href="/register" className={styles.registerButton}>
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
      
      {showUserMenu && (
        <div 
          className={styles.menuOverlay}
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;