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
  LegendBoxBuilders,
  UIDraggingModes,
  UIOrigins,
  emptyFill
} from '@arction/lcjs';
import { useCallback, useEffect, useMemo, useRef } from 'react';
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
  toggleDataType,
  id
}: {
  reservations: Reservation[];
  listings: Listing[];
  selectedListings: number[];
  dateRange: { startDate: string; endDate: string };
  selectedDataType: DataTypeKey;
  toggleDataType: (dataType: DataTypeKey) => void;
  id: string;
}) {
  const chartRef = useRef<BarChart | null>(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const initChart = () => {
      try {
        const chart = createBarChart(container);
        chartRef.current = chart;
        chart.setTitle('');
      } catch (error) {
        console.error('Error initializing chart:', error);
      }
    };
    initChart();
    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, [id]);

  const getChartData = useCallback((): BarChartDataSet[] => {
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
  }, [selectedListings, listings, reservations, selectedDataType, dateRange]);

  const chartDataSet = useMemo(() => getChartData(), [getChartData]);

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      chart.getLegendBoxes().forEach((legend) => legend.dispose());
      chart.valueAxis.setTitle(dataTypes[selectedDataType].label);
      chart.setCategoryLabels({ labelFillStyle: emptyFill });

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
      chart.setData(chartDataSet);
      legend.add(chart);
    }
  }, [selectedDataType, chartDataSet]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.gridContainer}>
        <DataTypeButtons
          toggleDataType={toggleDataType}
          selectedDataType={selectedDataType}
        />
      </div>
      <div
        id={id}
        ref={containerRef}
        style={{ width: '100%', height: '600px' }}
      ></div>
    </div>
  );
}
