import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteTipo } from '@/lib/actions/tipo-actions';

export function UpdateTipo({ id }: { id: string }) {
  return (
    <Link
      href={{ pathname: `/dashboard/tipos/${id}/edit` }}
      className='rounded-md border p-2 hover:bg-gray-100'
    >
      <PencilIcon className='w-5' />
    </Link>
  );
}

export function DeleteTipo({ id }: { id: string }) {
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
