import LoginForm from '@/app/components/login-form/login-form';
import styles from '@/app/styles/root/page.module.scss';
import loginBackground from '@/public/login-background.png';
import cn from 'classnames';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { authOptions } from './lib/auth';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session) redirect('/monthly-report');

  return (
    <main className={styles.mainContainer}>
      <Image
        src={loginBackground}
        alt="Login Background"
        fill
        style={{ objectFit: 'cover' }}
        priority
      />
      <div className={cn('card', styles.card)}>
        <div className={cn('card-body', styles.cardBody)}>
          <h4 className={styles.cardTitle}>Sign in to your account</h4>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
