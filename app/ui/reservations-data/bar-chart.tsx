import { DataType, Listing, Reservation } from '@/app/lib/definitions';
import { calculateAmountOfDays, getRandomColor } from '@/app/lib/utils';
import 'chart.js/auto';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';

const dataTypes: Record<string, DataType> = {
  amount: {
    label: 'Amount',
    property: 'amount'
  },
  nights: {
    label: 'Nights',
    property: 'nights'
  },
  reservations: {
    label: 'Reservations',
    property: 'event_type'
  },
  occupancy_rate: {
    label: 'Occupancy Rate',
    property: 'nights'
  }
};

type DataTypeKey = keyof typeof dataTypes;

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
      const listingReservations = reservations
        .filter((reservation) => reservation.listing_id === selectedListingId)
        .sort(
          (a, b) =>
            new Date(a.payout_date).getTime() -
            new Date(b.payout_date).getTime()
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

  // Instead of using listing names as labels, use a single label "listing" for the x-axis
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
      <Bar options={options} data={data} />
    </div>
  );
}
