import { BanknotesIcon, ClockIcon, UserGroupIcon, InboxIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/components/shared/fonts';

import { fetchCardData } from '@/lib/data/dashboard';

const iconMap = {
  collected: BanknotesIcon,
  clientes: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper() {
  const { numberOfInvoices, numberOfClientes, totalPaidInvoices, totalPendingInvoices } =
    await fetchCardData();

  return (
    <>
      <Card title='Coletado' value={totalPaidInvoices} type='collected' />
      <Card title='Pendente' value={totalPendingInvoices} type='pending' />
      <Card title='Total Faturas' value={numberOfInvoices} type='invoices' />
      <Card title='Total Clientes' value={numberOfClientes} type='clientes' />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'clientes' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className='rounded-xl bg-gray-50 p-2 shadow-sm'>
      <div className='flex p-4'>
        {Icon ? <Icon className='h-5 w-5 text-gray-700' /> : null}
        <h3 className='ml-2 text-sm font-medium'>{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
