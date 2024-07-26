import { DataTypeKey, dataTypes } from '@/app/lib/definitions';
import cn from 'classnames';
import styles from './styles.module.scss';

type DataTypeButtonProps = {
  selectedDataType: DataTypeKey;
  toggleDataType: (dataType: DataTypeKey) => void;
};

const DataTypeButtons = ({
  selectedDataType,
  toggleDataType
}: DataTypeButtonProps) => {
  return (
    <>
      {Object.keys(dataTypes).map((dataType) => (
        <button
          key={dataType}
          className={cn(
            'btn',
            styles.dataTypeButtons,
            selectedDataType === dataType
              ? styles.activeButton
              : styles.inactiveButton
          )}
          onClick={() => toggleDataType(dataType as DataTypeKey)}
        >
          {dataTypes[dataType].label}
        </button>
      ))}
    </>
  );
};

export default DataTypeButtons;
