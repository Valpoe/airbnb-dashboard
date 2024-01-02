'use client';
import React, { useState, useEffect } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';

const DatePicker = ({ onDateChange }) => {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null
  });

  const handleValueChange = (newValue) => {
    setValue(newValue);
  };

    useEffect(() => {
        if (value.startDate && value.endDate) {
            onDateChange(value.startDate, value.endDate);
        }
    }, [value]);

  return (
    <Datepicker
      primaryColor="orange"
      inputClassName="border border-secondary-content w-full py-2 px-3 text-primary-content focus:outline-none focus:shadow-outline"
      displayFormat={'DD/MM/YYYY'}
      placeholder='Select a date range'
      startFrom={new Date('2022-01-01')}
      startWeekOn="mon"
      showShortcuts={true}
      configs={{
        shortcuts: {
          currentMonth: 'This month',
          pastMonth: 'Last month',
          year2022: {
            text: '2022',
            period: {
                start: "2022-01-01",
                end: "2022-12-31"
            },
          },
          allTime: {
            text: 'All time',
            period: {
                start: "2022-01-01",
                end: new Date().toISOString()
            },
          },
        }
      }}
      showFooter={true}
      readOnly={true}
      value={value}
      onChange={handleValueChange}
    />
  );
};
export default DatePicker;
