import React from 'react';

interface DataTableProps {
  data: any[];
  contentRef: React.RefObject<HTMLDivElement>;
}

const formatDate = (dateString: string) => {
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

  const columns = Object.keys(filteredData[0]);
  // Calculate the sum of values in the "Amount" column
  const sumAmount = filteredData.reduce(
    (sum, row) => sum + parseFloat(row.Amount),
    0
  );

  const commissionAmount = parseFloat((sumAmount * 0.4).toFixed(2));

  // Extract month from the first row's "Date" column
  const firstRowDate = new Date(filteredData[0].Date);

  return (
    <div className="overflow-x-auto" ref={contentRef}>
      <table className="table mb-5">
      <caption className="p-5 text-lg font-semibold text-left rtl:text-right">
          Airbnb Report
        </caption>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column === 'Date'
                    ? formatDate(row[column])
                    : String(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center">
      <table className="table" style={{ width: 'auto' }}>
      <caption className="p-5 text-lg font-semibold text-left rtl:text-right">
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
              {filteredData.filter((row) => row.Type === 'Reservation').length}
            </td>
          </tr>
          <tr>
            <td>Number of nights booked</td>
            <td>Amount</td>
            <td>
              {filteredData.reduce((sum, row) => sum + parseInt(row.Nights), 0)}
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default DataTable;
