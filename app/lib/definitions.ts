export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
};

export type Reservation = {
  payout_date: Date;
  event_type: string;
  booking_date: Date;
  nights: number;
  guest: string;
  listing: string;
  currency: string;
  amount: number;
  host_fee: number;
  gross_earnings: number;
  earnings_year: number;
  listing_id: number;
};

export type Listing = {
  id: number;
  listing: string;
  internal_name: string;
};

type DataType = {
  label: string;
  property: keyof Reservation;
};

export const dataTypes: Record<string, DataType> = {
  amount: {
    label: 'Amount',
    property: 'amount'
  },
  nights: {
    label: 'Nights',
    property: 'nights'
  },
  reservations: {
    label: 'Reservations',
    property: 'event_type'
  },
  occupancy_rate: {
    label: 'Occupancy Rate',
    property: 'nights'
  }
};

export type DataTypeKey = keyof typeof dataTypes;

export const monthlyReportColumns = [
  'Type',
  'Start date',
  'End date',
  'Nights',
  'Guest',
  'Listing',
  'Amount',
  'Service fee'
];

export const reservationsTableColumns = [
  'Payout date',
  'Event type',
  'Nights',
  'Guest',
  'Listing',
  'Currency',
  'Amount',
  'Service fee',
  'Earnings year'
];
