'use client';
import {
  fetchListings,
  fetchListingsByDateRangeAndListings,
  fetchReservations_2022
} from '@/app/lib/database';
import { Listing, Reservation } from '@/app/lib/definitions';
import DataButtons from '@/app/ui/reservations-data/data-buttons';
import DatePicker from '@/app/ui/reservations-data/date-picker';
import Statistics from '@/app/ui/reservations-data/statistics';
import ReservationsTable from '@/app/ui/reservations-data/table';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export default function ReservationDataPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedButton, setselectedButton] = useState('statistics');
  const [dateRange, setDateRange] = useState({
    startDate: '2022-01-01',
    endDate: new Date().toISOString()
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
      try {
        const reservations = await fetchListingsByDateRangeAndListings(
          dateRange.startDate,
          dateRange.endDate,
          selectedListings
        );
        setReservations(reservations);
      } catch (error) {
        console.error('Error fetching reservations: ', error);
      }
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

  const handleDateChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
  };

  const renderChartComponent = () => {
    switch (selectedButton) {
      case 'statistics':
        return (
          <Statistics
            reservations={reservations}
            listings={listings}
            selectedListings={selectedListings}
          />
        );
      case 'table':
        return <ReservationsTable reservations={reservations} />;
      default:
        return (
          <Statistics
            reservations={reservations}
            listings={listings}
            selectedListings={selectedListings}
          />
        );
    }
  };

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="container mx-auto">
        <h1 className="text-xl mb-5">Reservations data</h1>
        <div className="flex flex-row mb-5 gap-4">
          <DatePicker onDateChange={handleDateChange} />
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn w-48 h-14 bg-neutral hover:bg-neutral"
            >
              Select listings
              <ChevronDownIcon className="w-6 h-6" />
            </div>
            <ul
              tabIndex={0}
              className="p-2 shadow menu dropdown-content z-[1] bg-base-100 w-80"
            >
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
          </div>
          <DataButtons
            selectedButton={selectedButton}
            setselectedButton={setselectedButton}
          />
        </div>
        {renderChartComponent()}
      </div>
    </main>
  );
}
