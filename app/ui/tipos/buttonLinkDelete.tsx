import { TrashIcon } from '@heroicons/react/24/outline';

import { deleteTipo } from '@/lib/tipos/actions';

export function ButtonLinkDelete({ id }: { id: string }) {
  const deleteTipoWithId = deleteTipo.bind(null, id);

  return (
    <form action={deleteTipoWithId}>
      <button type='submit' className='rounded-md border p-2 hover:bg-gray-100'>
        <span className='sr-only'>Delete</span>
        <TrashIcon className='w-5' />
      </button>
    </form>
  );
}
