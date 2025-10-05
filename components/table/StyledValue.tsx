import { formatCurrency, formatToDecimals } from '@/lib/utils';
import { Decimal } from '@prisma/client/runtime/library';

const StyledValue = ({
  value,
  type = 'default',
  isBold = false,
  showAsPercentage = false,
}: {
  value: number | Decimal;
  type?:
    | 'profit'
    | 'loss'
    | 'neutral'
    | 'default'
    | 'tax'
    | 'balance'
    | 'good'
    | 'very-good'
    | 'excellent';
  isBold?: boolean;
  showAsPercentage?: boolean;
}) => {
  const numericValue = typeof value === 'number' ? value : value.toNumber();
  const isNegative = numericValue < 0;
  const isZero = numericValue === 0;

  const getStyles = () => {
    if (isZero) {
      return 'text-gray-600 bg-gray-50 border-gray-200';
    }

    switch (type) {
      case 'profit':
        return isNegative
          ? 'text-red-600 bg-red-50 border-red-200'
          : 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'loss':
        return isNegative
          ? 'text-red-600 bg-red-50 border-red-200'
          : 'text-blue-600 bg-blue-50 border-blue-200';
      case 'tax':
        return isNegative
          ? 'text-red-600 bg-red-50 border-red-200'
          : 'text-orange-600 bg-orange-50 border-orange-200';
      case 'balance':
        return isNegative
          ? 'text-red-600 bg-red-50 border-red-200'
          : 'text-blue-600 bg-blue-50 border-blue-200';
      case 'neutral':
        return isNegative
          ? 'text-red-600 bg-red-50 border-red-200'
          : 'text-gray-700 bg-yellow-100 border-gray-200';
      case 'good':
        return isNegative
          ? 'text-red-600 bg-red-50 border-red-200'
          : 'text-emerald-500 bg-emerald-50 border-emerald-200';
      case 'very-good':
        return isNegative
          ? 'text-red-600 bg-red-50 border-red-200'
          : 'text-emerald-700 bg-emerald-100 border-emerald-300';
      case 'excellent':
        return isNegative
          ? 'text-red-600 bg-red-50 border-red-200'
          : 'text-emerald-900 bg-emerald-200 border-emerald-400';

      default:
        return isNegative
          ? 'text-red-600 bg-red-50 border-red-200'
          : 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const styles = getStyles();
  const displayValue = showAsPercentage
    ? `${formatToDecimals(Math.abs(numericValue), 6)}%`
    : formatCurrency(Math.abs(numericValue));

  return (
    <span className={`font-medium py-1 rounded border ${styles} ${isBold ? 'font-bold' : ''}`}>
      {isNegative && !isZero && '-'}
      {displayValue}
    </span>
  );
};

export default StyledValue;
