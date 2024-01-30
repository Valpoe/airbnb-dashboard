export default function Loading() {
  return (
    <>
      <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-primary-content sm:text-5xl">
            Loading...
          </h1>
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </main>
    </>
  );
}
