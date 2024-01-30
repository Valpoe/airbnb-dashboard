import dayjs from 'dayjs';

export const formatDate = (date: string | Date): string =>
  dayjs(date).format('DD/MM/YYYY');

export const calculateAmountOfDays = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
  return days;
};

export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
