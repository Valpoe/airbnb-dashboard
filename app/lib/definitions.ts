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

export type MonthlyReportListingData = {
  Amount: string;
  Type: string;
  'Start date': string;
  'End date': string;
  'Service fee': string;
};

export type MonthlyReportSummary = {
  airbnbAmountVat10: string;
  airbnbAmount: string;
  commissionVat0: number;
  commissionVat24: number;
  customerAmount: number;
  reservationsAmount: number;
  occupiedNightsInMonth: number;
  occupancyRate: string;
  serviceFees: string;
  calculationMonth: number;
  calculationYear: number;
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

export type CalculatorType = 'apartmentRevenue' | 'calculator2' | 'calculator3';

export const calculatorTypes: Record<CalculatorType, string> = {
  apartmentRevenue: 'Apartment revenue',
  calculator2: 'Calculator 2',
  calculator3: 'Calculator 3'
};

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
