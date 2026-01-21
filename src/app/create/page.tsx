'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CreatePage.module.css';
import CreateArticleModal from '@/components/CreateArticleModal';
import CreateBookModal from '@/components/CreateBookModal';
import CreateRecipeModal from '@/components/CreateRecipeModal';

const CreatePage: React.FC = () => {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<'article' | 'book' | 'recipe' | null>(null);

  const handleSuccess = (id: string, type: 'article' | 'book' | 'recipe') => {
    setActiveModal(null);
    router.push(`/${type}s/${id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Создать новый контент</h1>
        <p className={styles.subtitle}>Выберите тип контента для создания</p>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.contentCard}>
          <div className={styles.contentIcon}>📝</div>
          <h3 className={styles.contentTitle}>Статья</h3>
          <p className={styles.contentDescription}>
            Создайте информационную статью, блог-пост или новость. Добавьте текст, изображения и категории.
          </p>
          <div className={styles.features}>
            <span className={styles.feature}>📄 Текстовый формат</span>
            <span className={styles.feature}>🏷️ Категории</span>
            <span className={styles.feature}>⏱️ Время чтения</span>
          </div>
          <button
            onClick={() => setActiveModal('article')}
            className={styles.createButton}
          >
            Создать статью
          </button>
        </div>

        <div className={styles.contentCard}>
          <div className={styles.contentIcon}>📚</div>
          <h3 className={styles.contentTitle}>Книга</h3>
          <p className={styles.contentDescription}>
            Добавьте электронную книгу с обложкой и файлом для чтения. Укажите автора, жанры и год издания.
          </p>
          <div className={styles.features}>
            <span className={styles.feature}>📖 Файл книги</span>
            <span className={styles.feature}>🖼️ Обложка</span>
            <span className={styles.feature}>📊 Метаданные</span>
          </div>
          <button
            onClick={() => setActiveModal('book')}
            className={styles.createButton}
          >
            Создать книгу
          </button>
        </div>

        <div className={styles.contentCard}>
          <div className={styles.contentIcon}>🍳</div>
          <h3 className={styles.contentTitle}>Рецепт</h3>
          <p className={styles.contentDescription}>
            Поделитесь кулинарным рецептом с ингредиентами и пошаговыми инструкциями. Добавьте изображение и время приготовления.
          </p>
          <div className={styles.features}>
            <span className={styles.feature}>🥗 Ингредиенты</span>
            <span className={styles.feature}>👨‍🍳 Инструкции</span>
            <span className={styles.feature}>📸 Фотография</span>
          </div>
          <button
            onClick={() => setActiveModal('recipe')}
            className={styles.createButton}
          >
            Создать рецепт
          </button>
        </div>
      </div>

      {activeModal === 'article' && (
        <CreateArticleModal
          onClose={() => setActiveModal(null)}
          onSuccess={(id) => handleSuccess(id, 'article')}
        />
      )}

      {activeModal === 'book' && (
        <CreateBookModal
          onClose={() => setActiveModal(null)}
          onSuccess={(id) => handleSuccess(id, 'book')}
        />
      )}

      {activeModal === 'recipe' && (
        <CreateRecipeModal
          onClose={() => setActiveModal(null)}
          onSuccess={(id) => handleSuccess(id, 'recipe')}
        />
      )}
    </div>
  );
};

export default CreatePage;