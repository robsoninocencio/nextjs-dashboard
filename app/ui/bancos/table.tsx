'use client';

import { ButtonLinkUpdate } from '@/components/shared/buttonLinkUpdate';
import { DeleteBanco } from '@/app/ui/bancos/buttons';
import { DataTable, Column } from '@/components/ui/data-table';

interface Banco {
  id: string;
  nome: string;
}

interface BancosTableProps {
  bancos: Banco[];
}

export default function BancosTable({ bancos }: BancosTableProps) {
  const columns: Column<Banco>[] = [
    {
      key: 'nome',
      title: 'Banco',
      render: banco => (
        <div className='flex items-center gap-3'>
          <p>{banco.nome}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      title: '',
      render: banco => (
        <div className='flex justify-end gap-3'>
          <ButtonLinkUpdate
            href={{
              pathname: `/dashboard/bancos/${banco.id}/edit`,
            }}
          />
          <DeleteBanco id={banco.id} />
        </div>
      ),
    },
  ];

  return (
    <div className='mt-6 flow-root'>
      <div className='inline-block min-w-full align-middle'>
        <div className='rounded-lg bg-gray-50 p-2 md:pt-0'>
          {/* Mobile view */}
          <div className='md:hidden'>
            {bancos?.map(banco => (
              <div key={banco.id} className='mb-2 w-full rounded-md bg-white p-4'>
                <div className='flex items-center justify-between border-b pb-4'>
                  <div>
                    <div className='mb-2 flex items-center'>
                      <p>{banco.nome}</p>
                    </div>
                  </div>
                </div>
                <div className='flex w-full items-center justify-between pt-4'>
                  <div className='flex justify-end gap-2'>
                    <ButtonLinkUpdate
                      href={{
                        pathname: `/dashboard/bancos/${banco.id}/edit`,
                      }}
                    />
                    <DeleteBanco id={banco.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop view using DataTable */}
          <div className='hidden md:block'>
            <DataTable
              data={bancos || []}
              columns={columns}
              emptyMessage='Nenhum banco encontrado'
              className='bg-white'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
