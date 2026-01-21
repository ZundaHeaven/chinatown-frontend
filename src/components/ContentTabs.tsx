import React from 'react';
import styles from './ContentTabs.module.css';
import { ContentType } from '@/types/common';

interface ContentTabsProps {
  activeTab: ContentType;
  onTabChange: (tab: ContentType) => void;
}

const ContentTabs: React.FC<ContentTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'articles', label: 'Статьи' },
    { id: 'recipes', label: 'Рецепты' },
    { id: 'books', label: 'Книги' },
  ] as const;

  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className={styles.tabLabel}>{tab.label}</span>
          {activeTab === tab.id && <span className={styles.tabIndicator}></span>}
        </button>
      ))}
    </div>
  );
};

export default ContentTabs;