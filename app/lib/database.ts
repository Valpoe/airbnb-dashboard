// app/lib/database.ts
import { sql, QueryResultRow } from '@vercel/postgres';
import { Reservation } from './definitions';

export async function getReservations(): Promise<Reservation[]> {
  const result = await sql`
    SELECT * FROM airbnb_2022
  `;

  // Convert each row to the Reservation type
  const reservations: Reservation[] = result.rows.map((row: QueryResultRow) => {
    return {
      payout_date: row.payout_date,
      event_type: row.event_type,
      booking_date: row.booking_date,
      nights: row.nights,
      guest: row.guest,
      listing: row.listing,
      currency: row.currency,
      amount: row.amount,
      host_fee: row.host_fee,
      cleaning_fee: row.cleaning_fee,
      gross_earnings: row.gross_earnings,
      earnings_year: row.earnings_year,
    };
  });
  
  return reservations;
}
