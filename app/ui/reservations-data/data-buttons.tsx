import {
  ArrowTrendingUpIcon,
  ChartBarIcon,
  DocumentMagnifyingGlassIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';

export default function DataButtons({
  selectedButton,
  setselectedButton
}: {
  selectedButton: string;
  setselectedButton: (buttonType: string) => void;
}) {
  const dataContent = ['statistics', 'table', 'line-chart', 'bar-chart'];

  const getIconForButtonType = (buttonType: string) => {
    switch (buttonType) {
      case 'statistics':
        return <DocumentMagnifyingGlassIcon className="w-6 h-6" />;
      case 'table':
        return <TableCellsIcon className="w-6 h-6" />;
      case 'line-chart':
        return <ArrowTrendingUpIcon className="w-6 h-6" />;
      case 'bar-chart':
        return <ChartBarIcon className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <>
      {dataContent.map((buttonType, index) => (
        <button
          key={index}
          className={`btn w-36 h-14 inline-flex items-center bg-neutral hover:text-accent hover:bg-neutral ${
            selectedButton === buttonType ? 'text-accent' : ''
          }`}
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
