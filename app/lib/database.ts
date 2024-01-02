// app/lib/database.ts
'use server'

import { sql } from '@vercel/postgres';
import { Reservation } from './definitions';

export async function fetchReservations_2022() {
  const result = await sql`
    SELECT * FROM airbnb_2022
  `;
  const data = result.rows as Reservation[];
  return data;
}

export async function fetchReservationsByDateRange(
  startDate: string,
  endDate: string
) {
  const result = await sql`
    SELECT * FROM airbnb_2022
    WHERE payout_date >= ${startDate} AND payout_date <= ${endDate}
  `;
  const data = result.rows as Reservation[];
  return data;
}
