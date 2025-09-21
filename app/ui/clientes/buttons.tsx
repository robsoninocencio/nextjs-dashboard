import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteCliente } from '@/lib/clientes/actions';

export function UpdateCliente({ id }: { id: string }) {
  return (
    <Link
      href={{ pathname: `/dashboard/clientes/${id}/edit` }}
      className='rounded-md border p-2 hover:bg-gray-100'
    >
      <PencilIcon className='w-5' />
    </Link>
  );
}

export function DeleteCliente({ id }: { id: string }) {
  const deleteClienteWithId = deleteCliente.bind(null, id);

  return (
    <form action={deleteClienteWithId}>
      <button type='submit' className='rounded-md border p-2 hover:bg-gray-100'>
        <span className='sr-only'>Delete</span>
        <TrashIcon className='w-5' />
      </button>
    </form>
  );
}
