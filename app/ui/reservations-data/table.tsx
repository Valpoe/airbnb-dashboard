import { Reservation } from '@/app/lib/definitions';
import { formatDate } from '@/app/lib/utils';
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
  DataGrid
} from '@arction/lcjs';
import { useEffect, useState, useRef } from 'react';
import { createDataGrid } from '../../components/create-chart';

interface ReservationsTableProps {
  reservations: Reservation[];
}

const columns = [
  'Date',
  'Type',
  // 'Booking date',
  'Nights',
  'Guest',
  'Listing',
  'Currency',
  'Amount',
  'Service fee',
  // 'Gross earnings',
  'Earnings year'
];

export default function ReservationsTable({
  reservations
}: ReservationsTableProps) {
  // const containerRef = useRef(null);
  // const chartRef = useRef<DataGrid | null>(null);
  const [chart, setChart] = useState<DataGrid | undefined>(undefined);

  useEffect(() => {
    const licenseKey = process.env.NEXT_PUBLIC_LC_KEY;
    if (licenseKey) {
      const lc = createDataGrid(licenseKey, 'chart-container');
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
    if (chart && reservations) {
      const headers = [
        'Date',
        'Event Type',
        'Nights',
        'Guest',
        'Listing',
        'Currency',
        'Amount',
        'Host Fee',
        'Earnings Year'
      ];

      const data = reservations.map((row) => [
        formatDate(row.payout_date),
        row.event_type,
        row.nights,
        row.guest,
        row.listing,
        row.currency,
        row.amount,
        row.host_fee,
        row.earnings_year
      ]);

      const tableData = [headers, ...data];
      chart.setTableContent(tableData);
    }
  }, [reservations, chart]);

  return (
    <div className="relative overflow-x-auto max-h-[680px] p-5">
      <div
        id="chart-container"
        style={{ width: '100%', height: '600px' }}
      ></div>
      <table className="table border border-neutral text-neutral">
        <thead className="text-neutral text-base">
          <tr>
            {columns.map((column, columnIndex) => (
              <th key={columnIndex}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody className="overflow-y-auto">
          {reservations.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{formatDate(row.payout_date)}</td>
              <td>{row.event_type}</td>
              {/* <td>{formatDate(row.booking_date)}</td> */}
              <td>{row.nights}</td>
              <td>{row.guest}</td>
              <td>{row.listing}</td>
              <td>{row.currency}</td>
              <td>{row.amount}</td>
              <td>{row.host_fee}</td>
              {/* <td>{row.gross_earnings}</td> */}
              <td>{row.earnings_year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
