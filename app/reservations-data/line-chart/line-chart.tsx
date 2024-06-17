import { chartjsGlobals } from '@/app/lib/chartjs-globals';
import {
  DataTypeKey,
  Listing,
  Reservation,
  dataTypes
} from '@/app/lib/definitions';
import { calculateAmountOfDays, getDataColors } from '@/app/lib/utils';
import 'chart.js/auto';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import cn from 'classnames';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import styles from './line-chart.module.scss';

export default function LineChart({
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
  chartjsGlobals.setGlobalChartOptions();
  const [selectedDataType, setSelectedDataType] =
    useState<DataTypeKey>('amount');

  const toggleDataType = (dataType: DataTypeKey) => {
    setSelectedDataType(dataType);
  };

  const getStatisticsForSelectedListings = () => {
    return selectedListings.map((selectedListingId) => {
      const listingReservations = reservations
        .filter((reservation) => reservation.listing_id === selectedListingId)
        .sort(
          (a, b) =>
            new Date(a.payout_date).getTime() -
            new Date(b.payout_date).getTime()
        );

      let cumulativeAmount = 0;

      const data = listingReservations.map((reservation) => {
        let totalValue;

        if (dataTypes[selectedDataType].label === 'Reservations') {
          // For 'Reservations' type, calculate the count of rows
          totalValue = 1;
        } else if (dataTypes[selectedDataType].label === 'Occupancy Rate') {
          // For 'Occupancy Rate' type, calculate the occupancy rate
          const totalNights = reservation.nights;
          totalValue =
            (totalNights /
              calculateAmountOfDays(dateRange.startDate, dateRange.endDate)) *
            100;
        } else {
          totalValue = reservation[dataTypes[selectedDataType].property];
        }

        cumulativeAmount += typeof totalValue === 'number' ? totalValue : 0;

        return {
          x: dayjs(reservation.payout_date).format('YYYY-MM-DD'),
          y: cumulativeAmount
        };
      });

      const startDate = new Date(listingReservations[0]?.payout_date);
      const endDate = new Date(
        listingReservations[listingReservations.length - 1]?.payout_date
      );

      return {
        label: listings.find((listing) => listing.id === selectedListingId)
          ?.internal_name,
        data,
        fill: false,
        borderColor: getDataColors(selectedListings.indexOf(selectedListingId)),
        startDate,
        endDate
      };
    });
  };

  const datasets = getStatisticsForSelectedListings();

  const data = {
    datasets
  };

  const options = {
    responsive: true,
    pointStyle: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 20
        }
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            day: 'MMM D'
          },
          tooltipFormat: 'MMMM D, YYYY'
        },
        title: {
          display: true,
          text: 'Date Range'
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
      <Line options={options} data={data} />
    </div>
  );
}
