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
  Themes
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
  const [chartData, setChartData] = useState<any>(undefined);
  console.log('ChartData', chartData);
  const [selectedDataType, setSelectedDataType] =
    useState<DataTypeKey>('amount');

  const toggleDataType = (dataType: DataTypeKey) => {
    setSelectedDataType(dataType);
  };

  useEffect(() => {
    const licenseKey = process.env.NEXT_PUBLIC_LC_KEY;

    if (licenseKey) {
      const lc = createChart(licenseKey, 'chart-container');
      lc.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime);
      lc.setTitle('');
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
    const getStatisticsForSelectedListings = () => {
      const datasets = selectedListings.map((selectedListingId) => {
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
            y: cumulativeAmount
          };
        });

        return data;
      });

      setChartData(datasets.flat());
    };

    getStatisticsForSelectedListings();
  }, [reservations, listings, selectedListings, dateRange, selectedDataType]);

  useEffect(() => {
    if (chart && chartData) {
      chart.getSeries().forEach((series) => series.dispose());
      chart.getDefaultAxisY().setTitle(dataTypes[selectedDataType].label);

      const startMillis = new Date(dateRange.startDate).getTime();
      const endMillis = new Date(dateRange.endDate).getTime();
      chart
        .getDefaultAxisX()
        .setTitle('Date Range')
        .setInterval({ start: startMillis, end: endMillis });

      const lineSeries = chart
        .addLineSeries({ dataPattern: { pattern: 'ProgressiveX' } })
        .setStrokeStyle((strokeStyle) => strokeStyle.setThickness(2));

      lineSeries.add(chartData);
    }
  }, [chart, chartData]);

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
