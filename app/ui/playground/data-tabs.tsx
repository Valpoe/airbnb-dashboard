'use client';
import { useState } from 'react';

export default function DataTabs() {
  const [tab, setTab] = useState(0);

  const handleTabChange = (tabIndex: number) => {
    setTab(tabIndex);
  };

  return (
    <div role="tablist" className="tabs tabs-lifted">
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="Tab 1"
        id="tab1"
        checked={tab === 0}
        onChange={() => handleTabChange(0)}
      />
      <div
        role="tabpanel"
        className={`tab-content bg-base-100 border-base-300 rounded-box p-6 ${
          tab === 0 ? 'block' : 'hidden'
        }`}
      >
        Tab content 1
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="Tab 2"
        id="tab2"
        checked={tab === 1}
        onChange={() => handleTabChange(1)}
      />

      <div
        role="tabpanel"
        className={`tab-content bg-base-100 border-base-300 rounded-box p-6 ${
          tab === 1 ? 'block' : 'hidden'
        }`}
      >
        Tab content 2
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab"
        aria-label="Tab 3"
        id="tab3"
        checked={tab === 2}
        onChange={() => handleTabChange(2)}
      />

      <div
        role="tabpanel"
        className={`tab-content bg-base-100 border-base-300 rounded-box p-6 ${
          tab === 2 ? 'block' : 'hidden'
        }`}
      >
        Tab content 3
      </div>
    </div>
  );
}
