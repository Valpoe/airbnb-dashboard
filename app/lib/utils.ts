import dayjs from 'dayjs';

export const formatDate = (date: string | Date): string =>
  dayjs(date).format('DD/MM/YYYY');

// export const formatDate = (dateString: string) => {
//   if (!dateString) return dateString;

//   const options: Intl.DateTimeFormatOptions = {
//     day: 'numeric',
//     month: 'numeric',
//     year: 'numeric'
//   };
//   return new Date(dateString).toLocaleDateString(undefined, options);
// };
