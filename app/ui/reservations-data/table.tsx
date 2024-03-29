import { Reservation } from '@/app/lib/definitions';
import { formatDate } from '@/app/lib/utils';

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
  'Host fee',
  // 'Gross earnings',
  'Earnings year'
];

export default function ReservationsTable({
  reservations
}: ReservationsTableProps) {
  return (
    <div className="relative overflow-x-auto max-h-[680px] p-5 bg-neutral-content">
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
