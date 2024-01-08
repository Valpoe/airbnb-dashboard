import dayjs from 'dayjs';
import { Reservation } from '../lib/definitions';

interface ReservationsTableProps {
  reservations: Reservation[];
}

const formatDate = (date: Date) => dayjs(date).format('DD/MM/YYYY');

const columns = [
  'Date',
  'Type',
  // 'Booking date',
  'Nights',
  'Guest',
  'Listing',
  'Currency',
  'Amount',
  // 'Host fee',
  // 'Cleaning fee',
  // 'Gross earnings',
  'Earnings year'
];

const ReservationsTable: React.FC<ReservationsTableProps> = ({
  reservations
}) => {
  return (
    <div className="relative overflow-x-auto p-5 bg-neutral-content">
      <table
        className="table border border-neutral text-neutral mb-5 overflow-y-auto max-h-600px"
        style={{ width: 'auto' }}
      >
        <thead className="text-neutral text-base">
          <tr>
            {columns.map((column, columnIndex) => (
              <th key={columnIndex}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
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
              {/* <td>{row.host_fee}</td>
              <td>{row.cleaning_fee}</td>
              <td>{row.gross_earnings}</td> */}
              <td>{row.earnings_year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationsTable;
