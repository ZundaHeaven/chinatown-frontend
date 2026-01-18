'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('');
  
  const navItems = [
    { id: 'create', label: 'Создание', href: '/create' },
    { id: 'saved', label: 'Сохраненное', href: '/saved' },
    { id: 'profile', label: 'Профиль', href: '/profile' },
  ];

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
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;