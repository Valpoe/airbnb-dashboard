import { Listing, Reservation } from '@/app/lib/definitions';
import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

export default function BarChart({
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

      const totalAmount = listingReservations.reduce(
        (acc, cur) => acc + cur.amount,
        0
      );

      return {
        label: listings.find((listing) => listing.id === selectedListingId)
          ?.internal_name,
        totalAmount,
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
      data: [statistic.totalAmount], // Use an array for each listing's totalAmount
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
          text: 'Amount'
        }
      }
    }
  };

  return (
    <div>
      <Bar options={options} data={data} />
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
