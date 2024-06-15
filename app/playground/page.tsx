import WorkTimeForm from '@/app/playground/work-time-form/work-time-form';
import { Metadata } from 'next';
import styles from './playground.module.scss';

export const metadata: Metadata = {
  title: 'Playground'
};

export default async function IndexPage() {
  return (
    <main className={styles.mainContainer}>
      <div>
        <h1 className={styles.headerText}>Hello from playground</h1>
        <p className={styles.secondaryText}>
          This is a playground page. You can use it to test out new components
          and ideas.
        </p>
        <WorkTimeForm />
      </div>
    </main>
  );
}
