import {
  DataTypeKey,
  Listing,
  Reservation,
  dataTypes
} from '@/app/lib/definitions';
import { calculateAmountOfDays, getRandomColor } from '@/app/lib/utils';
import 'chart.js/auto';
import cn from 'classnames';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import styles from './bar-chart.module.scss';

export default function BarChart({
  reservations,
  listings,
  selectedListings,
  dateRange
}: {
  reservations: Reservation[];
  listings: Listing[];
  selectedListings: number[];
  dateRange: { startDate: string; endDate: string };
}) {
  const [selectedDataType, setSelectedDataType] =
    useState<DataTypeKey>('amount');

  const toggleDataType = (dataType: DataTypeKey) => {
    setSelectedDataType(dataType);
  };

  const getStatisticsForSelectedListings = () => {
    return selectedListings.map((selectedListingId) => {
      const listingReservations = reservations.filter(
        (reservation) => reservation.listing_id === selectedListingId
      );

      let totalValue;

      switch (selectedDataType) {
        case 'amount':
          totalValue = listingReservations.reduce(
            (acc, cur) => acc + cur.amount,
            0
          );
          break;
        case 'nights':
          totalValue = listingReservations.reduce(
            (acc, cur) => acc + cur.nights,
            0
          );
          break;
        case 'reservations':
          totalValue = listingReservations.filter(
            (row) => row.event_type === 'Reservation'
          ).length;
          break;
        case 'occupancy_rate':
          const totalNights = listingReservations.reduce(
            (acc, cur) => acc + cur.nights,
            0
          );
          totalValue = (
            (totalNights /
              calculateAmountOfDays(dateRange.startDate, dateRange.endDate)) *
            100
          ).toFixed(2);
          break;
        default:
          totalValue = 0;
      }

      return {
        label: listings.find((listing) => listing.id === selectedListingId)
          ?.internal_name,
        totalValue,
        backgroundColor: getRandomColor()
      };
    });
  };

  const statistics = getStatisticsForSelectedListings();

  const labels = ['Listing'];

  const data = {
    labels,
    datasets: statistics.map((statistic) => ({
      label: statistic.label,
      data: [statistic.totalValue],
      backgroundColor: statistic.backgroundColor
    }))
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        title: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: dataTypes[selectedDataType].label
        }
      }
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.gridContainer}>
        {Object.keys(dataTypes).map((dataType) => (
          <button
            key={dataType}
            className={cn(
              'btn',
              styles.dataTypeButtons,
              selectedDataType === dataType
                ? styles.activeButton
                : styles.inactiveButton
            )}
            onClick={() => toggleDataType(dataType as DataTypeKey)}
          >
            {dataTypes[dataType].label}
          </button>
        ))}
      </div>

      <Bar options={options} data={data} />
    </div>
  );
}
