import React from 'react';
import styles from './ContentCard.module.css';
import { ArticleDto } from '@/types/article';

interface ArticleCardProps {
  article: ArticleDto;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <span className={styles.avatarText}>
              {article.authorName.charAt(0)}
            </span>
          </div>
          <div className={styles.userDetails}>
            <span className={styles.username}>Пользователь</span>
            <span className={styles.postMeta}>
              {article.articleType} • {article.readingTimeMinutes} мин чтения
            </span>
          </div>
        </div>
      </div>
      
      <h3 className={styles.cardTitle}>{article.title}</h3>
      
      {article.excerpt && (
        <p className={styles.cardExcerpt}>{article.excerpt}</p>
      )}
      
      <div className={styles.cardStats}>
        <div className={styles.stat}>
          <span className={styles.statIcon}>❤️</span>
          <span className={styles.statValue}>{article.likesCount}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>💬</span>
          <span className={styles.statValue}>{article.commentsCount}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>📅</span>
          <span className={styles.statValue}>
            {article.createdOn.toLocaleDateString('ru-RU')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;