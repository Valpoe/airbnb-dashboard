import dayjs from 'dayjs';

export const formatDate = (date: string | Date): string =>
  dayjs(date).format('DD/MM/YYYY');

export const formatCurrency = (value: number): string =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

// export const formatDate = (dateString: string) => {
//   if (!dateString) return dateString;

//   const options: Intl.DateTimeFormatOptions = {
//     day: 'numeric',
//     month: 'numeric',
//     year: 'numeric'
//   };
//   return new Date(dateString).toLocaleDateString(undefined, options);
// };
