'use client';

import React, { useState, useEffect } from 'react';
import styles from './LikeButton.module.css';
import { checkIfLiked, toggleLike } from '@/services/like';

interface LikeButtonProps {
  contentId: string;
  initialLikesCount: number;
  onLikeUpdate?: (newLikesCount: number, userHasLiked: boolean) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  contentId,
  initialLikesCount,
  onLikeUpdate,
}) => {
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    loadLikeStatus();
  }, [contentId]);

  const loadLikeStatus = async () => {
    setIsLoading(true);
    try {
      const liked = await checkIfLiked(contentId);
      setUserHasLiked(liked);
    } catch (error) {
      console.error('Ошибка загрузки статуса лайка:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeClick = async () => {
    if (isToggling) return;
    
    setIsToggling(true);
    
    try {
      const response = await toggleLike(contentId);
      const newLiked = response.likes.some(like => 
        like.userId === localStorage.getItem('userId')
      );
      
      setUserHasLiked(newLiked);
      setLikesCount(response.likes.length);
      
      if (onLikeUpdate) {
        onLikeUpdate(response.likes.length, newLiked);
      }
    } catch (error) {
      console.error('Ошибка при обновлении лайка:', error);
    } finally {
      setIsToggling(false);
    }
  };

  if (isLoading) {
    return (
      <button className={styles.likeButton} disabled>
        <span className={styles.likeIcon}>🤍</span>
        <span className={styles.likeCount}>{likesCount}</span>
      </button>
    );
  }

  return (
    <button
      className={`${styles.likeButton} ${userHasLiked ? styles.liked : ''}`}
      onClick={handleLikeClick}
      disabled={isToggling}
      aria-label={userHasLiked ? 'Убрать лайк' : 'Поставить лайк'}
    >
      <span className={styles.likeIcon}>
        {userHasLiked ? '❤️' : '🤍'}
      </span>
      <span className={styles.likeCount}>{likesCount}</span>
      {isToggling && <span className={styles.spinner}></span>}
    </button>
  );
};

export default LikeButton;