import styles from '@/app/styles/root/not-found.module.scss';
import cn from 'classnames';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <main className={styles.mainContainer}>
        <p className={styles.error}>404</p>
        <h1 className={styles.pageNotFound}>Page not found</h1>
        <p className={styles.errorText}>
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className={styles.buttonContainer}>
          <Link href="/analytics" className={cn('btn', styles.button)}>
            Go back <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </main>
    </>
  );
}
