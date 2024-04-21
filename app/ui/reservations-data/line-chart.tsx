import {
  DataTypeKey,
  Listing,
  Reservation,
  dataTypes
} from '@/app/lib/definitions';
import { calculateAmountOfDays, getRandomColor } from '@/app/lib/utils';
import 'chart.js/auto';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';

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
        borderColor: getRandomColor(),
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
        position: 'top' as const
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
    <div>
      <div className="flex flex-row mb-5 gap-4 justify-center">
        {Object.keys(dataTypes).map((dataType) => (
          <button
            key={dataType}
            className={`btn w-36 inline-flex items-center bg-neutral ${
              selectedDataType === dataType
                ? 'text-accent hover:bg-neutral'
                : 'hover:text-accent bg-neutral hover:bg-neutral'
            }`}
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
