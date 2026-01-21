'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LikeButton from '@/components/LikeButton';
import CommentsSection from '@/components/CommentsSection';
import EditArticleModal from '@/components/EditArticleModal';
import styles from '../../ContentPage.module.css';
import { getArticleById, deleteArticle, updateArticle } from '@/services/article';
import { Article, ArticleUpdateRequest } from '@/types/article';

const ArticlePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const articleId = params.id as string;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadArticle();
  }, [articleId]);

  const loadArticle = async () => {
    if (!articleId) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const articleData = await getArticleById(articleId);
      if (articleData) {
        setArticle(articleData);
      } else {
        setError('Статья не найдена');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки статьи');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!article) return;
    
    if (!confirm(`Вы уверены, что хотите удалить статью "${article.title}"? Это действие нельзя отменить.`)) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      await deleteArticle(article.id);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении статьи');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (updateData: ArticleUpdateRequest) => {
    try {
      const updatedArticle = await updateArticle(articleId, updateData);
      setArticle(updatedArticle);
      setIsEditModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении статьи');
    }
  };

  const handleLikeUpdate = (newLikesCount: number) => {
    if (article) {
      setArticle({
        ...article,
        likesCount: newLikesCount,
      });
    }
  };

  const handleCommentCountChange = (newCount: number) => {
    if (article) {
      setArticle({
        ...article,
        commentsCount: newCount,
      });
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
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
        <p>Загрузка статьи...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>❌</div>
        <h2>Статья не найдена</h2>
        <p>Запрошенная статья не существует или была удалена.</p>
        <button
          onClick={() => router.push('/')}
          className={styles.backButton}
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  const isAuthor = user?.id == article.authorId;
  const canEdit = isAuthor || user?.role == "Admin";
  const canDelete = isAuthor || user?.role == "Admin";

  return (
    <>
      <div className={styles.contentContainer}>
        {error && (
          <div className={styles.errorAlert}>
            <span className={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className={styles.contentCard}>
          <div className={styles.contentHeader}>
            <div>
              <h1 className={styles.contentTitle}>{article.title}</h1>
              <div className={styles.metaInfo}>
                <span className={styles.author}>Автор: {article.authorName}</span>
                <span className={styles.date}>{formatDate(article.createdOn)}</span>
                <span className={styles.readingTime}>{article.readingTimeMinutes} мин чтения</span>
                <span className={`${styles.statusBadge} ${styles[article.status.toLowerCase()]}`}>
                  {article.status}
                </span>
              </div>
            </div>
            
            {(canEdit || canDelete) && (
              <div className={styles.contentActions}>
                {canEdit && (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className={styles.editButton}
                  >
                    Редактировать
                  </button>
                )}
                
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    className={styles.deleteButton}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Удаление...' : 'Удалить'}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className={styles.contentBody}>
            {article.excerpt && (
              <div className={styles.excerpt}>
                <p>{article.excerpt}</p>
              </div>
            )}
            
            <div className={styles.bodyContent}>
              {article.body.split('\n').map((paragraph, index) => (
                paragraph.trim() ? (
                  <p key={index} className={styles.paragraph}>
                    {paragraph}
                  </p>
                ) : null
              ))}
            </div>
          </div>

          <div className={styles.interactions}>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <LikeButton
                  contentId={article.id}
                  initialLikesCount={article.likesCount}
                  onLikeUpdate={handleLikeUpdate}
                />
              </div>
              <div className={styles.statItem}>
                <span className={styles.statIcon}>💬</span>
                <span className={styles.statLabel}>Комментарии</span>
                <span className={styles.statValue}>{article.commentsCount}</span>
              </div>
            </div>
          </div>

          <CommentsSection
            contentId={article.id}
            onCommentCountChange={handleCommentCountChange}
          />
        </div>
      </div>

      {isEditModalOpen && (
        <EditArticleModal
          article={article}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
};

export default ArticlePage;