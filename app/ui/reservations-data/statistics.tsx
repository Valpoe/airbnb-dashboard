import { Reservation } from '@/app/lib/definitions';

interface ReservationsTableProps {
  reservations: Reservation[];
}

export default function Statistics({ reservations }: ReservationsTableProps) {
  const totalNights = reservations.reduce((acc, cur) => acc + cur.nights, 0);
  const totalReservations = reservations.filter(
    (row) => row.event_type === 'Reservation'
  );
  const totalAmount = reservations
    .reduce((acc, cur) => acc + cur.amount, 0)
    .toFixed(2);
  const totalGrossEarnings = reservations
    .reduce((acc, cur) => acc + cur.gross_earnings, 0)
    .toFixed(2);
  const totalHostFee = reservations
    .reduce((acc, cur) => acc + cur.host_fee, 0)
    .toFixed(2);
  const totalCleaningFee = reservations
    .reduce((acc, cur) => acc + cur.cleaning_fee, 0)
    .toFixed(2);
  return (
    <div className="flex justify-center">
      <div className="stats stats-vertical lg:stats-horizontal shadow">
        <div className="stat">
          <div className="stat-title">Nights</div>
          <div className="stat-value">{totalNights}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Reservations</div>
          <div className="stat-value">{totalReservations.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Amount</div>
          <div className="stat-value">{totalAmount}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Gross Earnings</div>
          <div className="stat-value">{totalGrossEarnings}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Host Fee</div>
          <div className="stat-value">{totalHostFee}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Cleaning Fee</div>
          <div className="stat-value">{totalCleaningFee}</div>
        </div>
      </div>
    </div>
  );
}
