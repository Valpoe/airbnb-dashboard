import { Reservation } from '../lib/definitions';
import { format } from 'date-fns';

interface ReservationsTableProps {
    reservations: Reservation[];
  }

const formatDate = (date: Date) => format(date, 'dd.MM.yyyy');

const columns = [
    'Date',
    'Type',
    'Booking date',
    'Nights',
    'Guest',
    'Listing',
    'Currency',
    'Amount',
    'Host fee',
    'Cleaning fee',
    'Gross earnings',
    'Earnings year'
  ];

const ReservationsTable: React.FC<ReservationsTableProps> = ({ reservations }) => {
    return (
        <div className='relative overflox-x-auto bg-neutral'>
        <table className="table mb-5 overflox-y-auto max-h-600px">
          <thead>
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
                <td>{formatDate(row.booking_date)}</td>
                <td>{row.nights}</td>
                <td>{row.guest}</td>
                <td>{row.listing}</td>
                <td>{row.currency}</td>
                <td>{row.amount}</td>
                <td>{row.host_fee}</td>
                <td>{row.cleaning_fee}</td>
                <td>{row.gross_earnings}</td>
                <td>{row.earnings_year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
}

export default ReservationsTable;
