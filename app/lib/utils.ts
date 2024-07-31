import dayjs from 'dayjs';

export const formatDate = (date: string | Date): string =>
  dayjs(date).format('DD/MM/YYYY');

export const calculateAmountOfDays = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24); // 1 day in milliseconds
  return days;
};

export const formatAmount = (amount: number) => {
  if (amount >= 1000) {
    return (amount / 1000).toFixed(2) + 'K';
  }
  return amount.toFixed(2);
};

export const calculateDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
};

const dataColors = [
  '#8b5cd6',
  '#2be3bb',
  '#d69b5c',
  '#e268b0',
  '#6877e2',
  '#9cd63d',
  '#ba68e2',
  '#45c4dd',
  '#cf8172',
  '#db4cdb',
  '#429de3',
  '#e0c931'
];

export const getDataColors = (index: number) => {
  return dataColors[index % dataColors.length];
};
