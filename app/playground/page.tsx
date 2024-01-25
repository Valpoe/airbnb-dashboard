import DataTabs from '@/app/ui/playground/data-tabs';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { StatisticsSkeleton } from '../ui/skeletons';

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
        <Suspense fallback={<StatisticsSkeleton />}>
          <DataTabs />
        </Suspense>
        <div className="flex flex-col gap-4 w-52">
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
        <div className="avatar">
          <div className="w-24 rounded">
            <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
          </div>
        </div>
      </div>
    </main>
  );
}
