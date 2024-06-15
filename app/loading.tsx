import styles from '@/app/styles/root/loading.module.scss';
export default function Loading() {
  return (
    <>
      <main className={styles.mainContainer}>
        <h1 className={styles.loading}>Loading...</h1>
        <span className="loading loading-spinner loading-lg"></span>
      </main>
    </>
  );
}
