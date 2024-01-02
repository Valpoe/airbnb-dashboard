import React from 'react';

interface DataTableProps {
  data: any[];
  contentRef: React.RefObject<HTMLDivElement>;
}

const formatDate = (dateString: string) => {
  if (!dateString) return dateString;

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const DataTable: React.FC<DataTableProps> = ({ data, contentRef }) => {
  const filteredData = data.filter((row) => row.Type !== 'Payout');

  if (data.length === 0) {
    return <p>No data available</p>;
  }

  // Format dates in the 'Date' columns
  const formattedData = filteredData.map((row) => {
    const formattedRow = { ...row };

    for (const column in formattedRow) {
      if (column.toLowerCase().includes('date')) {
        formattedRow[column] = formatDate(formattedRow[column]);
      }

      // Check if any cell is null and convert it to an empty string
      if (formattedRow[column] === null) {
        formattedRow[column] = '';
      }
    }

    return formattedRow;
  });

  const columns = Object.keys(filteredData[0]);
  // Calculate the sum of values in the "Amount" column
  const sumAmount = filteredData.reduce(
    (sum, row) => sum + (parseFloat(row.Amount) || 0),
    0
  );

  // Calculate the sum of host fee
  const sumHostFee = filteredData.reduce(
    (sum, row) => sum + (parseFloat(row['Host Fee']) || 0),
    0
  );

  const commissionAmount = parseFloat((sumAmount * 0.4).toFixed(2));

  return (
    <div className="overflow-x-auto pt-5 pl-5 pr-5 bg-neutral" ref={contentRef}>
      <table className="table mb-5" style={{ width: 'auto' }}>
        <caption className="p-5 text-lg font-semibold text-center">
          Airbnb Report
        </caption>
        <thead>
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
          <table className="table mb-20" style={{ width: 'auto' }}>
            <caption className="p-5 text-lg font-semibold text-center">
              Summary
            </caption>
            <thead>
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
                <td>Airbnb host fee</td>
                <td>EUR</td>
                <td>{sumHostFee.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-auto mb-5">
          <div className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
            <span className="mr-4">info@housti.fi</span>
          </div>
          <div className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
            <span className="mr-4">www.housti.fi</span>
          </div>
          <div className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
              />
            </svg>
            <span>+358 44 986 4928</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
