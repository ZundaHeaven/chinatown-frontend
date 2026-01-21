'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Book, BookUpdateRequest } from '@/types/book';
import LikeButton from '@/components/LikeButton';
import CommentsSection from '@/components/CommentsSection';
import EditBookModal from '@/components/EditBookModal';
import styles from '../../ContentPage.module.css';
import { getBookById, deleteBook, updateBook } from '@/services/book';
import { getImageUrl } from '@/lib/file';
import { API_URL } from '@/lib/auth';

const BookPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const bookId = params.id as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadBook();
  }, [bookId]);

  const loadBook = async () => {
    if (!bookId) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const bookData = await getBookById(bookId);
      if (bookData) {
        setBook(bookData);
      } else {
        setError('Книга не найдена');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки книги');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!book) return;
    
    if (!confirm(`Вы уверены, что хотите удалить книгу "${book.title}"? Это действие нельзя отменить.`)) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      await deleteBook(book.id);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении книги');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (updateData: BookUpdateRequest) => {
    try {
      const updatedBook = await updateBook(bookId, updateData);
      setBook(updatedBook);
      setIsEditModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении книги');
    }
  };

  const handleLikeUpdate = (newLikesCount: number) => {
    if (book) {
      setBook({
        ...book,
        likesCount: newLikesCount,
      });
    }
  };

  const handleCommentCountChange = (newCount: number) => {
    if (book) {
      setBook({
        ...book,
        commentsCount: newCount,
      });
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} МБ`;
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка книги...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>❌</div>
        <h2>Книга не найдена</h2>
        <p>Запрошенная книга не существует или была удалена.</p>
        <button
          onClick={() => router.push('/')}
          className={styles.backButton}
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  const isAuthor = user?.id == book.userId;
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
              <h1 className={styles.contentTitle}>{book.title}</h1>
              <div className={styles.metaInfo}>
                <span className={styles.author}>Автор: {book.authorName}</span>
                <span className={styles.date}>Год: {book.yearOfPublish}</span>
                <span className={styles.pages}>{book.pageAmount} стр.</span>
                <span className={`${styles.statusBadge} ${styles[book.status.toLowerCase()]}`}>
                  {book.status}
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

          <div className={styles.bookContent}>
            <div className={styles.bookCoverSection}>
              <div className={styles.bookCover}>
                {book.coverFileId ? (
                  <img
                    src={getImageUrl(book.coverFileId)}
                    alt={book.title}
                    className={styles.coverImage}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove(styles.hidden);
                    }}
                  />
                ) : null}
                <div className={`${styles.coverPlaceholder} ${book.coverFileId ? styles.hidden : ''}`}>
                  <span className={styles.coverIcon}>📖</span>
                </div>
              </div>
              
              <div className={styles.bookActions}>
                <button
                  onClick={() => window.open(`${API_URL}/documents/${book.bookFileId}`, '_blank')}
                  className={styles.downloadButton}
                >
                  Скачать ({formatFileSize(book.fileSizeBytes)})
                </button>
              </div>
            </div>
            
            <div className={styles.bookDetails}>
              <div className={styles.description}>
                <h3 className={styles.sectionTitle}>Описание</h3>
                <p>{book.description}</p>
              </div>
              
              <div className={styles.additionalInfo}>
                <div className={styles.infoSection}>
                  <h4 className={styles.infoTitle}>Жанры</h4>
                  <div className={styles.genres}>
                    {book.genres.map(genre => (
                      <span key={genre.id} className={styles.genreTag}>
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className={styles.infoSection}>
                  <h4 className={styles.infoTitle}>Информация</h4>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Год издания:</span>
                      <span className={styles.infoValue}>{book.yearOfPublish}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Количество страниц:</span>
                      <span className={styles.infoValue}>{book.pageAmount}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Размер файла:</span>
                      <span className={styles.infoValue}>{formatFileSize(book.fileSizeBytes)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Добавлено:</span>
                      <span className={styles.infoValue}>{formatDate(book.createdOn)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Добавил:</span>
                      <span className={styles.infoValue}>{book.username}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.interactions}>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <LikeButton
                  contentId={book.id}
                  initialLikesCount={book.likesCount}
                  onLikeUpdate={handleLikeUpdate}
                />
              </div>
              <div className={styles.statItem}>
                <span className={styles.statIcon}>💬</span>
                <span className={styles.statLabel}>Комментарии</span>
                <span className={styles.statValue}>{book.commentsCount}</span>
              </div>
            </div>
          </div>

          <CommentsSection
            contentId={book.id}
            onCommentCountChange={handleCommentCountChange}
          />
        </div>
      </div>

      {isEditModalOpen && (
        <EditBookModal
          book={book}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
};

export default BookPage;