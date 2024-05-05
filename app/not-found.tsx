import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-bold text-primary-content">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-error sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-base font-bold leading-7 text-primary-content">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-5 flex items-center justify-center gap-x-6">
            <Link
              href="/reservations-data"
              className="btn btn-active btn-primary"
            >
              Go back <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
