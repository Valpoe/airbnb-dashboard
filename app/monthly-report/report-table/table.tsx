import { formatDate } from '@/app/lib/utils';
import {
  EnvelopeIcon,
  GlobeAltIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import React from 'react';

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

  // Calculate the sum of host fee
  const sumHostFee = filteredData.reduce(
    (sum, row) => sum + (parseFloat(row['Service fee']) || 0),
    0
  );

  const commissionAmount = parseFloat((sumAmount * 0.4).toFixed(2));

  return (
    <div
      className="overflow-x-auto pt-5 pl-5 pr-5 bg-neutral-content"
      ref={contentRef}
    >
      <table
        className="table border border-neutral mb-5 text-neutral mx-auto"
        style={{ width: 'auto' }}
      >
        <caption className="p-5 text-xl font-semibold text-center text-neutral">
          Airbnb Report
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
      <div className="p-5 page-break">
        <div className="flex flex-col items-center">
          <table
            className="table border border-neutral mb-20 text-neutral"
            style={{ width: 'auto' }}
          >
            <caption className="p-5 text-xl font-semibold text-center text-neutral">
              Summary
            </caption>
            <thead className="text-neutral text-base">
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
        <div className="flex justify-center mt-auto mb-5 border-t-2 border-neutral pt-8">
          <div className="flex text-neutral">
            <EnvelopeIcon className="w-6 h-6 mr-2 mt-0.5" />
            <span className="mr-4 text-neutral text-xl">info@housti.fi</span>
          </div>
          <div className="flex text-neutral">
            <GlobeAltIcon className="w-6 h-6 mr-2 mt-0.5" />
            <span className="mr-4 text-neutral text-xl">www.housti.fi</span>
          </div>
          <div className="flex text-neutral">
            <PhoneIcon className="w-6 h-6 mr-2 mt-0.5" />
            <span className="text-neutral text-lg">+358 44 986 4928</span>
          </div>
        </div>
      </div>
    </div>
  );
}
