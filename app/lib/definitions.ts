
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
    cleaning_fee: number;
    gross_earnings: number;
    earnings_year: number;
  };
  
  export type Listing = {
    id: number;
    listing: string;
    internal_name: string;
  }