'use client';
import BarChart from '@/app/analytics/bar-chart/bar-chart';
import DataButtons from '@/app/analytics/components/data-buttons';
import DatePicker from '@/app/analytics/components/date-picker';
import LineChart from '@/app/analytics/line-chart/line-chart';
import PieChart from '@/app/analytics/pie-chart/pie-chart';
import Statistics from '@/app/analytics/statistics/statistics';
import ReservationsTable from '@/app/analytics/table/table';
import {
  fetchListingsByDateRange,
  fetchReservationsByDateRangeAndListings
} from '@/app/lib/database';
import { Listing, Reservation } from '@/app/lib/definitions';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import styles from './analytics.module.scss';

export default function ReservationData() {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedButton, setselectedButton] = useState('statistics');
  const [dateRange, setDateRange] = useState({
    startDate: '2022-01-01',
    endDate: '2023-12-31'
  });
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListings, setSelectedListings] = useState<number[]>([]);

  const fetchAndSetListings = async (startDate: string, endDate: string) => {
    try {
      const fetchedListings = await fetchListingsByDateRange(
        startDate,
        endDate
      );
      setListings(fetchedListings);
      setSelectedListings(fetchedListings.map((listing) => listing.id));
    } catch (error) {
      console.error('Error fetching initial data: ', error);
    }
  };

  useEffect(() => {
    fetchAndSetListings(dateRange.startDate, dateRange.endDate);
  }, [dateRange.startDate, dateRange.endDate]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservations = await fetchReservationsByDateRangeAndListings(
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
            dateRange={dateRange}
          />
        );
      case 'table':
        return <ReservationsTable reservations={reservations} />;
      case 'line-chart':
        return (
          <LineChart
            reservations={reservations}
            listings={listings}
            selectedListings={selectedListings}
            dateRange={dateRange}
          />
        );
      case 'bar-chart':
        return (
          <BarChart
            reservations={reservations}
            listings={listings}
            selectedListings={selectedListings}
            dateRange={dateRange}
          />
        );
      case 'pie-chart':
        return (
          <PieChart
            reservations={reservations}
            listings={listings}
            selectedListings={selectedListings}
            dateRange={dateRange}
          />
        );
      default:
        return (
          <Statistics
            reservations={reservations}
            listings={listings}
            selectedListings={selectedListings}
            dateRange={dateRange}
          />
        );
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropDownOpen(false);
        if (menuRef.current) {
          menuRef.current.removeAttribute('open');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  return (
    <main className={styles.mainContainer}>
      <div className={styles.secondContainer}>
        <h1 className={styles.headerText}>Reservations data</h1>
        <div className={styles.gridContainer}>
          <div>
            <DatePicker onDateChange={handleDateChange} />
          </div>
          <details
            className="dropdown"
            ref={menuRef}
            onClick={() => setDropDownOpen(!dropDownOpen)}
          >
            <summary className={cn('btn', styles.dropdown)}>
              Select listings
              {dropDownOpen ? (
                <ChevronUpIcon className={styles.chevronIcon} />
              ) : (
                <ChevronDownIcon className={styles.chevronIcon} />
              )}
            </summary>
            <ul className={cn('menu', 'dropdown-content', styles.dropdownMenu)}>
              {listings.map((listing, id) => (
                <li key={id}>
                  <label className={styles.dropdownMenuItems}>
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={() => handleListingChange(listing.id)}
                      checked={selectedListings.includes(listing.id)}
                    />
                    <span>{listing.internal_name}</span>
                  </label>
                </li>
              ))}
            </ul>
          </details>
          <div className={styles.dataButtonsContainer}>
            <DataButtons
              selectedButton={selectedButton}
              setselectedButton={setselectedButton}
            />
          </div>
        </div>
        {renderChartComponent()}
      </div>
    </main>
  );
}
