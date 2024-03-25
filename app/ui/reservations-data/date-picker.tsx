import { useState } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';

interface DatePickerProps {
  onDateChange: (startDate: string, endDate: string) => void;
}

export default function DatePicker({ onDateChange }: DatePickerProps) {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null
  });

  const handleValueChange = (newValue: any) => {
    setValue(newValue);
    onDateChange(newValue.startDate, newValue.endDate);
  };

  return (
    <Datepicker
      primaryColor="orange"
      inputClassName="h-14 bg-neutral text-neutral-content w-full w- py-3 px-3 focus:outline-none focus:shadow-outline"
      displayFormat={'DD/MM/YYYY'}
      placeholder="Select a date range"
      startFrom={new Date('2022-01-01')}
      startWeekOn="mon"
      showShortcuts={true}
      configs={{
        shortcuts: {
          year2022: {
            text: '2022',
            period: {
              start: '2022-01-01',
              end: '2022-12-31'
            }
          },
          year2023: {
            text: '2023',
            period: {
              start: '2023-01-01',
              end: '2023-12-31'
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
      value={value}
      onChange={handleValueChange}
    />
  );
}
