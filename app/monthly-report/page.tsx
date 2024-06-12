'use client';
import styles from './monthly-report.module.scss';
import FileUploadButton from '@/app/ui/monthly-report/file-upload-button';
import '@/app/ui/monthly-report/print-table.css';
import DataTable from '@/app/ui/monthly-report/table';
import { useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { monthlyReportColumns } from '@/app/lib/definitions';
import cn from 'classnames';

export default function MonthlyReport() {
  const [csvData, setCsvData] = useState<any[]>([]);
  const contentRef = useRef(null);
  const [resolutionPayoutChecked, setResolutionPayoutChecked] = useState(false);
  const [resolutionPayoutAmount, setResolutionPayoutAmount] = useState(0);
  const [resolutionPayoutDescription, setResolutionPayoutDescription] =
    useState('');

  const handleDataUpload = (data: any[]) => {
    setCsvData(data);
  };

  const handleResolutionPayoutChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setResolutionPayoutChecked(e.target.checked);
  };

  const handleResolutionPayoutAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setResolutionPayoutAmount(parseFloat(e.target.value) || 0);
  };

  const handleResolutionPayoutDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setResolutionPayoutDescription(e.target.value);
  };

  const handleAddResolutionPayout = () => {
    const newResolutionPayout = {
      Date: new Date().toISOString(),
      Type: 'Resolution Payout',
      Nights: '',
      Guest: 'Selite',
      Listing: resolutionPayoutDescription,
      Currency: 'EUR',
      Amount: resolutionPayoutAmount,
      'Service fee': ''
    };

    setCsvData((prevData) => [...prevData, newResolutionPayout]);

    // Reset the resolution payout amount and checkbox
    setResolutionPayoutAmount(0);
    setResolutionPayoutChecked(false);
    setResolutionPayoutDescription('');
  };

  return (
    <main className={styles.mainContainer}>
      <div>
        <h1 className={styles.headerText}>
          Upload Airbnb csv file with fields:
        </h1>
        <ul className={styles.columnBadges}>
          {monthlyReportColumns.map((column, index) => (
            <li key={index}>
              <span className="badge badge-lg badge-primary">{column}</span>
            </li>
          ))}
        </ul>
        <div className={styles.inputContainer}>
          <FileUploadButton onDataUpload={handleDataUpload} />
          {csvData.length > 0 && (
            <>
              <ReactToPrint
                trigger={() => (
                  <button className={cn('btn', styles.downloadButton)}>
                    Download
                  </button>
                )}
                content={() => contentRef.current}
                documentTitle="Airbnb Report"
              />
              <div className="flex">
                <label className="label cursor-pointer mb-5 mr-5">
                  <span className="label-text mr-2">Resolution Payout</span>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={resolutionPayoutChecked}
                    onChange={handleResolutionPayoutChange}
                  />
                </label>
                {resolutionPayoutChecked && (
                  <>
                    <input
                      type="number"
                      placeholder="Amount"
                      className="input input-bordered input-primary w-24 max-w-xs mr-5"
                      value={resolutionPayoutAmount}
                      onChange={handleResolutionPayoutAmountChange}
                    />
                    <input
                      type="text"
                      placeholder="Selite"
                      className="input input-bordered input-primary max-w-xs mr-5"
                      value={resolutionPayoutDescription}
                      onChange={handleResolutionPayoutDescriptionChange}
                    />
                    <button
                      className="btn mb-5 bg-neutral hover:text-accent mr-5 hover:bg-neutral"
                      onClick={handleAddResolutionPayout}
                    >
                      Add
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        {csvData.length > 0 && (
          <DataTable data={csvData} contentRef={contentRef} />
        )}
      </div>
    </main>
  );
}
