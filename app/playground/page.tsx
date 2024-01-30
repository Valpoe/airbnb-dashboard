import DataTabs from '@/app/ui/playground/data-tabs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Playground'
};

export default async function IndexPage() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div>
        <h1 className="text-xl mb-5">Hello from playground</h1>
        <p className="text-gray-500 mb-5">
          This is a playground page. You can use it to test out new components
          and ideas.
        </p>
        <DataTabs />
      </div>
    </main>
  );
}
