import SearchAno from '@/components/shared/searchAno';
import SearchMes from '@/components/shared/searchMes';
import SearchCliente from '@/components/shared/searchCliente';
import SearchBanco from '@/components/shared/searchBanco';
import SearchAtivo from '@/components/shared/searchAtivo';
import SearchTipo from '@/components/shared/searchTipo';
import CategoriaFilter from '@/components/shared/categoria-filter';
import { Card, CardContent } from '@/components/ui/card';
import type { CategoriaComPai } from '@/types';

type InvestmentFiltersProps = {
  categorias: CategoriaComPai[];
};

export function InvestmentFilters({ categorias }: InvestmentFiltersProps) {
  return (
    <Card className='mt-4'>
      <CardContent className='pt-6'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <SearchCliente placeholder='Buscar por Cliente...' />
          <div className='flex flex-1 gap-4'>
            <SearchAno placeholder='Ano...' />
            <SearchMes placeholder='Mês...' />
          </div>
          <CategoriaFilter categorias={categorias} />
        </div>
        <div className='mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <SearchBanco placeholder='Buscar por Banco...' />
          <SearchAtivo placeholder='Buscar por Ativo...' />
          <SearchTipo placeholder='Buscar por Tipo...' />
        </div>
      </CardContent>
    </Card>
  );
}
