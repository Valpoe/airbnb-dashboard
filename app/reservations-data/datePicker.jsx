'use client';
import { useEffect } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';

const DatePicker = ({ onDateChange, selectedRange }) => {
  const handleSelectedRangeChange = (newSelectedRange) => {
    // Update the parent component's state with the new selected range
    onDateChange(newSelectedRange.startDate, newSelectedRange.endDate);
  };

  // Use useEffect to listen for changes in the selectedRange prop
  useEffect(() => {
    if (selectedRange.startDate && selectedRange.endDate) {
      // Update the parent component's state when selectedRange changes
      onDateChange(selectedRange.startDate, selectedRange.endDate);
    }
  }, [onDateChange, selectedRange]);

  return (
    <Datepicker
      primaryColor="orange"
      inputClassName="border border-secondary-content h-14 bg-neutral w-full w-80 py-3 px-3 focus:outline-none focus:shadow-outline"
      displayFormat={'DD/MM/YYYY'}
      placeholder="Select a date range"
      startFrom={selectedRange.startDate}
      endTo={selectedRange.endDate}
      startWeekOn="mon"
      showShortcuts={true}
      configs={{
        shortcuts: {
          currentMonth: 'This month',
          pastMonth: 'Last month',
          year2022: {
            text: '2022',
            period: {
              start: '2022-01-01',
              end: '2022-12-31'
            }
          },
          allTime: {
            text: 'All time',
            period: {
              start: '2022-01-01',
              end: new Date().toISOString()
            }
          }
        }
      }}
      showFooter={true}
      readOnly={true}
      selectedRange={selectedRange}
      onChange={handleSelectedRangeChange}
    />
  );
};
export default DatePicker;
