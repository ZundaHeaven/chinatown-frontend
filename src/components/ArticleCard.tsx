import React from 'react';
import styles from './ContentCard.module.css';
import { Article } from '@/types/article';
import Link from 'next/link';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <span className={styles.avatarText}>
              {article.authorName?.charAt(0) || 'П'}
            </span>
          </div>
          <div className={styles.userDetails}>
            <Link href={`/users/${article.authorId}`}>
              <span className={styles.username}>{article.authorName}</span>
            </Link>
            <span className={styles.postMeta}>
              {article.articleType} • {article.readingTimeMinutes} мин чтения
            </span>
          </div>
        </div>
      </div>
      
      <Link href={`/articles/${article.id}`}>
            <h3 className={styles.cardTitle}>{article.title}</h3>
      
      {article.excerpt && (
        <p className={styles.cardExcerpt}>{article.excerpt}</p>
      )}
      </Link>
      

      

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
            {new Date(article.createdOn).toLocaleDateString('ru-RU')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;