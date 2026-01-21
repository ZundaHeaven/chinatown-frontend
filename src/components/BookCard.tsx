import React from 'react';
import styles from './ContentCard.module.css';
import { Book } from '@/types/book';
import Link from 'next/link';
import { API_URL } from '@/lib/auth';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className={`${styles.card} ${styles.bookCard}`}>
      <div className={styles.cardHeader}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <span className={styles.avatarText}>
              {book.username?.charAt(0) || 'П'}
            </span>
          </div>
          <div className={styles.userDetails}>
            <Link href={`/users/${book.userId}`}>
              <span className={styles.username}>{book.username}</span>
            </Link>
            <span className={styles.postMeta}>
              {book.yearOfPublish} год • {book.pageAmount} стр.
            </span>
          </div>
        </div>
      </div>
      <Link href={`/books/${book.id}`}>
      <div className={styles.bookContent}>
        <div className={styles.bookCover}>
          <div className={styles.coverPlaceholder}>
            <img src={`${API_URL}/images/${book.coverFileId}`} alt="" className={styles.bookImageCover}/>

          </div>
        </div>
        
        <div className={styles.bookDetails}>
          <h3 className={styles.cardTitle}>{book.title}</h3>
          
          <div className={styles.bookAuthor}>
            <span className={styles.authorLabel}>Автор:</span>
            <span className={styles.authorName}>{book.authorName}</span>
          </div>
          
          <p className={styles.cardExcerpt}>{book.excerpt}</p>
          
          <div className={styles.bookGenres}>
            {book.genres?.slice(0, 3).map((genre) => (
              <span key={genre.id} className={styles.tag}>
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className={styles.cardStats}>
        <div className={styles.stat}>
          <span className={styles.statIcon}>❤️</span>
          <span className={styles.statValue}>{book.likesCount}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>💬</span>
          <span className={styles.statValue}>{book.commentsCount}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>📊</span>
          <span className={styles.statValue}>
            {Math.round(book.fileSizeBytes / 1024 / 1024 * 10) / 10} МБ
          </span>
        </div>
      </div>
      </Link>
    </div>
  );
};

export default BookCard;