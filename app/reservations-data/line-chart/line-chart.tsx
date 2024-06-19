import { createChart } from '@/app/components/create-chart';
import { getStaticProps } from '@/app/lib/actions';
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
  LegendBox,
  LegendBoxBuilders,
  UIBackground,
  UIDraggingModes,
  UIOrigins,
  emptyTick
} from '@arction/lcjs';
import cn from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import styles from './line-chart.module.scss';

export default function LineChart({
  reservations,
  listings,
  selectedListings,
  dateRange,
  license
}: {
  reservations: Reservation[];
  listings: Listing[];
  selectedListings: number[];
  dateRange: { startDate: string; endDate: string };
  license: string;
}) {
  const [chart, setChart] = useState<ChartXY<UIBackground> | undefined>(
    undefined
  );
  const [legendBox, setLegendBox] = useState<LegendBox | undefined>(undefined);
  const [selectedDataType, setSelectedDataType] =
    useState<DataTypeKey>('amount');

  const toggleDataType = (dataType: DataTypeKey) => {
    setSelectedDataType(dataType);
  };

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
    if (license) {
      const lc = createChart(license, 'chart-container');
      lc.setTitle('');
      lc.getDefaultAxisX()
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
      lc.getDefaultAxisY().setTickStrategy(AxisTickStrategies.Numeric);
      const legend = lc
        .addLegendBox(LegendBoxBuilders.VerticalLegendBox)
        .setPosition({ x: 100, y: 100 })
        .setMargin(1)
        .setTitle('Listings')
        .setOrigin(UIOrigins.RightTop)
        .setDraggingMode(UIDraggingModes.draggable)
        .setBackground((background) =>
          background.setFillStyle(lc.getTheme().uiBackgroundFillStyle)
        )
        .setAutoDispose({ type: 'max-height', maxHeight: 0.5 });

      setLegendBox(legend);

      setChart(lc);
      return () => {
        if (lc) {
          lc.dispose();
        }
      };
    } else {
      console.error(
        'LightningChart license key is missing or container is null'
      );
    }
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
        {Object.keys(dataTypes).map((dataType) => (
          <button
            key={dataType}
            className={cn(
              'btn',
              styles.dataTypeButtons,
              selectedDataType === dataType
                ? styles.activeButton
                : styles.inactiveButton
            )}
            onClick={() => toggleDataType(dataType as DataTypeKey)}
          >
            {dataTypes[dataType].label}
          </button>
        ))}
      </div>
      <div
        id="chart-container"
        style={{ width: '100%', height: '600px' }}
      ></div>
    </div>
  );
}
