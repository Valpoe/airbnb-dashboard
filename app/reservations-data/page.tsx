'use client';
import React, { useState, useEffect } from 'react';
import {
  fetchReservations_2022,
  fetchReservationsByDateRange,
  fetchListings
} from '../lib/database';
import ReservationsTable from './reservationsTable';
import DatePicker from './datePicker';
import { Listing } from '../lib/definitions';

export default function ReservationDataPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchListingsData = async () => {
      const data = await fetchListings();
      setListings(data);
    };

    fetchListingsData();
  }, []);

  const fetchReservations = async (startDate: string, endDate: string) => {
    const data = await fetchReservationsByDateRange(startDate, endDate);
    setReservations(data);
  };

  const handleDateChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
    fetchReservations(startDate, endDate);
  };

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="container mx-auto">
        <h1 className="text-xl mb-5">Hello from reservations-data</h1>
        <div className="flex flex-row mb-5">
          <div className="flex">
            <DatePicker onDateChange={handleDateChange} />
              <div className="flex ml-4">
                <details className="dropdown">
                  <summary className="btn w-48 h-14 border border-secondary-content bg-neutral">
                    Select listings
                  </summary>
                  <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 w-80">
                    {listings.map((listing, id) => (
                      <li key={id}>
                        <label className="flex items-center">
                          <input type="checkbox" className="checkbox" />
                          <span className="ml-2">{listing.internal_name}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
              <div className='flex ml-4 gap-4'>
              <button className="btn w-28 h-14 border border-secondary-content bg-neutral">Table</button>
              <button className="btn w-28 h-14 border border-secondary-content bg-neutral">Line Chart</button>
              <button className="btn w-28 h-14 border border-secondary-content bg-neutral">Bar Chart</button>
              </div>
          </div>
        </div>
        <ReservationsTable reservations={reservations} />
      </div>
    </main>
  );
}
