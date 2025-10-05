import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid';
import { formatCurrency } from '@/lib/utils';
import { Decimal } from '@prisma/client/runtime/library';

const HeaderIndicator = ({ label, value }: { label: string; value: number | Decimal }) => {
  const numericValue = typeof value === 'number' ? value : value.toNumber();
  const isPositive = numericValue >= 0;
  const intensity = Math.min(Math.abs(numericValue) / 10000, 1);

  return (
    <div className='flex items-center gap-2 p-2 rounded-lg bg-white/50 border border-gray-100 shadow-sm'>
      <span className='text-xs font-medium text-gray-600 uppercase tracking-wide'>{label}:</span>
      <span
        className={`font-bold flex items-center gap-1.5 px-2 py-1 rounded-md text-sm ${
          isPositive
            ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
            : 'text-red-700 bg-red-50 border border-red-200'
        }`}
        style={{
          backgroundColor: isPositive
            ? `rgba(16, 185, 129, ${0.1 + intensity * 0.15})`
            : `rgba(239, 68, 68, ${0.1 + intensity * 0.15})`,
        }}
      >
        {isPositive ? <ArrowUpIcon className='h-4 w-4' /> : <ArrowDownIcon className='h-4 w-4' />}
        {formatCurrency(Math.abs(numericValue))}
      </span>
    </div>
  );
};

export default HeaderIndicator;
