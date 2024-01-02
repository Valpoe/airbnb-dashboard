
import { fetchReservations_2022 } from '../lib/database';
import ReservationsTable from './reservationsTable';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';

export default async function ReservationDataPage() {
  const reservations2022 = await fetchReservations_2022();

  // const handleDateChange = (newDate: DateValueType | null) => {
  //   if (newDate) {
  //     const { startDate, endDate } = newDate;
  //     setDateValue({
  //       startDate: startDate ?? new Date(),
  //       endDate: endDate ?? new Date(),
  //     });
  //   }
  // };

  // useEffect(() => {
  //   const fetchReservations = async () => {
  //     try {
  //       const data = await getReservations();
  //       console.log(data);
  //       setReservations(data);
  //     } catch (error) {
  //       console.error('Error fetching reservations:', error);
  //     }
  //   };

  //   fetchReservations();
  // }, []);

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div>
        <h1 className="text-xl mb-5">Hello from reservations-data</h1>
        {/* <Datepicker
          placeholder='Select date range'
          value={dateValue}
          onChange={handleDateChange}
          displayFormat={'DD/MM/YYYY'}
        /> */}
        <ReservationsTable reservations={reservations2022} />
      </div>
    </main>
  );
};


