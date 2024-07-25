import { fetchListings } from '@/app/lib/database';
import { Listing } from '@/app/lib/definitions';
import { calculateDaysInMonth, formatDate, parseDate } from '@/app/lib/utils';
import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';

interface DataTableProps {
  data: any[];
  contentRef: React.RefObject<HTMLDivElement>;
  vatChecked: boolean;
}

export default function DataTable({
  data,
  contentRef,
  vatChecked
}: DataTableProps) {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchAndSetListings = async () => {
      try {
        const fetchedListings = await fetchListings();
        setListings(fetchedListings);
      } catch (error) {
        console.error('Error fetching initial data: ', error);
      }
    };

    fetchAndSetListings();
  }, []);

  const filteredData = data.filter((row) => row.Type !== 'Payout');

  if (data.length === 0) {
    return <p>No data available</p>;
  }

  // Format dates in the 'Date' columns
  const formattedData = filteredData.map((row) => {
    const formattedRow = { ...row };

    for (const column in formattedRow) {
      if (column.toLowerCase().includes('date')) {
        const originalDate = formattedRow[column];
        const formattedDate = formatDate(originalDate);

        // Check if the formatted date is valid
        if (formattedDate !== 'Invalid Date') {
          formattedRow[column] = formattedDate;
        } else {
          formattedRow[column] = ''; // Convert invalid dates to empty strings
        }
      }

      // Check if any cell is null and convert it to an empty string
      if (formattedRow[column] === null) {
        formattedRow[column] = '';
      }
    }
    return formattedRow;
  });

  const columns = Object.keys(filteredData[0]);

  // Group data by listing
  const groupedData = formattedData.reduce((acc, row) => {
    if (!acc[row.Listing]) {
      acc[row.Listing] = [];
    }
    acc[row.Listing].push(row);
    return acc;
  }, {});

  // Helper function to calculate summary for each listing
  const calculateSummary = (listingData: any) => {
    // Calculate Airbnb amount VAT 10%
    const airbnbAmountVat10 = listingData
      .reduce((sum: any, row: any) => sum + (parseFloat(row.Amount) || 0), 0)
      .toFixed(2);

    // Calculate Airbnb amount considering VAT 10% if checked
    const airbnbAmount = vatChecked
      ? (parseFloat(airbnbAmountVat10) / 1.1).toFixed(2)
      : airbnbAmountVat10;

    // Calculate commission VAT 0%
    const commissionVat0 = parseFloat(((airbnbAmount * 0.4) / 1.24).toFixed(2));

    // Calculate commission VAT 24%
    const commissionVat24 = parseFloat((airbnbAmount * 0.4).toFixed(2));

    // Calculate commission amount
    const commissionAmount = parseFloat((airbnbAmount * 0.4).toFixed(2));

    // Calculate customer amount
    const customerAmount = parseFloat(
      (airbnbAmount - commissionAmount).toFixed(2)
    );

    // Calculate reservations amount
    const reservationsAmount = listingData.filter(
      (row: any) => row.Type === 'Reservation'
    ).length;

    // Get the month we're calculating for
    const firstReservationDate = parseDate(listingData[0]['Start date']);
    const calculationMonth = firstReservationDate.getMonth();
    const calculationYear = firstReservationDate.getFullYear();

    // Calculate total nights and occupancy for the month
    let occupiedNightsInMonth = 0;
    const monthStartDate = new Date(calculationYear, calculationMonth, 1);
    const monthEndDate = new Date(calculationYear, calculationMonth + 1, 0);
    listingData.forEach((row: any) => {
      if (row.Type === 'Reservation') {
        const startDate = parseDate(row['Start date']);
        const endDate = parseDate(row['End date']);

        // Adjust dates to be within the month
        const adjustedStartDate =
          startDate < monthStartDate ? monthStartDate : startDate;
        const adjustedEndDate = endDate > monthEndDate ? monthEndDate : endDate;

        if (
          adjustedEndDate > monthStartDate &&
          adjustedStartDate <= monthEndDate
        ) {
          let nights = Math.ceil(
            (adjustedEndDate.getTime() - adjustedStartDate.getTime()) /
              (1000 * 60 * 60 * 24)
          );

          // Include the night from the last day of previous month if applicable
          if (startDate < monthStartDate) {
            nights += 1;
          }

          occupiedNightsInMonth += nights;
        }
      }
    });

    const daysInMonth = calculateDaysInMonth(firstReservationDate);

    // Calculate occupancy rate
    const occupancyRate = ((occupiedNightsInMonth / daysInMonth) * 100).toFixed(
      2
    );

    // Calculate service fees
    const serviceFees = listingData
      .reduce(
        (sum: any, row: any) => sum + (parseFloat(row['Service fee']) || 0),
        0
      )
      .toFixed(2);

    return {
      airbnbAmountVat10,
      airbnbAmount,
      commissionVat0,
      commissionVat24,
      customerAmount,
      reservationsAmount,
      occupiedNightsInMonth,
      occupancyRate,
      serviceFees,
      calculationMonth,
      calculationYear
    };
  };

  const overallSummary = calculateSummary(formattedData);

  const summaries = Object.keys(groupedData).map((listingKey) => {
    const listingData = groupedData[listingKey];
    return {
      listing: listingKey,
      summary: calculateSummary(listingData)
    };
  });

  return (
    <div className={styles.tableContainer} ref={contentRef}>
      <table className={cn('table', styles.table)}>
        <caption className={styles.tableTitle}>
          {summaries.length === 1
            ? `${
                listings.find((l) => l.listing === summaries[0].listing)
                  ?.internal_name || ''
              }, ${summaries[0].summary.calculationMonth + 1}/${
                summaries[0].summary.calculationYear
              }`
            : `${overallSummary.calculationMonth + 1}/${
                overallSummary.calculationYear
              }`}
        </caption>
        <thead className="text-neutral text-base">
          <tr>
            {columns.map((column, columnIndex) => (
              <th key={columnIndex}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {formattedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>{String(row[column])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={cn('page-break', styles.pageBreak)}>
        <div className={styles.summaryContainer}>
          <table className={cn('table', styles.summaryTable)}>
            <caption className={styles.tableTitle}>Summary</caption>
            <thead className={styles.summaryTableHeaders}>
              <tr>
                <th>Event</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {vatChecked && (
                <tr>
                  <td>Airbnb amount (VAT 10%)</td>
                  <td>EUR</td>
                  <td>{overallSummary.airbnbAmountVat10}</td>
                </tr>
              )}
              <tr>
                <td>Airbnb amount (VAT 0%)</td>
                <td>EUR</td>
                <td>{overallSummary.airbnbAmount}</td>
              </tr>
              <tr>
                <td>Commission (VAT 0%)</td>
                <td>EUR</td>
                <td>{overallSummary.commissionVat0}</td>
              </tr>
              <tr>
                <td>Commission 40% (VAT 24%)</td>
                <td>EUR</td>
                <td>{overallSummary.commissionVat24}</td>
              </tr>
              <tr>
                <td>The customer is paid</td>
                <td>EUR</td>
                <td>{overallSummary.customerAmount}</td>
              </tr>
              <tr>
                <td>Airbnb service fee</td>
                <td>EUR</td>
                <td>{overallSummary.serviceFees}</td>
              </tr>
              <tr>
                <td>Number of reservations</td>
                <td>Amount</td>
                <td>{overallSummary.reservationsAmount}</td>
              </tr>
              <tr>
                <td>Number of nights booked</td>
                <td>Amount</td>
                <td>{overallSummary.occupiedNightsInMonth}</td>
              </tr>
              {summaries.length === 1 && (
                <tr>
                  <td>Occupancy rate</td>
                  <td>%</td>
                  <td>{overallSummary.occupancyRate}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {summaries.length > 1 && (
        <div>
          {summaries.map(({ listing, summary }, index) => (
            <div key={index} className={cn('page-break', styles.pageBreak)}>
              <div className={styles.summaryContainer}>
                <table className={cn('table', styles.summaryTable)}>
                  <caption className={styles.tableTitle}>
                    {listings.find((l) => l.listing === listing)?.internal_name}
                  </caption>
                  <thead className={styles.summaryTableHeaders}>
                    <tr>
                      <th>Event</th>
                      <th>Type</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vatChecked && (
                      <tr>
                        <td>Airbnb amount (VAT 10%)</td>
                        <td>EUR</td>
                        <td>{summary.airbnbAmountVat10}</td>
                      </tr>
                    )}
                    <tr>
                      <td>Airbnb amount (VAT 0%)</td>
                      <td>EUR</td>
                      <td>{summary.airbnbAmount}</td>
                    </tr>
                    <tr>
                      <td>Commission (VAT 0%)</td>
                      <td>EUR</td>
                      <td>{summary.commissionVat0}</td>
                    </tr>
                    <tr>
                      <td>Commission 40% (VAT 24%)</td>
                      <td>EUR</td>
                      <td>{summary.commissionVat24}</td>
                    </tr>
                    <tr>
                      <td>The customer is paid</td>
                      <td>EUR</td>
                      <td>{summary.customerAmount}</td>
                    </tr>
                    <tr>
                      <td>Airbnb service fee</td>
                      <td>EUR</td>
                      <td>{summary.serviceFees}</td>
                    </tr>
                    <tr>
                      <td>Number of reservations</td>
                      <td>Amount</td>
                      <td>{summary.reservationsAmount}</td>
                    </tr>
                    <tr>
                      <td>Number of nights booked</td>
                      <td>Amount</td>
                      <td>{summary.occupiedNightsInMonth}</td>
                    </tr>
                    <tr>
                      <td>Occupancy rate</td>
                      <td>%</td>
                      <td>{summary.occupancyRate}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
