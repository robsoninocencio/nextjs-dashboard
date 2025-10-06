import { TrashIcon } from '@heroicons/react/24/outline';

import { deleteInvestimento } from '@/lib/actions/investimentos';

export function ButtonLinkDelete({ id }: { id: string }) {
  const deleteInvestimentoWithId = deleteInvestimento.bind(null, id);

  return (
    <form action={deleteInvestimentoWithId}>
      <button type='submit' className='rounded-md border p-1 hover:bg-gray-100'>
        <span className='sr-only'>Delete</span>
        <TrashIcon className='w-4' />
      </button>
    </form>
  );
}
