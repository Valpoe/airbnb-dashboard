import 'chart.js/auto';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Listing, Reservation } from '../../lib/definitions';

type DataType = {
  label: string;
  property: keyof Reservation;
};
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
  }
};

type DataTypeKey = keyof typeof dataTypes;

export default function LineChart({
  reservations,
  listings,
  selectedListings
}: {
  reservations: Reservation[];
  listings: Listing[];
  selectedListings: number[];
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
        let propertyValue;

        if (dataTypes[selectedDataType].property === 'event_type') {
          // For 'Reservations' type, calculate the count of rows
          propertyValue = 1;
        } else {
          propertyValue = reservation[dataTypes[selectedDataType].property];
        }

        cumulativeAmount +=
          typeof propertyValue === 'number' ? propertyValue : 0;

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
      <div className="flex flex-row mb-5 gap-4">
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

// Function to generate a random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
