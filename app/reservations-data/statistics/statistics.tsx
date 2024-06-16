import { Listing, Reservation } from '@/app/lib/definitions';
import { calculateAmountOfDays } from '@/app/lib/utils';
import cn from 'classnames';
import styles from './statistics.module.scss';

interface StatisticsProps {
  reservations: Reservation[];
  listings: Listing[];
  selectedListings: number[];
  dateRange: { startDate: string; endDate: string };
}

export default function Statistics({
  reservations,
  listings,
  selectedListings,
  dateRange
}: StatisticsProps) {
  const getTotalValuesForSelectedListings = () => {
    // Filter reservations based on selected listings
    const selectedReservations = reservations.filter((reservation) =>
      selectedListings.includes(reservation.listing_id)
    );

    const totalNights = selectedReservations.reduce(
      (acc, cur) => acc + cur.nights,
      0
    );

    const totalReservations = selectedReservations.filter(
      (row) => row.event_type === 'Reservation'
    ).length;

    const totalAmount = selectedReservations
      .reduce((acc, cur) => acc + cur.amount, 0)
      .toFixed(2);

    const totalGrossEarnings = selectedReservations
      .reduce((acc, cur) => acc + cur.gross_earnings, 0)
      .toFixed(2);

    const totalHostFee = selectedReservations
      .reduce((acc, cur) => acc + cur.host_fee, 0)
      .toFixed(2);

    const totalOccupancyRate = (
      ((totalNights /
        calculateAmountOfDays(dateRange.startDate, dateRange.endDate)) *
        100) /
      selectedListings.length
    ).toFixed(2);

    return {
      totalNights,
      totalReservations,
      totalAmount,
      totalGrossEarnings,
      totalHostFee,
      totalOccupancyRate
    };
  };

  const getStatisticsForSelectedListings = () => {
    return selectedListings.map((selectedListingId) => {
      const listingReservations = reservations.filter(
        (reservation) => reservation.listing_id === selectedListingId
      );

      const totalNights = listingReservations.reduce(
        (acc, cur) => acc + cur.nights,
        0
      );

      const totalReservations = listingReservations.filter(
        (row) => row.event_type === 'Reservation'
      ).length;

      const totalAmount = listingReservations
        .reduce((acc, cur) => acc + cur.amount, 0)
        .toFixed(2);

      const totalGrossEarnings = listingReservations
        .reduce((acc, cur) => acc + cur.gross_earnings, 0)
        .toFixed(2);

      const totalHostFee = listingReservations
        .reduce((acc, cur) => acc + cur.host_fee, 0)
        .toFixed(2);

      const occupancyRate = (
        (totalNights /
          calculateAmountOfDays(dateRange.startDate, dateRange.endDate)) *
        100
      ).toFixed(2);

      return {
        listingId: selectedListingId,
        internalName: listings.find(
          (listing) => listing.id === selectedListingId
        )?.internal_name,
        totalNights,
        totalReservations,
        totalAmount,
        totalGrossEarnings,
        totalHostFee,
        occupancyRate
      };
    });
  };

  const totalValues = getTotalValuesForSelectedListings();
  const listingStatistics = getStatisticsForSelectedListings();

  return (
    <div className={styles.mainContainer}>
      {/* Total Values Row */}
      <span
        className={cn(
          'badge',
          'badge-lg',
          'badge-primary',
          styles.statisticTitle
        )}
      >
        Total
      </span>
      <div className={cn('stats', styles.contentContainer)}>
        <div className="stat">
          <div className="stat-title">Total Nights</div>
          <div className="stat-value">{totalValues.totalNights}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Reservations</div>
          <div className="stat-value">{totalValues.totalReservations}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Occupancy Rate</div>
          <div className="stat-value">{totalValues.totalOccupancyRate}%</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Amount</div>
          <div className="stat-value">{totalValues.totalAmount}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Gross Earnings</div>
          <div className="stat-value">{totalValues.totalGrossEarnings}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Host Fee</div>
          <div className="stat-value">{totalValues.totalHostFee}</div>
        </div>
      </div>

      {/* Listing Statistics Rows */}
      {listingStatistics.map((listingStat) => (
        <div key={listingStat.listingId}>
          <span
            className={cn(
              'badge',
              'badge-lg',
              'badge-primary',
              styles.statisticTitle
            )}
          >
            {listingStat.internalName}
          </span>
          <div className={cn('stats', styles.contentContainer)}>
            <div className="stat">
              <div className="stat-title">Nights</div>
              <div className="stat-value">{listingStat.totalNights}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Reservations</div>
              <div className="stat-value">{listingStat.totalReservations}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Occupancy Rate</div>
              <div className="stat-value">{listingStat.occupancyRate}%</div>
            </div>
            <div className="stat">
              <div className="stat-title">Amount</div>
              <div className="stat-value">{listingStat.totalAmount}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Gross Earnings</div>
              <div className="stat-value">{listingStat.totalGrossEarnings}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Host Fee</div>
              <div className="stat-value">{listingStat.totalHostFee}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
