import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteBanco } from '@/modules/bancos/actions/banco-actions';

export function UpdateBanco({ id }: { id: string }) {
  return (
    <Link
      href={{ pathname: `/dashboard/bancos/${id}/edit` }}
      className='rounded-md border p-2 hover:bg-gray-100'
    >
      <PencilIcon className='w-5' />
    </Link>
  );
}

export function DeleteBanco({ id }: { id: string }) {
  const deleteBancoWithId = deleteBanco.bind(null, id);

  return (
    <form action={deleteBancoWithId}>
      <button type='submit' className='rounded-md border p-2 hover:bg-gray-100'>
        <span className='sr-only'>Delete</span>
        <TrashIcon className='w-5' />
      </button>
    </form>
  );
}
