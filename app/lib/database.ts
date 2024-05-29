'use server';

import { sql } from '@vercel/postgres';
import { Listing, Reservation } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchAllReservations() {
  try {
    const result = await sql<Reservation>`
    SELECT * FROM airbnb_data
    ORDER BY payout_date DESC
  `;
    const data = result.rows;
    return data;
  } catch (error) {
    console.log('Database error: ', error);
    throw new Error('Error fetching reservations');
  }
}

export async function slowFetch() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
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

export async function fetchReservationsByDateRange(
  startDate: string,
  endDate: string
) {
  try {
    const result = await sql<Reservation>`
    SELECT * FROM airbnb_data
    WHERE payout_date >= ${startDate} AND payout_date <= ${endDate}
  `;
    const data = result.rows;
    return data;
  } catch (error) {
    console.log('Database error: ', error);
    throw new Error('Error fetching reservations');
  }
}

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

export async function fetchListingsByDateRangeAndListings(
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
