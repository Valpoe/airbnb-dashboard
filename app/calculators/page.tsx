'use client';
import ApartmentRevenueForm from '@/app/calculators/apartment-revenue/apartment-revenue-form';
import { CalculatorType, calculatorTypes } from '@/app/lib/definitions';
import cn from 'classnames';
import { Metadata } from 'next';
import React, { useState } from 'react';
import styles from './calculators.module.scss';

// export const metadata: Metadata = {
//   title: 'Calculators'
// };

const tabContents: Record<CalculatorType, React.ReactNode> = {
  apartmentRevenue: <ApartmentRevenueForm />,
  calculator2: <div>Content for Tab 2</div>,
  calculator3: <div>Content for Tab 3</div>
};

export default function CalculatorsPage() {
  const [selectedCalculator, setSelectedCalculator] =
    useState<CalculatorType>('apartmentRevenue');
  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.headerText}>
        {calculatorTypes[selectedCalculator].description}
      </h1>
      <div role="tablist" className="tabs tabs-bordered tabs-lg">
        {Object.keys(calculatorTypes).map((key, index) => (
          <React.Fragment key={key}>
            <input
              type="radio"
              name="tabs"
              role="tab"
              className={`tab ${
                selectedCalculator === key ? styles.activeTab : ''
              }`}
              onChange={() => setSelectedCalculator(key as CalculatorType)}
              aria-label={calculatorTypes[key as CalculatorType].name}
              defaultChecked={index === 0}
            />
            <div
              role="tabpanel"
              className={cn('tab-content', styles.tabContent)}
            >
              {tabContents[key as CalculatorType]}
            </div>
          </React.Fragment>
        ))}
      </div>
    </main>
  );
}
