'use client';
import { monthlyReportColumns } from '@/app/lib/definitions';
import FileUploadButton from '@/app/monthly-report/report-table/file-upload-button';
import DataTable from '@/app/monthly-report/report-table/table';
import '@/app/monthly-report/report-table/table.css';
import cn from 'classnames';
import { useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import styles from './monthly-report.module.scss';

export default function MonthlyReport() {
  const [csvData, setCsvData] = useState<any[]>([]);
  const contentRef = useRef(null);
  const [vatChecked, setVatChecked] = useState(false);
  const [resolutionPayoutChecked, setResolutionPayoutChecked] = useState(false);
  const [resolutionPayoutAmount, setResolutionPayoutAmount] = useState<
    number | undefined
  >(0);
  const [resolutionPayoutDescription, setResolutionPayoutDescription] =
    useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleDataUpload = (data: any[]) => {
    setCsvData(data);
  };

  const handleVatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVatChecked(e.target.checked);
  };

  const handleResolutionPayoutChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setResolutionPayoutChecked(e.target.checked);
  };

  const handleResolutionPayoutAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setResolutionPayoutAmount(parseFloat(e.target.value) || undefined);
  };

  const handleResolutionPayoutDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setResolutionPayoutDescription(e.target.value);
  };

  const handleAddResolutionPayout = () => {
    const newResolutionPayout = {
      Type: 'Resolution Payout',
      'Start date': '',
      'End date': '',
      Nights: '',
      Guest: 'Description',
      Listing: resolutionPayoutDescription,
      Amount: resolutionPayoutAmount,
      'Service fee': ''
    };

    setCsvData((prevData) => [...prevData, newResolutionPayout]);

    // Reset the resolution payout amount and checkbox
    setResolutionPayoutAmount(undefined);
    setResolutionPayoutChecked(false);
    setResolutionPayoutDescription('');

    // Show toast message for 3 seconds
    setToastMessage('Resolution Payout added');
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <main className={styles.mainContainer}>
      {showToast && (
        <div className={cn('toast', 'toast-top', styles.toastContainer)}>
          <div className="alert alert-success">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
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
              <div className={styles.resolutionPayoutContainer}>
                <label className={cn('label', styles.checkBox)}>
                  <span className={cn('label-text', styles.checkBoxLabel)}>
                    Include VAT 10%
                  </span>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={vatChecked}
                    onChange={handleVatChange}
                  />
                </label>
                <label className={cn('label', styles.checkBox)}>
                  <span className={cn('label-text', styles.checkBoxLabel)}>
                    Resolution Payout
                  </span>
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
                      className={cn(
                        'input',
                        'input-bordered',
                        'input-primary',
                        styles.resolutionPayoutInput
                      )}
                      value={resolutionPayoutAmount}
                      onChange={handleResolutionPayoutAmountChange}
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      className={cn(
                        'input',
                        'input-bordered',
                        'input-primary',
                        styles.resolutionPayoutDescription
                      )}
                      value={resolutionPayoutDescription}
                      onChange={handleResolutionPayoutDescriptionChange}
                    />
                    <button
                      className={cn('btn', styles.resolutionPayoutAddButton)}
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
          <DataTable
            data={csvData}
            contentRef={contentRef}
            vatChecked={vatChecked}
          />
        )}
      </div>
    </main>
  );
}
