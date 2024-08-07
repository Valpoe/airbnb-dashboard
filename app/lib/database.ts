'use server';

import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { Listing, Reservation } from './definitions';

export async function fetchListings() {
  noStore();
  try {
    const result = await sql<Listing>`
    SELECT * FROM listings
  `;
    const data = result.rows;
    return data;
  } catch (error) {
    console.log('Database error: ', error);
    throw new Error('Error fetching listings');
  }
}

export async function fetchListingsByDateRange(
  startDate: string,
  endDate: string
) {
  noStore();
  try {
    const result = await sql<Listing>`
      SELECT * FROM listings
      WHERE id IN (
        SELECT DISTINCT listing_id FROM airbnb_data
        WHERE payout_date >= ${startDate}
          AND payout_date <= ${endDate}
      )
    `;
    const data = result.rows;
    return data;
  } catch (error) {
    console.log('Database error: ', error);
    throw new Error('Error fetching listings');
  }
}

export async function fetchReservationsByDateRangeAndListings(
  startDate: string,
  endDate: string,
  selectedListings: number[]
) {
  try {
    const formattedListings = `{${selectedListings.join(',')}}`;

    const result = await sql<Reservation>`
    SELECT * FROM airbnb_data
    WHERE payout_date >= ${startDate} 
      AND payout_date <= ${endDate} 
      AND listing_id = ANY(${formattedListings})
    ORDER BY payout_date DESC
  `;
    const data = result.rows;
    return data;
  } catch (error) {
    console.log('Database error: ', error);
    throw new Error('Error fetching reservations');
  }
}
