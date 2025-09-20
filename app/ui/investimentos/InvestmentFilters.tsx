import SearchAno from "@/app/ui/shared/searchAno";
import SearchMes from "@/app/ui/shared/searchMes";
import SearchCliente from "@/app/ui/shared/searchCliente";
import SearchBanco from "@/app/ui/shared/searchBanco";
import SearchAtivo from "@/app/ui/shared/searchAtivo";
import SearchTipo from "@/app/ui/shared/searchTipo";
import CategoriaFilter from "@/app/ui/shared/categoria-filter";
import { Card, CardContent } from "@/components/ui/card";
import { Categoria } from "@/lib/categorias/definitions";

type InvestmentFiltersProps = {
  categorias: Categoria[];
};

export function InvestmentFilters({ categorias }: InvestmentFiltersProps) {
  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SearchCliente placeholder="Buscar por Cliente..." />
          <div className="flex flex-1 gap-4">
            <SearchAno placeholder="Ano..." />
            <SearchMes placeholder="Mês..." />
          </div>
          <CategoriaFilter categorias={categorias} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SearchBanco placeholder="Buscar por Banco..." />
          <SearchAtivo placeholder="Buscar por Ativo..." />
          <SearchTipo placeholder="Buscar por Tipo..." />
        </div>
      </CardContent>
    </Card>
  );
}
