import { Reservation, reservationsTableColumns } from '@/app/lib/definitions';
import { formatDate } from '@/app/lib/utils';
import cn from 'classnames';
import styles from './table.module.scss';

interface ReservationsTableProps {
  reservations: Reservation[];
}

export default function ReservationsTable({
  reservations
}: ReservationsTableProps) {
  return (
    <div className={styles.mainContainer}>
      <table className={cn('table', styles.table)}>
        <thead className={styles.tableHeader}>
          <tr>
            {reservationsTableColumns.map((column, columnIndex) => (
              <th key={columnIndex}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {reservations.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{formatDate(row.payout_date)}</td>
              <td>{row.event_type}</td>
              <td>{row.nights}</td>
              <td>{row.guest}</td>
              <td>{row.listing}</td>
              <td>{row.currency}</td>
              <td>{row.amount}</td>
              <td>{row.host_fee}</td>
              <td>{row.earnings_year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
