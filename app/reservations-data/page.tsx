import { getReservations } from '../lib/database';
import ReservationsTable from './reservationsTable';

export default async function ReservationsData() {
  const reservations = await getReservations();
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div>
      <h1 className="text-xl mb-5">Hello from reservations data</h1>
      <ReservationsTable reservations={reservations} />
      </div>
    </main>
  )
}


