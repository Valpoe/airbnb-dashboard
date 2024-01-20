export default function NotFound() {
  return (
    <>
      <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-primary-content">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary-content sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-base font-bold leading-7 text-primary">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-5 flex items-center justify-center gap-x-6">
            <a
              href="/reservations-data"
              className="text-sm font-semibold text-primary-content"
            >
              Go back <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
