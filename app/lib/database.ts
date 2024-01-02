// app/lib/database.ts
import { sql } from '@vercel/postgres';
import { Reservation } from './definitions';

export async function fetchReservations_2022() {
  const result = await sql`
    SELECT * FROM airbnb_2022
  `;
  const data = result.rows as Reservation[];
  return data;
}
