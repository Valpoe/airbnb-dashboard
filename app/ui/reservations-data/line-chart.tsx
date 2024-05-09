import {
  DataTypeKey,
  Listing,
  Reservation,
  dataTypes
} from '@/app/lib/definitions';
import { calculateAmountOfDays, getRandomColor } from '@/app/lib/utils';
import 'chart.js/auto';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import dayjs from 'dayjs';
import { useState, useEffect, useRef } from 'react';
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
  Themes
} from '@arction/lcjs';
import { Line } from 'react-chartjs-2';
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

  useEffect(() => {
    const licenseKey = process.env.NEXT_PUBLIC_LC_KEY;

    if (licenseKey) {
      const lc = createChart(licenseKey, 'chart-container');
      lc.getDefaultAxisX()
        .setTickStrategy(AxisTickStrategies.DateTime)
        .setTitle('Title X')
        .setInterval({
          start: new Date(2022, 0, 1).getTime(),
          end: new Date(2022, 0, 31).getTime()
        });
      lc.getDefaultAxisY().setTitle('Title Y');
      lc.setTitle('Title Chart');
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

  const diesel = [
    { x: new Date(2022, 0, 1).getTime(), y: 1.52 },
    { x: new Date(2022, 0, 2).getTime(), y: 1.52 },
    { x: new Date(2022, 0, 3).getTime(), y: 1.58 },
    { x: new Date(2022, 0, 4).getTime(), y: 1.52 },
    { x: new Date(2022, 0, 5).getTime(), y: 2.0 },
    { x: new Date(2022, 0, 6).getTime(), y: 2.0 },
    { x: new Date(2022, 0, 7).getTime(), y: 2.0 },
    { x: new Date(2022, 0, 8).getTime(), y: 2.0 },
    { x: new Date(2022, 0, 9).getTime(), y: 2.26 },
    { x: new Date(2022, 0, 10).getTime(), y: 1.9 },
    { x: new Date(2022, 0, 11).getTime(), y: 1.9 },
    { x: new Date(2022, 0, 12).getTime(), y: 1.9 },
    { x: new Date(2022, 0, 13).getTime(), y: 1.9 },
    { x: new Date(2022, 0, 14).getTime(), y: 1.6 },
    { x: new Date(2022, 0, 15).getTime(), y: 1.6 },
    { x: new Date(2022, 0, 16).getTime(), y: 1.6 },
    { x: new Date(2022, 0, 17).getTime(), y: 1.0 },
    { x: new Date(2022, 0, 18).getTime(), y: 1.0 },
    { x: new Date(2022, 0, 19).getTime(), y: 1.0 },
    { x: new Date(2022, 0, 20).getTime(), y: 1.74 },
    { x: new Date(2022, 0, 21).getTime(), y: 1.47 },
    { x: new Date(2022, 0, 22).getTime(), y: 1.47 },
    { x: new Date(2022, 0, 23).getTime(), y: 1.47 },
    { x: new Date(2022, 0, 24).getTime(), y: 1.74 },
    { x: new Date(2022, 0, 25).getTime(), y: 1.74 },
    { x: new Date(2022, 0, 26).getTime(), y: 1.74 },
    { x: new Date(2022, 0, 27).getTime(), y: 1.5 },
    { x: new Date(2022, 0, 28).getTime(), y: 1.5 },
    { x: new Date(2022, 0, 29).getTime(), y: 1.5 }
  ];

  const lineSeries = chart?.addLineSeries().setName('Diesel');
  lineSeries?.add(diesel);

  chart
    ?.getDefaultAxisY()
    .setTitle('$/litre')
    .setInterval({ start: 0, end: 3, stopAxisAfter: true });

  // Enable AutoCursor auto-fill.
  chart?.setAutoCursor((cursor) =>
    cursor
      .setResultTableAutoTextStyle(true)
      .setTickMarkerXVisible(false)
      .setTickMarkerYAutoTextStyle(true)
  );

  // if (chart) {
  //   const series = chart.addLineSeries({
  //     dataPattern: { pattern: 'ProgressiveX' }
  //   });
  //   series.add([
  //     { x: 0, y: 0 },
  //     { x: 1, y: 1 },
  //     { x: 2, y: 2 },
  //     { x: 3, y: 3 },
  //     { x: 4, y: 4 }
  //   ]);
  // }

  console.log('Chart', chart);

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
        let totalValue;

        if (dataTypes[selectedDataType].label === 'Reservations') {
          // For 'Reservations' type, calculate the count of rows
          totalValue = 1;
        } else if (dataTypes[selectedDataType].label === 'Occupancy Rate') {
          // For 'Occupancy Rate' type, calculate the occupancy rate
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
    pointStyle: false,
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
