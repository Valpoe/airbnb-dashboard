'use client';
import { useState } from 'react';

export default function IndexPage() {
  const [tab, setTab] = useState(0);

  const handleTabChange = (tabIndex: number) => {
    setTab(tabIndex);
  };

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div>
        <h1 className="text-xl mb-5">Hello from playground</h1>
        <p className="text-gray-500">
          This is a playground page. You can use it to test out new components
          and ideas.
        </p>
        <div role="tablist" className="tabs tabs-lifted">
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab"
            aria-label="Tab 1"
            onClick={() => handleTabChange(0)}
            checked
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            Tab content 1
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab"
            aria-label="Tab 2"
            onClick={() => handleTabChange(1)}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            Tab content 2
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab"
            aria-label="Tab 3"
            onClick={() => handleTabChange(2)}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            Tab content 3
          </div>
        </div>
      </div>
    </main>
  );
}
