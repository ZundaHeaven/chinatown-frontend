'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '@/types/book';
import { getMyBooks, deleteBook, changeBookStatus } from '@/services/book';
import { getImageUrl } from '@/lib/file';
import styles from './MyContentTab.module.css';

interface MyBooksTabProps {
  onDataLoaded: (data: Book[]) => void;
}

const MyBooksTab: React.FC<MyBooksTabProps> = ({ onDataLoaded }) => {
  const router = useRouter();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'Published' | 'Draft' | 'Archived'>('all');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setIsLoading(true);
    setError('');

    try {
      const booksData = await getMyBooks();
      setBooks(booksData);
      onDataLoaded(booksData);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки книг');
      console.error('Ошибка загрузки книг:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'Published' | 'Draft' | 'Archived') => {
    try {
      await changeBookStatus(id, newStatus);
      setBooks(prev => prev.map(book => 
        book.id === id ? { ...book, status: newStatus } : book
      ));
    } catch (err: any) {
      setError(err.message || 'Ошибка при изменении статуса');
    }
  };

  const handleView = (id: string) => {
    router.push(`/books/${id}`);
  };

  const getFilteredBooks = () => {
    if (filter === 'all') return books;
    return books.filter(book => book.status as string === filter);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
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
        <p>Загрузка книг...</p>
      </div>
    );
  }

  const filteredBooks = getFilteredBooks();

  return (
    <div className={styles.tabContent}>
      {error && (
        <div className={styles.errorAlert}>
          <span className={styles.errorIcon}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className={styles.tabHeader}>
        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            Все ({books.length})
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'Published' ? styles.active : ''}`}
            onClick={() => setFilter('Published')}
          >
            Опубликовано ({books.filter(b => b.status === 'Published').length})
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'Draft' ? styles.active : ''}`}
            onClick={() => setFilter('Draft')}
          >
            Черновики ({books.filter(b => b.status === 'Draft').length})
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'Archived' ? styles.active : ''}`}
            onClick={() => setFilter('Archived')}
          >
            Архив ({books.filter(b => b.status === 'Archived').length})
          </button>
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => router.push('/create')}
            className={styles.createButton}
          >
            + Новая книга
          </button>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <h3>Книги не найдены</h3>
          <p>
            {filter === 'all'
              ? 'У вас еще нет созданных книг. Создайте свою первую книгу!'
              : `У вас нет книг со статусом "${filter === 'Published' ? 'Опубликовано' : filter === 'Draft' ? 'Черновик' : 'Архив'}".`}
          </p>
          <button
            onClick={() => router.push('/create')}
            className={styles.createFirstButton}
          >
            Создать первую книгу
          </button>
        </div>
      ) : (
        <div className={styles.contentGrid}>
          {filteredBooks.map((book) => (
            <div key={book.id} className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <div className={`${styles.statusBadge} ${styles[book.status.toLowerCase()]}`}>
                  {book.status === 'Published' ? 'Опубликовано' : 
                   book.status === 'Draft' ? 'Черновик' : 
                   'В архиве'}
                </div>
                <div className={styles.bookInfo}>
                  <span className={styles.bookYear}>{book.yearOfPublish} г.</span>
                  <span className={styles.bookPages}>{book.pageAmount} стр.</span>
                </div>
              </div>

              <div className={styles.cardBody}>
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
                    <span className={styles.placeholderIcon}>📖</span>
                  </div>
                </div>

                <div className={styles.bookDetails}>
                  <h3 className={styles.cardTitle}>{book.title}</h3>
                  <p className={styles.cardAuthor}>Автор: {book.authorName}</p>
                  <p className={styles.cardExcerpt}>{book.excerpt || 'Без описания'}</p>
                  
                  <div className={styles.genres}>
                    {book.genres.slice(0, 3).map(genre => (
                      <span key={genre.id} className={styles.genreTag}>
                        {genre.name}
                      </span>
                    ))}
                    {book.genres.length > 3 && (
                      <span className={styles.moreGenres}>+{book.genres.length - 3}</span>
                    )}
                  </div>

                  <div className={styles.cardMeta}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaIcon}>📦</span>
                      <span className={styles.metaText}>{formatFileSize(book.fileSizeBytes)}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaIcon}>❤️</span>
                      <span className={styles.metaText}>{book.likesCount} лайков</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaIcon}>💬</span>
                      <span className={styles.metaText}>{book.commentsCount} комментариев</span>
                    </div>
                  </div>

                  <div className={styles.cardDates}>
                    <div className={styles.dateItem}>
                      <span className={styles.dateLabel}>Добавлено:</span>
                      <span className={styles.dateValue}>{formatDate(book.createdOn)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.cardActions}>
                <div className={styles.actionButtons}>
                  <button
                    onClick={() => handleView(book.id)}
                    className={styles.viewButton}
                  >
                    Просмотр
                  </button>
                </div>

                <div className={styles.statusActions}>
                  <select
                    value={book.status}
                    onChange={(e) => handleStatusChange(book.id, e.target.value as any)}
                    className={styles.statusSelect}
                  >
                    <option value="Draft">Черновик</option>
                    <option value="Published">Опубликовать</option>
                    <option value="Archived">В архив</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooksTab;