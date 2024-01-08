'use client';
import { useEffect, useState } from 'react';
import {
  fetchListings,
  fetchListingsByDateRangeAndListings,
  fetchReservations_2022
} from '../lib/database';
import { Listing, Reservation } from '../lib/definitions';
import DatePicker from './datePicker';
import ReservationsTable from './reservationsTable';

export default function ReservationDataPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: '2022-01-01',
    endDate: '2023-12-31'
  });
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListings, setSelectedListings] = useState<number[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const fetchedListings = await fetchListings();
        const reservations = await fetchReservations_2022();
        setListings(fetchedListings);
        setSelectedListings(fetchedListings.map((listing) => listing.id));
        setReservations(reservations);
      } catch (error) {
        console.error('Error fetching initial data: ', error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      const data = await fetchListingsByDateRangeAndListings(
        dateRange.startDate,
        dateRange.endDate,
        selectedListings
      );
      setReservations(data);
    };

    fetchReservations();
  }, [dateRange.startDate, dateRange.endDate, selectedListings]);

  const handleListingChange = (listingId: number) => {
    setSelectedListings((prevListings) => {
      const updatedListings = prevListings.includes(listingId)
        ? prevListings.filter((id) => id !== listingId)
        : [...prevListings, listingId];

      return updatedListings;
    });
  };

  //TODO: FIX THIS
  // const handleDateChange = (startDate: string, endDate: string) => {
  //   setDateRange({ startDate, endDate });
  // };

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="container mx-auto">
        <h1 className="text-xl mb-5">Hello from reservations-data</h1>
        <div className="flex flex-row mb-5">
          <div className="flex">
            <DatePicker onDateChange={setDateRange} selectedRange={dateRange} />
            <div className="flex ml-4">
              <details className="dropdown">
                <summary className="btn w-48 h-14 border border-secondary-content bg-neutral">
                  Select listings
                </summary>
                <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 w-80">
                  {listings.map((listing, id) => (
                    <li key={id}>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="checkbox"
                          onChange={() => handleListingChange(listing.id)}
                          checked={selectedListings.includes(listing.id)}
                        />
                        <span className="ml-2">{listing.internal_name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
            <div className="flex ml-4 gap-4">
              <button className="btn w-36 h-14 border border-secondary-content bg-neutral inline-flex items-center">
                Table
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
                  />
                </svg>
              </button>
              <button className="btn w-36 h-14 border border-secondary-content bg-neutral inline-flex items-center">
                Line Chart
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                  />
                </svg>
              </button>
              <button className="btn w-36 h-14 border border-secondary-content bg-neutral inline-flex items-center">
                Bar Chart
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <ReservationsTable reservations={reservations} />
      </div>
    </main>
  );
}
