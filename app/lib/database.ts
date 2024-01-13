// app/lib/database.ts
'use server';

import { sql } from '@vercel/postgres';
import { Listing, Reservation } from './definitions';

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

export async function fetchListings() {
  const result = await sql`
    SELECT * FROM listings
  `;
  const data = result.rows as Listing[];
  return data;
}

export async function fetchListingsByDateRangeAndListings(
  startDate: string,
  endDate: string,
  selectedListings: number[]
) {
  const formattedListings = `{${selectedListings.join(',')}}`;

  const result = await sql`
    SELECT * FROM airbnb_2022
    WHERE payout_date >= ${startDate} 
      AND payout_date <= ${endDate} 
      AND listing_id = ANY(${formattedListings})
  `;
  const data = result.rows as Reservation[];
  return data;
}
