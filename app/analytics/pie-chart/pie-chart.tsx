import DataTypeButtons from '@/app/analytics/components/data-type-buttons';
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
import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import styles from './pie-chart.module.scss';

export default function PieChart({
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
    return selectedListings.map((selectedListingId, index) => {
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
        data: totalValue,
        backgroundColor: getDataColors(index)
      };
    });
  };

  const statistics = getStatisticsForSelectedListings();

  const data = {
    labels: statistics.map((stat) => stat.label),
    datasets: [
      {
        data: statistics.map((stat) => stat.data),
        backgroundColor: statistics.map((stat) => stat.backgroundColor)
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 20
        }
      },
      title: {
        display: true,
        position: 'bottom' as const,
        text: dataTypes[selectedDataType].label
      }
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.gridContainer}>
        <DataTypeButtons
          selectedDataType={selectedDataType}
          toggleDataType={toggleDataType}
        />
      </div>
      <div className={styles.chartContainer}>
        <Pie options={options} data={data} />
      </div>
    </div>
  );
}
