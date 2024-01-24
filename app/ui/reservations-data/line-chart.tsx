import 'chart.js/auto';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import dayjs from 'dayjs';
import { Line } from 'react-chartjs-2';
import { Listing, Reservation } from '../../lib/definitions';

export default function LineChart({
  reservations,
  listings,
  selectedListings
}: {
  reservations: Reservation[];
  listings: Listing[];
  selectedListings: number[];
}) {
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
        cumulativeAmount += reservation.amount;
        return {
          x: dayjs(reservation.payout_date).format(),
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
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            day: 'MMM D' // Customize the display format
          }
        },
        title: {
          display: true,
          text: 'Date Range'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Amount'
        }
      }
    }
  };

  return (
    <div>
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
