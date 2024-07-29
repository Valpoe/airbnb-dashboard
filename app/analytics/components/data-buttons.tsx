import {
  ArrowTrendingUpIcon,
  ChartBarIcon,
  ChartPieIcon,
  DocumentMagnifyingGlassIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';
import cn from 'classnames';
import styles from './styles.module.scss';

export default function DataButtons({
  selectedButton,
  setselectedButton
}: {
  selectedButton: string;
  setselectedButton: (buttonType: string) => void;
}) {
  const dataContent = [
    'statistics',
    'table',
    'line-chart',
    'bar-chart',
    'pie-chart'
  ];

  const getIconForButtonType = (buttonType: string) => {
    switch (buttonType) {
      case 'statistics':
        return <DocumentMagnifyingGlassIcon className={styles.icon} />;
      case 'table':
        return <TableCellsIcon className={styles.icon} />;
      case 'line-chart':
        return <ArrowTrendingUpIcon className={styles.icon} />;
      case 'bar-chart':
        return <ChartBarIcon className={styles.icon} />;
      case 'pie-chart':
        return <ChartPieIcon className={styles.icon} />;
      default:
        return null;
    }
  };

  return (
    <>
      {dataContent.map((buttonType, index) => (
        <button
          key={index}
          className={cn(
            'btn',
            styles.dataButton,
            selectedButton === buttonType ? styles.activeButton : ''
          )}
          onClick={() => setselectedButton(buttonType)}
        >
          {buttonType.charAt(0).toUpperCase() +
            buttonType.slice(1).replace('-', ' ')}
          {/* Convert 'line-chart' to 'Line Chart' */}
          {getIconForButtonType(buttonType)}
        </button>
      ))}
    </>
  );
}
