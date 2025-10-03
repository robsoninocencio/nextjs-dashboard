import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { ButtonLinkUpdate } from '@/app/ui/shared/buttonLinkUpdate';

import { DeleteCliente, UpdateCliente } from '@/app/ui/clientes/buttons';
import { fetchFilteredClientes } from '@/lib/data/clientes';

export default async function ClientesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const clientes = await fetchFilteredClientes(query, currentPage);

  return (
    <div className='mt-6 flow-root'>
      <div className='inline-block min-w-full align-middle'>
        <Card>
          <CardContent className='p-2 md:pt-0'>
            <div className='md:hidden'>
              {clientes?.map(cliente => (
                <div key={cliente.id} className='mb-2 w-full rounded-md bg-white p-4'>
                  <div className='flex items-center justify-between border-b pb-4'>
                    <div>
                      <div className='mb-2 flex items-center'>
                        <p>{cliente.name}</p>
                      </div>
                      <p className='text-sm text-gray-500'>{cliente.email}</p>
                    </div>
                  </div>
                  <div className='flex w-full items-center justify-between pt-4'>
                    <div className='flex justify-end gap-2'>
                      <ButtonLinkUpdate
                        href={{
                          pathname: `/dashboard/clientes/${cliente.id}/edit`,
                        }}
                      />
                      <DeleteCliente id={cliente.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <table className='hidden min-w-full text-gray-900 md:table'>
              <thead className='rounded-lg text-left text-sm font-normal'>
                <tr>
                  <th scope='col' className='px-4 py-5 font-medium sm:pl-6'>
                    Cliente
                  </th>
                  <th scope='col' className='px-3 py-5 font-medium'>
                    Email
                  </th>
                  <th scope='col' className='relative py-3 pl-6 pr-3'>
                    <span className='sr-only'>Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white'>
                {clientes?.map(cliente => (
                  <tr
                    key={cliente.id}
                    className='w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg'
                  >
                    <td className='whitespace-nowrap py-3 pl-6 pr-3'>
                      <div className='flex items-center gap-3'>
                        <p>{cliente.name}</p>
                      </div>
                    </td>
                    <td className='whitespace-nowrap px-3 py-3'>{cliente.email}</td>

                    <td className='whitespace-nowrap py-3 pl-6 pr-3'>
                      <div className='flex justify-end gap-3'>
                        <ButtonLinkUpdate
                          href={{
                            pathname: `/dashboard/clientes/${cliente.id}/edit`,
                          }}
                        />
                        <DeleteCliente id={cliente.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
