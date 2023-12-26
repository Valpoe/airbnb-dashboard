// components/DataTable.tsx
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Title,
  Card
} from '@tremor/react';
interface DataTableProps {
  data: any[];
}
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const DataTable: React.FC<DataTableProps> = ({ data }) => {
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
    <div>
      <Title className="mt-5" style={{ color: 'black' }}>
        Airbnb Report
      </Title>
      <Table className="mt-5" style={{ width: 'auto' }}>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {column === 'Date'
                    ? formatDate(row[column])
                    : String(row[column])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Title className="mt-5" style={{ color: 'black' }}>
        Summary
      </Title>
      <Table className="mt-5" style={{ width: 'auto' }}>
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Currency</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Airbnb amount (VAT 0%)</TableCell>
            <TableCell>EUR</TableCell>
            <TableCell>{sumAmount.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Commission (VAT 0%)</TableCell>
            <TableCell>EUR</TableCell>
            <TableCell>{((sumAmount * 0.4) / 1.24).toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Commission 40% (VAT 24%)</TableCell>
            <TableCell>EUR</TableCell>
            <TableCell>{(sumAmount * 0.4).toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>The customer is paid</TableCell>
            <TableCell>EUR</TableCell>
            <TableCell>{(sumAmount - commissionAmount).toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Number of reservations</TableCell>
            <TableCell>EUR</TableCell>
            <TableCell>
              {filteredData.filter((row) => row.Type === 'Reservation').length}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Number of nights booked</TableCell>
            <TableCell>EUR</TableCell>
            <TableCell>
              {filteredData.reduce((sum, row) => sum + parseInt(row.Nights), 0)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
