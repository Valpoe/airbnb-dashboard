import {
  DataTypeKey,
  Listing,
  Reservation,
  dataTypes
} from '@/app/lib/definitions';
import { calculateAmountOfDays, getRandomColor } from '@/app/lib/utils';
import 'chart.js/auto';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import { useState, useEffect } from 'react';
import {
  UIBackground,
  ChartXY,
  AxisTickStrategies,
  DashedLine,
  SolidFill,
  ColorRGBA,
  SolidLine,
  ColorHEX,
  emptyLine,
  lightningChart,
  Themes,
  FontSettings,
  emptyTick,
  Axis,
  AxisScrollStrategies,
  LegendBoxBuilders,
  UIOrigins,
  UIDraggingModes,
  LegendBox,
  Point
} from '@arction/lcjs';
import { createChart } from '@/app/components/create-chart';

export default function LineChart({
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
  const [chart, setChart] = useState<ChartXY<UIBackground> | undefined>(
    undefined
  );
  const [legendBox, setLegendBox] = useState<LegendBox | undefined>(undefined);
  const [selectedDataType, setSelectedDataType] =
    useState<DataTypeKey>('amount');

  const toggleDataType = (dataType: DataTypeKey) => {
    setSelectedDataType(dataType);
  };

  const generateChartData = () => {
    return selectedListings.flatMap((selectedListingId) => {
      const listingReservations = reservations
        .filter((reservation) => reservation.listing_id === selectedListingId)
        .sort(
          (a, b) =>
            new Date(a.payout_date).getTime() -
            new Date(b.payout_date).getTime()
        );

      let cumulativeAmount = 0;
      return listingReservations.map((reservation) => {
        let totalValue;
        if (dataTypes[selectedDataType].label === 'Reservations') {
          totalValue = 1;
        } else if (dataTypes[selectedDataType].label === 'Occupancy Rate') {
          const totalNights = reservation.nights;
          totalValue =
            (totalNights /
              calculateAmountOfDays(dateRange.startDate, dateRange.endDate)) *
            100;
        } else {
          totalValue = reservation[dataTypes[selectedDataType].property];
        }
        cumulativeAmount += typeof totalValue === 'number' ? totalValue : 0;
        return {
          x: new Date(reservation.payout_date).getTime(),
          y: cumulativeAmount,
          listing_id: reservation.listing_id
        };
      });
    });
  };

  useEffect(() => {
    const licenseKey = process.env.NEXT_PUBLIC_LC_KEY;

    if (licenseKey) {
      const lc = createChart(licenseKey, 'chart-container');
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
      lc.addLegendBox(LegendBoxBuilders.VerticalLegendBox)
        .setPosition({ x: 100, y: 100 })
        .setMargin(1)
        .setTitle('Listings')
        .setOrigin(UIOrigins.LeftTop)
        .setDraggingMode(UIDraggingModes.draggable)
        .setBackground((background) =>
          background.setFillStyle(lc.getTheme().uiBackgroundFillStyle)
        )
        .setAutoDispose({ type: 'max-height', maxHeight: 0.5 });

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
    const generateChartData = () => {
      return selectedListings.flatMap((selectedListingId) => {
        const listingReservations = reservations
          .filter((reservation) => reservation.listing_id === selectedListingId)
          .sort(
            (a, b) =>
              new Date(a.payout_date).getTime() -
              new Date(b.payout_date).getTime()
          );

        let cumulativeAmount = 0;
        return listingReservations.map((reservation) => {
          let totalValue;
          if (dataTypes[selectedDataType].label === 'Reservations') {
            totalValue = 1;
          } else if (dataTypes[selectedDataType].label === 'Occupancy Rate') {
            const totalNights = reservation.nights;
            totalValue =
              (totalNights /
                calculateAmountOfDays(dateRange.startDate, dateRange.endDate)) *
              100;
          } else {
            totalValue = reservation[dataTypes[selectedDataType].property];
          }
          cumulativeAmount += typeof totalValue === 'number' ? totalValue : 0;
          return {
            x: new Date(reservation.payout_date).getTime(),
            y: cumulativeAmount,
            listing_id: reservation.listing_id
          };
        });
      });
    };

    const dataSets = generateChartData();

    if (chart) {
      // Clear existing series and legend boxes
      chart.getSeries().forEach((series) => series.dispose());
      chart.getLegendBoxes().forEach((legendBox) => legendBox.dispose());

      // Set axis title and interval
      chart.getDefaultAxisY().setTitle(dataTypes[selectedDataType].label);
      const startMillis = new Date(dateRange.startDate).getTime();
      const endMillis = new Date(dateRange.endDate).getTime();
      chart
        .getDefaultAxisX()
        .setInterval({ start: startMillis, end: endMillis });

      // Define the type for the grouped data
      const groupedData = dataSets.reduce(
        (acc, curr) => {
          const listing_id = curr.listing_id;

          if (!acc[listing_id]) {
            acc[listing_id] = [];
          }

          acc[listing_id].push({ x: curr.x, y: curr.y });
          return acc;
        },
        {} as { [key: number]: { x: number; y: number }[] }
      );

      // Create a single legend box
      const legendBox = chart
        .addLegendBox(LegendBoxBuilders.VerticalLegendBox)
        .setPosition({ x: 100, y: 100 })
        .setMargin(1)
        .setTitle('Listings')
        .setOrigin(UIOrigins.LeftTop)
        .setDraggingMode(UIDraggingModes.draggable)
        .setBackground((background) =>
          background.setFillStyle(chart.getTheme().uiBackgroundFillStyle)
        )
        .setAutoDispose({ type: 'max-height', maxHeight: 0.5 });

      // Create a line series for each listing and add it to the legend box
      Object.entries(groupedData).forEach(([listing_id, data]) => {
        const lineSeries = chart.addLineSeries({
          dataPattern: { pattern: 'ProgressiveX' }
        });

        lineSeries.add(data);

        const listing = listings.find((l) => l.id === parseInt(listing_id));
        const internal_name = listing?.internal_name || '';

        // Add a separate entry for each line series
        legendBox.add(lineSeries).setEntries((e) => e.setText(internal_name));
      });
    }
  }, [
    chart,
    listings,
    reservations,
    dateRange,
    selectedDataType,
    selectedListings
  ]);

  return (
    <div className="flex flex-wrap justify-center">
      <div className="grid grid-cols-2 md:grid-cols-1 md:flex md:flex-row gap-3 mb-5">
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
      <div
        id="chart-container"
        style={{ width: '100%', height: '600px' }}
      ></div>
      {/* <Line options={options} data={data} /> */}
    </div>
  );
}
