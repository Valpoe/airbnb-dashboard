"use client";
import React, { useState } from 'react';
import { fetchReservations_2022, fetchReservationsByDateRange } from '../lib/database';
import ReservationsTable from './reservationsTable';
import DatePicker from './datePicker';

export default function ReservationDataPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  const fetchReservations = async (startDate: string, endDate: string) => {
    const data = await fetchReservationsByDateRange(startDate, endDate);
    setReservations(data);
  }

  const handleDateChange =  (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
    fetchReservations(startDate, endDate);
  }

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div>
        <h1 className="text-xl mb-5">Hello from reservations-data</h1>
        <div className='mb-5 w-80'>
        <DatePicker onDateChange={handleDateChange} />
        </div>
        <ReservationsTable reservations={reservations} />
      </div>
    </main>
  );
};


