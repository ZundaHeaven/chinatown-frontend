'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './CommentsSection.module.css';
import { getComments, addComment, deleteComment, updateComment } from '@/services/comment';
import {Comment} from '@/types/common'
interface CommentsSectionProps {
  contentId: string;
  onCommentCountChange?: (newCount: number) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ contentId, onCommentCountChange }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [contentId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const commentsData = await getComments(contentId);
      setComments(commentsData);
    } catch (error) {
      console.error('Ошибка загрузки комментариев:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const newCommentData = await addComment({
          contentId,
          content: newComment.trim()
      });
      
      setComments(prev => [newCommentData, ...prev]);
      setNewComment('');
      
      if (onCommentCountChange) {
        onCommentCountChange(comments.length + 1);
      }
    } catch (error) {
      console.error('Ошибка добавления комментария:', error);
      alert('Не удалось добавить комментарий');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Удалить комментарий?')) return;

    try {
      await deleteComment(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
      
      if (onCommentCountChange) {
        onCommentCountChange(comments.length - 1);
      }
    } catch (error) {
      console.error('Ошибка удаления комментария:', error);
      alert('Не удалось удалить комментарий');
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.text);
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editingText.trim()) return;

    try {
      const updatedComment = await updateComment(commentId, editingText.trim());
      setComments(prev => prev.map(comment => 
        comment.id === commentId ? updatedComment : comment
      ));
      setEditingCommentId(null);
      setEditingText('');
    } catch (error) {
      console.error('Ошибка редактирования комментария:', error);
      alert('Не удалось сохранить изменения');
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText('');
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

  const canEditComment = (comment: Comment) => {
    if (!user) return false;
    return user.id === comment.userId || user.role === 'admin' || user.role === 'moderator';
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка комментариев...</p>
      </div>
    );
  }

  return (
    <div className={styles.commentsSection}>
      <h3 className={styles.commentsTitle}>
        Комментарии ({comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className={styles.commentForm}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Напишите комментарий..."
            className={styles.commentInput}
            rows={3}
            disabled={isSubmitting}
          />
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить'}
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.authRequired}>
          <p>Войдите, чтобы оставлять комментарии</p>
        </div>
      )}

      <div className={styles.commentsList}>
        {comments.length === 0 ? (
          <div className={styles.emptyComments}>
            <p>Пока нет комментариев. Будьте первым!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={styles.commentItem}>
              <div className={styles.commentHeader}>
                <div className={styles.commentAuthor}>
                  <div className={styles.avatar}>
                    <span className={styles.avatarText}>
                      {comment.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className={styles.authorInfo}>
                    <span className={styles.authorName}>{comment.username}</span>
                    <span className={styles.commentDate}>
                      {formatDateTime(comment.createdOn)}
                    </span>
                  </div>
                </div>
                
                {canEditComment(comment) && (
                  <div className={styles.commentActions}>
                    {editingCommentId === comment.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(comment.id)}
                          className={styles.actionButton}
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className={styles.cancelButton}
                        >
                          Отмена
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(comment)}
                          className={styles.actionButton}
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className={styles.deleteButton}
                        >
                          Удалить
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {editingCommentId === comment.id ? (
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className={styles.editInput}
                  rows={2}
                />
              ) : (
                <div className={styles.commentContent}>
                  {comment.text}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;