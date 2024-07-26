import DataTypeButtons from '@/app/analytics/components/data-type-buttons';
import { createLineChart } from '@/app/components/create-chart';
import {
  DataTypeKey,
  Listing,
  Reservation,
  dataTypes
} from '@/app/lib/definitions';
import { calculateAmountOfDays } from '@/app/lib/utils';
import {
  AxisScrollStrategies,
  AxisTickStrategies,
  ChartXY,
  LegendBoxBuilders,
  UIDraggingModes,
  UIOrigins,
  emptyTick
} from '@arction/lcjs';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import styles from './line-chart.module.scss';

type LineChartDataSet = {
  x: number;
  y: number;
  listing_id: number;
};

export default function LCLineChart({
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
  const chartRef = useRef<ChartXY | null>(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const initChart = () => {
      try {
        const chart = createLineChart(container);
        chartRef.current = chart;
        chart.setTitle('');

        const axisX = chart.getDefaultAxisX();
        axisX
          .setScrollStrategy(AxisScrollStrategies.fitting)
          .fit()
          .setTickStrategy(AxisTickStrategies.DateTime, (ticks) =>
            ticks
              .setFormattingMinute(
                {},
                {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                },
                {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                }
              )
              .setFormattingHour(
                {},
                { hour: '2-digit', minute: '2-digit', hour12: false },
                { hour: '2-digit', minute: '2-digit', hour12: false }
              )
              .setFormattingDay(
                {},
                { day: 'numeric', weekday: 'short' },
                { hour: '2-digit', minute: '2-digit', hour12: false }
              )
              .setCursorFormatter((x) =>
                new Date(x).toLocaleDateString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })
              )
              .setGreatTickStyle(emptyTick)
          );
        chart.getDefaultAxisY().setTickStrategy(AxisTickStrategies.Numeric);
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

  const getChartData = useCallback((): LineChartDataSet[] => {
    return selectedListings.flatMap((selectedListingId) => {
      const listingReservations = reservations
        .filter((reservation) => reservation.listing_id === selectedListingId)
        .sort(
          (a, b) =>
            new Date(a.payout_date).getTime() -
            new Date(b.payout_date).getTime()
        );

      const totalDays = calculateAmountOfDays(
        dateRange.startDate,
        dateRange.endDate
      );

      return listingReservations.map(
        (reservation, index, array): LineChartDataSet => {
          let yValue = 0;

          const currentReservations = array.slice(0, index + 1);

          switch (selectedDataType) {
            case 'amount':
              yValue = currentReservations.reduce(
                (acc, cur) => acc + cur.amount,
                0
              );
              break;
            case 'nights':
              yValue = currentReservations.reduce(
                (acc, cur) => acc + cur.nights,
                0
              );
              break;
            case 'reservations':
              yValue = currentReservations.filter(
                (row) => row.event_type === 'Reservation'
              ).length;
              break;
            case 'occupancy_rate':
              const totalNights = currentReservations.reduce(
                (acc, cur) => acc + cur.nights,
                0
              );
              yValue = (totalNights / totalDays) * 100;
              break;
            default:
              yValue = 0;
          }

          return {
            x: new Date(reservation.payout_date).getTime(),
            y: yValue,
            listing_id: selectedListingId
          };
        }
      );
    });
  }, [selectedDataType, reservations, selectedListings, dateRange]);

  const chartDataSet = useMemo(() => getChartData(), [getChartData]);

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      chart.getLegendBoxes().forEach((legend) => legend.dispose());
      chart.getSeries().forEach((series) => series.dispose());

      // Set up chart axes
      chart.getDefaultAxisY().setTitle(dataTypes[selectedDataType].label);
      const startMillis = new Date(dateRange.startDate).getTime();
      const endMillis = new Date(dateRange.endDate).getTime();
      chart
        .getDefaultAxisX()
        .setInterval({ start: startMillis, end: endMillis });

      // Create legend
      const legend = chart
        .addLegendBox(LegendBoxBuilders.VerticalLegendBox)
        .setTitle('Listings')
        .setPosition({ x: 100, y: 100 })
        .setOrigin(UIOrigins.RightTop)
        .setDraggingMode(UIDraggingModes.draggable)
        .setMargin(1)
        .setBackground((background) =>
          background.setFillStyle(chart.getTheme().uiBackgroundFillStyle)
        )
        .setAutoDispose({ type: 'max-height', maxHeight: 0.75 });

      // Group data by listing_id
      const groupedData = chartDataSet.reduce(
        (acc, dataPoint) => {
          if (!acc[dataPoint.listing_id]) {
            acc[dataPoint.listing_id] = [];
          }
          acc[dataPoint.listing_id].push({ x: dataPoint.x, y: dataPoint.y });
          return acc;
        },
        {} as Record<number, { x: number; y: number }[]>
      );

      // Create a series for each listing
      Object.entries(groupedData).forEach(([listingId, data]) => {
        const listing = listings.find((l) => l.id === Number(listingId));
        const seriesName = listing?.internal_name ?? `Listing ${listingId}`;

        const lineSeries = chart.addLineSeries({
          dataPattern: { pattern: 'ProgressiveX' }
        });

        lineSeries.setName(seriesName);
        lineSeries.add(data);

        legend.add(lineSeries);
      });
    }
  }, [chartDataSet, selectedDataType, dateRange, listings]);

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
