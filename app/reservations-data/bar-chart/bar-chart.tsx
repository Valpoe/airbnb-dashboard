import { createBarChart } from '@/app/components/create-chart';
import {
  DataTypeKey,
  Listing,
  Reservation,
  dataTypes
} from '@/app/lib/definitions';
import { calculateAmountOfDays } from '@/app/lib/utils';
import DataTypeButtons from '@/app/reservations-data/components/data-type-buttons';
import {
  BarChart,
  LegendBox,
  LegendBoxBuilders,
  UIDraggingModes,
  UIOrigins,
  emptyFill
} from '@arction/lcjs';
import 'chart.js/auto';
import { useEffect, useState } from 'react';
import styles from './bar-chart.module.scss';

type BarChartDataSet = {
  category: string;
  value: number;
};

export default function LCBarChart({
  reservations,
  listings,
  selectedListings,
  dateRange,
  selectedDataType,
  toggleDataType
}: {
  reservations: Reservation[];
  listings: Listing[];
  selectedListings: number[];
  dateRange: { startDate: string; endDate: string };
  selectedDataType: DataTypeKey;
  toggleDataType: (dataType: DataTypeKey) => void;
}) {
  const [chart, setChart] = useState<BarChart | undefined>(undefined);
  const [legendBox, setLegendBox] = useState<LegendBox | undefined>(undefined);

  const getStatisticsForSelectedListings = (): BarChartDataSet[] => {
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
          totalValue =
            (totalNights /
              calculateAmountOfDays(dateRange.startDate, dateRange.endDate)) *
            100;
          break;
        default:
          totalValue = 0;
      }

      return {
        category:
          listings.find((listing) => listing.id === selectedListingId)
            ?.internal_name ?? '',
        value: totalValue
      };
    });
  };

  const statistics = getStatisticsForSelectedListings();

  useEffect(() => {
    const initChart = async () => {
      try {
        const chart = await createBarChart('chart-container');
        chart.setTitle('');
        const legend = chart
          .addLegendBox(LegendBoxBuilders.VerticalLegendBox)
          .setTitle('Listings')
          .setPosition({ x: 100, y: 100 })
          .setMargin(1)
          .setOrigin(UIOrigins.RightTop)
          .setDraggingMode(UIDraggingModes.draggable)
          .setBackground((background) =>
            background.setFillStyle(chart.getTheme().uiBackgroundFillStyle)
          )
          .setAutoDispose({ type: 'max-height', maxHeight: 0.75 });
        setLegendBox(legend);
        setChart(chart);
      } catch (error) {
        console.error('Error initializing chart:', error);
      }
    };

    initChart();

    return () => {
      if (chart) {
        chart.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (chart) {
      chart.valueAxis.setTitle(dataTypes[selectedDataType].label);
      chart.setCategoryLabels({ labelFillStyle: emptyFill });
      chart.setData(statistics);
      if (legendBox) {
        legendBox.dispose();
      }
      legendBox?.add(chart);
    }
  }, [statistics]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.gridContainer}>
        <DataTypeButtons
          toggleDataType={toggleDataType}
          selectedDataType={selectedDataType}
        />
      </div>
      <div
        id="chart-container"
        style={{ width: '100%', height: '600px' }}
      ></div>
    </div>
  );
}
