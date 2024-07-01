import { formatDate } from '@/app/lib/utils';
import {
  EnvelopeIcon,
  GlobeAltIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import cn from 'classnames';
import React from 'react';
import styles from './styles.module.scss';

interface DataTableProps {
  data: any[];
  contentRef: React.RefObject<HTMLDivElement>;
}

export default function DataTable({ data, contentRef }: DataTableProps) {
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

  let sumAmount = filteredData.reduce(
    (sum, row) => sum + (parseFloat(row.Amount) || 0),
    0
  );

  // Calculate the sum of service fees
  const sumHostFee = filteredData.reduce(
    (sum, row) => sum + (parseFloat(row['Service fee']) || 0),
    0
  );

  const commissionAmount = parseFloat((sumAmount * 0.4).toFixed(2));

  return (
    <div className={styles.tableContainer} ref={contentRef}>
      <table className={cn('table', styles.table)}>
        <caption className={styles.tableTitle}>Airbnb Report</caption>
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
              <tr>
                <td>Airbnb amount (VAT 0%)</td>
                <td>EUR</td>
                <td>{sumAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Commission (VAT 0%)</td>
                <td>EUR</td>
                <td>{((sumAmount * 0.4) / 1.24).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Commission 40% (VAT 24%)</td>
                <td>EUR</td>
                <td>{(sumAmount * 0.4).toFixed(2)}</td>
              </tr>
              <tr>
                <td>The customer is paid</td>
                <td>EUR</td>
                <td>{(sumAmount - commissionAmount).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Number of reservations</td>
                <td>Amount</td>
                <td>
                  {
                    filteredData.filter((row) => row.Type === 'Reservation')
                      .length
                  }
                </td>
              </tr>
              <tr>
                <td>Number of nights booked</td>
                <td>Amount</td>
                <td>
                  {filteredData.reduce(
                    (sum, row) => sum + (parseInt(row.Nights) || 0),
                    0
                  )}
                </td>
              </tr>
              <tr>
                <td>Airbnb service fee</td>
                <td>EUR</td>
                <td>{sumHostFee.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.footerContainer}>
          <div className={styles.footerContent}>
            <EnvelopeIcon className={styles.footerIcon} />
            <span className={styles.footerText}>info@housti.fi</span>
          </div>
          <div className={styles.footerContent}>
            <GlobeAltIcon className={styles.footerIcon} />
            <span className={styles.footerText}>www.housti.fi</span>
          </div>
          <div className={styles.footerContent}>
            <PhoneIcon className={styles.footerIcon} />
            <span className={styles.footerText}>+358 44 986 4928</span>
          </div>
        </div>
      </div>
    </div>
  );
}
