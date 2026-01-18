import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { id: 'home', label: 'Главная', href: '/' },
    { id: 'create', label: 'Создание', href: '/create' },
    { id: 'saved', label: 'Сохраненное', href: '/saved' },
    { id: 'profile', label: 'Профиль', href: '/profile' },
  ];


  const contactInfo = [
    { 
      id: 'email', 
      label: 'info@chinatown.com', 
      href: 'mailto:info@chinatown.com',
    },
    { 
      id: 'phone', 
      label: '+375 33 393 9393', 
      href: 'tel:+375333939393',
    },
    { 
      id: 'address', 
      label: 'г. Минск, ул. Энтузиастов, д. 125', 
      href: '#',
    },
  ];
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerTop}>
          <div className={styles.footerLogo}>
            <div className={styles.footerBrand}>
              <div className={styles.brandIcon}>
                <span>江</span>
              </div>
              <div className={styles.brandText}>
                <h3 className={styles.brandTitle}>CHINATOWN</h3>
                <p className={styles.brandSubtitle}>Гармония в каждой детали</p>
              </div>
            </div>
            <p className={styles.footerDescription}>
              Проект, созданный с любовью к деталям и вниманием к гармонии. 
              Мы стремимся создать пространство, где каждый элемент находится 
              в балансе с окружающим миром.
            </p>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Навигация</h4>
            <ul className={styles.footerLinks}>
              {quickLinks.map((link) => (
                <li key={link.id} className={styles.footerLinkItem}>
                  <Link href={link.href} className={styles.footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Контакты</h4>
            <div className={styles.contactInfo}>
              {contactInfo.map((contact) => (
                <a
                  key={contact.id}
                  href={contact.href}
                  className={styles.contactItem}
                >
                  <span>{contact.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} <span className={styles.copyrightHighlight}>CHINATOWN</span>. Все права защищены.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;