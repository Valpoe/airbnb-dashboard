"use client";
import React, { useState, useEffect } from 'react';
import { getReservations } from '../lib/database';
import ReservationsTable from './reservationsTable';
import { Reservation } from '../lib/definitions';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';

const ReservationsData: React.FC = () => {
  const [data, setData ] = useState<Reservation[]>([]);

  useEffect(() => {
    // Use an IIFE (Immediately Invoked Function Expression) to handle async function
    (async () => {
      try {
        const reservationsData = await getReservations();
        setData(reservationsData);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    })();
  }, []); // Empty dependency array means this effect runs once on mount

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
  async function asdf() {
    const data = await getReservations();
    console.log(data);
  }

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div>
        <h1 className="text-xl mb-5">Hello from reservations-data</h1>
        <button onClick={asdf}>Click me</button>
        {/* <Datepicker
          placeholder='Select date range'
          value={dateValue}
          onChange={handleDateChange}
          displayFormat={'DD/MM/YYYY'}
        /> */}
        <ReservationsTable reservations={data} />
      </div>
    </main>
  );
};

export default ReservationsData;

