import { createChart } from '@/app/components/create-chart';
import {
  DataTypeKey,
  Listing,
  Reservation,
  dataTypes
} from '@/app/lib/definitions';
import { calculateAmountOfDays } from '@/app/lib/utils';
import DataTypeButtons from '@/app/reservations-data/components/data-type-buttons';
import {
  AxisScrollStrategies,
  AxisTickStrategies,
  ChartXY,
  LegendBox,
  LegendBoxBuilders,
  UIBackground,
  UIDraggingModes,
  UIOrigins,
  emptyTick
} from '@arction/lcjs';
import { useCallback, useEffect, useState } from 'react';
import styles from './line-chart.module.scss';

export default function LineChart({
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
  const [chart, setChart] = useState<ChartXY<UIBackground> | undefined>(
    undefined
  );
  const [legendBox, setLegendBox] = useState<LegendBox | undefined>(undefined);

  const generateChartData = useCallback(() => {
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
        let totalAmount;

        if (dataTypes[selectedDataType].label === 'Reservations') {
          totalAmount = 1;
        } else if (dataTypes[selectedDataType].label === 'Occupancy Rate') {
          const totalNights = reservation.nights;
          const totalDays = calculateAmountOfDays(
            dateRange.startDate,
            dateRange.endDate
          );
          totalAmount = (totalNights / totalDays) * 100;
        } else {
          totalAmount = reservation[dataTypes[selectedDataType].property];
        }

        cumulativeAmount += typeof totalAmount === 'number' ? totalAmount : 0;

        return {
          x: new Date(reservation.payout_date).getTime(),
          y: cumulativeAmount,
          listing_id: selectedListingId
        };
      });
      return data;
    });
  }, [selectedDataType, reservations, selectedListings, dateRange]);

  const clearChart = useCallback(() => {
    if (chart) {
      chart.getSeries().forEach((series) => series.dispose());
    }
  }, [chart]);

  useEffect(() => {
    const initChart = async () => {
      try {
        const chart = await createChart('chart-container');

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

        const legend = chart
          .addLegendBox(LegendBoxBuilders.VerticalLegendBox)
          .setPosition({ x: 100, y: 100 })
          .setMargin(1)
          .setTitle('Listings')
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
      setChart((prevChart) => {
        if (prevChart) {
          prevChart.dispose();
        }
        return undefined;
      });
    };
  }, []);

  useEffect(() => {
    if (chart && legendBox) {
      clearChart();

      // Set axis title and interval
      chart.getDefaultAxisY().setTitle(dataTypes[selectedDataType].label);
      const startMillis = new Date(dateRange.startDate).getTime();
      const endMillis = new Date(dateRange.endDate).getTime();
      chart
        .getDefaultAxisX()
        .setInterval({ start: startMillis, end: endMillis });

      const dataSets = generateChartData();

      dataSets.forEach((dataSet, index) => {
        const listing = listings.find(
          (listing) => listing.id === selectedListings[index]
        );

        if (listing) {
          const series = chart
            .addLineSeries({
              dataPattern: {
                pattern: 'ProgressiveX'
              }
            })
            .setName(listing.internal_name);

          series.add(dataSet);
          legendBox.add(series);
        }
      });
    }
  }, [
    chart,
    legendBox,
    selectedDataType,
    generateChartData,
    clearChart,
    dateRange,
    listings,
    selectedListings
  ]);

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
