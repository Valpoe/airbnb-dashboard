import styles from './styles.module.scss';

export default function LoginButton({ loading }: { loading: boolean }) {
  return (
    <button className="btn btn-primary" type="submit" disabled={loading}>
      {loading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <div className={styles.buttonContainer}>
          <span>
            SIGN IN{' '}
            <span className={styles.buttonText} aria-hidden="true">
              &rarr;
            </span>
          </span>
        </div>
      )}
    </button>
  );
}
