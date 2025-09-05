import { ButtonLinkUpdate } from "@/app/ui/shared/buttonLinkUpdate";
import { ButtonLinkDelete } from "@/app/ui/investimentos/buttonLinkDelete";
import { Badge } from "@/components/ui/badge";
import {
  formatDateToLocal,
  formatCurrency,
  formatDateToYear,
  formatDateToMonth,
  formatToDecimals,
} from "@/lib/utils";
import {
  fetchFilteredInvestimentos,
  fetchInvestimentoGroupByClienteAnoMes,
} from "@/lib/investimentos/data";
import {
  GrupoInvestimento,
  GrupoInvestimentoItem,
} from "@/lib/investimentos/definitions";

type GroupedInvestment = {
  cliente: string;
  ano: string;
  mes: string;
  investimentos: any[];
};

// Helper para agrupar investimentos
const groupInvestimentos = (
  investimentos: any[]
): Record<string, GroupedInvestment> => {
  if (!investimentos || investimentos.length === 0) return {};
  return investimentos.reduce((acc: Record<string, GroupedInvestment>, inv) => {
    const key = `${inv.clientes.name}-${inv.ano}-${inv.mes}`;
    if (!acc[key]) {
      acc[key] = {
        cliente: inv.clientes.name,
        ano: inv.ano,
        mes: inv.mes,
        investimentos: [],
      };
    }
    acc[key].investimentos.push(inv);
    return acc;
  }, {});
};

// Interface para os props do componente
interface InvestimentosTableProps {
  currentPage: number;
  queryAno: string;
  queryMes: string;
  queryCliente: string;
  queryBanco: string;
  queryAtivo: string;
  queryTipo: string;
  categoriaId?: string;
}

// Componente para exibir uma linha de investimento no layout mobile
function MobileInvestimentoRow({ investimento }: { investimento: any }) {
  return (
    <div key={investimento.id} className="mb-1 w-full rounded-md bg-white p-2">
      <div className="flex items-center justify-between pb-1">
        <p className="text-lg font-medium">{investimento.clientes.name}</p>
        <div className="flex items-center gap-2">
          <p>{formatDateToMonth(investimento.data.toISOString())}</p>
          <p>{formatDateToYear(investimento.data.toISOString())}</p>
        </div>
      </div>
      <div className="flex items-center justify-between pb-1">
        <p className="font-medium">{investimento.bancos.nome}</p>
        <p className="font-medium">{investimento.ativos.nome}</p>
      </div>
      <div className="flex flex-wrap items-center gap-1 pb-1">
        {investimento.ativos.ativo_categorias.map(({ categoria }: any) => (
          <Badge key={categoria.id} variant="secondary">
            {categoria.nome}
          </Badge>
        ))}
      </div>
      <div className="flex items-center justify-between pb-1">
        <p>Rendimento</p>
        <p>{formatCurrency(investimento.rendimentoDoMes)}</p>
      </div>

      {investimento.dividendosDoMes > 0 && (
        <div className="flex items-center justify-between pb-1">
          <p>Dividendos</p>
          <p>{formatCurrency(investimento.dividendosDoMes)}</p>
        </div>
      )}

      {investimento.valorAplicado > 0 && (
        <div className="flex items-center justify-between pb-1">
          <p>Aplicação</p>
          <p>{formatCurrency(investimento.valorAplicado)}</p>
        </div>
      )}
      {investimento.saldoBruto > 0 && (
        <div className="flex items-center justify-between pb-1">
          <p>Saldo Bruto</p>
          <p>{formatCurrency(investimento.saldoBruto)}</p>
        </div>
      )}
      {investimento.valorResgatado > 0 && (
        <div className="flex items-center justify-between pb-1">
          <p>Resgates</p>
          <p>{formatCurrency(investimento.valorResgatado)}</p>
        </div>
      )}
      {investimento.impostoIncorrido > 0 && (
        <div className="flex items-center justify-between pb-1">
          <p>Impostos Incorridos</p>
          <p>{formatCurrency(investimento.impostoIncorrido)}</p>
        </div>
      )}
      {investimento.impostoPrevisto > 0 && (
        <div className="flex items-center justify-between pb-1">
          <p>Impostos Previstos</p>
          <p>{formatCurrency(investimento.impostoPrevisto)}</p>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-medium">Saldo Líquido</p>
          <p className="text-lg font-medium">
            {formatCurrency(investimento.saldoLiquido)}
          </p>
        </div>
        <div className="flex justify-end gap-1">
          <ButtonLinkUpdate
            href={`/dashboard/investimentos/${investimento.id}/edit`}
          />
          <ButtonLinkDelete id={investimento.id} />
        </div>
      </div>
    </div>
  );
}

// Componente para exibir os totais no layout mobile
function MobileTotals({ totais }: { totais: any }) {
  return (
    <div className="mb-1 w-full rounded-md bg-gray-100 p-3 mt-4 border-t-4 border-gray-200">
      <p className="text-lg font-bold mb-2 text-gray-800">Total Geral do Mês</p>
      {[
        { label: "Rendimento", value: totais.rendimentoDoMes },
        { label: "Dividendos", value: totais.dividendosDoMes },
        { label: "Valores Aplicados", value: totais.valorAplicado },
        { label: "Saldo Bruto", value: totais.saldoBruto },
        { label: "Valores Resgatados", value: totais.valorResgatado },
        { label: "Impostos Incorridos", value: totais.impostoIncorrido },
        { label: "Impostos Previstos", value: totais.impostoPrevisto },
        { label: "Saldo Líquido", value: totais.saldoLiquido },
      ].map(
        ({ label, value }) =>
          value > 0 && (
            <div key={label} className="flex items-center justify-between pb-1">
              <p>{label}</p>
              <p>{formatCurrency(value)}</p>
            </div>
          )
      )}
    </div>
  );
}

// Componente para exibir a tabela de investimentos no layout desktop
function DesktopInvestimentosTable({
  investimentos,
  totais,
}: {
  investimentos: any;
  totais: any;
}) {
  const groupedInvestimentos = Object.values(
    groupInvestimentos(investimentos)
  ).map((group) => {
    // Calcula os totais para cada grupo
    const groupTotals = group.investimentos.reduce(
      (acc, inv) => {
        acc.rendimentoDoMes += inv.rendimentoDoMes;
        acc.dividendosDoMes += inv.dividendosDoMes;
        acc.valorAplicado += inv.valorAplicado;
        acc.saldoBruto += inv.saldoBruto; // Nota: Somar saldos pode não ser o ideal. O correto seria exibir o último saldo.
        acc.valorResgatado += inv.valorResgatado;
        acc.impostoIncorrido += inv.impostoIncorrido;
        acc.impostoPrevisto += inv.impostoPrevisto;
        acc.saldoLiquido += inv.saldoLiquido; // Nota: Somar saldos pode não ser o ideal.
        return acc;
      },
      {
        rendimentoDoMes: 0,
        dividendosDoMes: 0,
        valorAplicado: 0,
        saldoBruto: 0,
        valorResgatado: 0,
        impostoIncorrido: 0,
        impostoPrevisto: 0,
        saldoLiquido: 0,
      }
    );
    return {
      ...group,
      totals: groupTotals,
    };
  });

  const monthNames: { [key: string]: string } = {
    "01": "Janeiro",
    "02": "Fevereiro",
    "03": "Março",
    "04": "Abril",
    "05": "Maio",
    "06": "Junho",
    "07": "Julho",
    "08": "Agosto",
    "09": "Setembro",
    "10": "Outubro",
    "11": "Novembro",
    "12": "Dezembro",
  };

  const TableHeaderRow = ({ visibleHeaders }: { visibleHeaders: any[] }) => (
    <tr className="text-sm font-normal border-b-2 border-t-2 border-gray-300 bg-gray-100">
      {["Banco", "Ativo", "Tipo", "Categorias"].map((header) => (
        <td
          key={header}
          className="align-top px-3 py-2 text-sm font-semibold text-gray-700 uppercase tracking-wide text-left"
        >
          {header}
        </td>
      ))}
      {visibleHeaders.map(({ label }) => (
        <td
          key={label}
          className="align-top px-3 py-2 text-sm font-semibold text-gray-700 uppercase tracking-wide text-right"
        >
          {label}
        </td>
      ))}
      <td className="relative py-1.5 pl-2 pr-3">
        <span className="sr-only">Ações</span>
      </td>
    </tr>
  );

  const headerConfig = [
    { label: "Rendimento", key: "rendimentoDoMes" },
    {
      label: "Rendimento (%)",
      key: "percentualRendimentoDoMes",
    },
    {
      label: "Dividendo",
      key: "dividendosDoMes",
      condition: totais.dividendosDoMes > 0,
    },
    {
      label: "Dividendo (%)",
      key: "percentualDividendosDoMes",
      condition: totais.dividendosDoMes > 0,
    },
    {
      label: "Rend + Div (%)",
      key: "percentualRendMaisDivDoMes",
      condition: totais.dividendosDoMes > 0,
    },
    {
      label: "Aplicações",
      key: "valorAplicado",
      condition: totais.valorAplicado > 0,
    },
    {
      label: "Saldo Bruto",
      key: "saldoBruto",
      condition: totais.saldoBruto > 0,
    },
    {
      label: "% Cresc Bruto",
      key: "percentualDeCrescimentoSaldoBruto",
    },
    {
      label: "Resgates",
      key: "valorResgatado",
      condition: totais.valorResgatado > 0,
    },
    {
      label: "Imposto Incorrido",
      key: "impostoIncorrido",
      condition: totais.impostoIncorrido > 0,
    },
    {
      label: "Imposto Previsto",
      key: "impostoPrevisto",
      condition: totais.impostoPrevisto > 0,
    },
    { label: "Saldo Líquido", key: "saldoLiquido" },
    {
      label: "% Cresc Liquido",
      key: "percentualDeCrescimentoSaldoLiquido",
    },
  ];

  const visibleHeaders = headerConfig.filter(
    ({ condition = true }) => condition
  );
  const colSpan = 4 + visibleHeaders.length + 1; // 4 estáticos + dinâmicos + 1 ações

  return (
    <div className="hidden md:block">
      <table className="min-w-full text-gray-900">
        <tbody className="bg-white">
          {groupedInvestimentos.map((group) => (
            <>
              <tr
                key={`${group.cliente}-${group.ano}-${group.mes}`}
                className="bg-gray-200"
              >
                <td
                  colSpan={colSpan}
                  className="p-2 text-xl font-semibold text-gray-800"
                >
                  {group.cliente} - {group.ano} - {monthNames[group.mes]}
                </td>
              </tr>
              <TableHeaderRow visibleHeaders={visibleHeaders} />
              {group.investimentos.map((investimento: any) => (
                <tr
                  key={investimento.id}
                  className="border-b text-sm last:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-2 py-1.5 align-top">
                    {investimento.bancos.nome}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 align-top">
                    {investimento.ativos.nome}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 align-top">
                    {investimento.ativos.tipos?.nome}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 align-top">
                    <div className="flex flex-wrap gap-1">
                      {investimento.ativos.ativo_categorias.map(
                        ({ categoria }: any) => (
                          <Badge key={categoria.id} variant="secondary">
                            {categoria.nome}
                          </Badge>
                        )
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                    {formatCurrency(investimento.rendimentoDoMes)}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                    {formatToDecimals(
                      (investimento.rendimentoDoMes /
                        100 /
                        (investimento.saldoBruto / 100 -
                          investimento.rendimentoDoMes / 100 -
                          investimento.valorAplicado / 100 +
                          investimento.valorResgatado / 100 +
                          investimento.impostoIncorrido / 100 +
                          investimento.valorAplicado / 100)) *
                        100,
                      6
                    )}
                  </td>
                  {totais.dividendosDoMes > 0 && (
                    <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                      {formatCurrency(investimento.dividendosDoMes)}
                    </td>
                  )}
                  {totais.dividendosDoMes > 0 && (
                    <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                      {formatToDecimals(
                        (investimento.dividendosDoMes /
                          100 /
                          (investimento.saldoBruto / 100 -
                            investimento.rendimentoDoMes / 100 -
                            investimento.valorAplicado / 100 +
                            investimento.valorResgatado / 100 +
                            investimento.impostoIncorrido / 100 +
                            investimento.valorAplicado / 100)) *
                          100,
                        6
                      )}
                    </td>
                  )}
                  {totais.dividendosDoMes > 0 && (
                    <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                      {formatToDecimals(
                        ((investimento.rendimentoDoMes / 100 +
                          investimento.dividendosDoMes / 100) /
                          (investimento.saldoBruto / 100 -
                            investimento.rendimentoDoMes / 100 -
                            investimento.valorAplicado / 100 +
                            investimento.valorResgatado / 100 +
                            investimento.impostoIncorrido / 100 +
                            investimento.valorAplicado / 100)) *
                          100,
                        6
                      )}
                    </td>
                  )}
                  {totais.valorAplicado > 0 && (
                    <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                      {formatCurrency(investimento.valorAplicado)}
                    </td>
                  )}
                  {totais.saldoBruto > 0 && (
                    <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                      {formatCurrency(investimento.saldoBruto)}
                    </td>
                  )}
                  <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                    {formatToDecimals(
                      investimento.percentualDeCrescimentoSaldoBruto,
                      6
                    )}
                  </td>
                  {totais.valorResgatado > 0 && (
                    <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                      {formatCurrency(investimento.valorResgatado)}
                    </td>
                  )}
                  {totais.impostoIncorrido > 0 && (
                    <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                      {formatCurrency(investimento.impostoIncorrido)}
                    </td>
                  )}
                  {totais.impostoPrevisto > 0 && (
                    <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                      {formatCurrency(investimento.impostoPrevisto)}
                    </td>
                  )}
                  <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                    {formatCurrency(investimento.saldoLiquido)}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                    {formatToDecimals(
                      investimento.percentualDeCrescimentoSaldoLiquido,
                      6
                    )}
                  </td>
                  <td className="whitespace-nowrap py-1.5 pl-2 pr-3 align-top">
                    <div className="flex justify-end gap-1">
                      <ButtonLinkUpdate
                        href={`/dashboard/investimentos/${investimento.id}/edit`}
                      />
                      <ButtonLinkDelete id={investimento.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {/* Total do Grupo */}
              <tr className="border-t-2 border-b-4 border-gray-300 bg-gray-50 font-medium">
                <td
                  colSpan={4}
                  className="px-2 py-1.5 text-left font-semibold align-top "
                >
                  Total do Grupo
                </td>
                <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                  {formatCurrency(group.totals.rendimentoDoMes)}
                </td>
                <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                  {/* Percentual do grupo - em branco por enquanto */}
                </td>
                {totais.dividendosDoMes > 0 && (
                  <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                    {formatCurrency(group.totals.dividendosDoMes)}
                  </td>
                )}
                {totais.dividendosDoMes > 0 && (
                  <td className="whitespace-nowrap px-2 py-1.5 text-right align-top"></td>
                )}
                {totais.dividendosDoMes > 0 && (
                  <td className="whitespace-nowrap px-2 py-1.5 text-right align-top"></td>
                )}
                {totais.valorAplicado > 0 && (
                  <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                    {formatCurrency(group.totals.valorAplicado)}
                  </td>
                )}
                {totais.saldoBruto > 0 && (
                  <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                    {formatCurrency(group.totals.saldoBruto)}
                  </td>
                )}
                <td className="whitespace-nowrap px-2 py-1.5 text-right align-top"></td>
                {totais.valorResgatado > 0 && (
                  <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                    {formatCurrency(group.totals.valorResgatado)}
                  </td>
                )}
                {totais.impostoIncorrido > 0 && (
                  <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                    {formatCurrency(group.totals.impostoIncorrido)}
                  </td>
                )}
                {totais.impostoPrevisto > 0 && (
                  <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                    {formatCurrency(group.totals.impostoPrevisto)}
                  </td>
                )}
                <td className="whitespace-nowrap px-2 py-1.5 text-right align-top">
                  {formatCurrency(group.totals.saldoLiquido)}
                </td>
                <td className="whitespace-nowrap px-2 py-1.5 text-right align-top"></td>
                <td className="whitespace-nowrap px-2 py-1.5 text-right align-top"></td>
              </tr>
            </>
          ))}
        </tbody>
        {investimentos?.length > 0 && (
          <tfoot className="bg-gray-200 text-base font-bold border-t-4 border-gray-300">
            <tr>
              <td
                colSpan={4}
                className="px-3 py-3 text-left text-lg font-bold align-top"
              >
                Totais Geral
              </td>
              <td className="whitespace-nowrap px-3 py-3 text-right align-top">
                {formatCurrency(totais.rendimentoDoMes)}
              </td>
              <td className="whitespace-nowrap px-3 py-3 text-right align-top">
                {formatToDecimals(
                  (totais.rendimentoDoMes /
                    (totais.saldoBruto -
                      totais.rendimentoDoMes -
                      totais.valorAplicado +
                      totais.valorResgatado +
                      totais.impostoIncorrido)) *
                    100,
                  6
                )}
              </td>
              {totais.dividendosDoMes > 0 && (
                <td className="whitespace-nowrap px-3 py-3 text-right align-top">
                  {formatCurrency(totais.dividendosDoMes)}
                </td>
              )}
              {totais.dividendosDoMes > 0 && (
                <td className="whitespace-nowrap px-3 py-3 text-right align-top"></td>
              )}
              {totais.dividendosDoMes > 0 && (
                <td className="whitespace-nowrap px-3 py-3 text-right align-top"></td>
              )}
              {totais.valorAplicado > 0 && (
                <td className="whitespace-nowrap px-3 py-3 text-right align-top">
                  {formatCurrency(totais.valorAplicado)}
                </td>
              )}
              {totais.saldoBruto > 0 && (
                <td className="whitespace-nowrap px-3 py-3 text-right align-top">
                  {formatCurrency(totais.saldoBruto)}
                </td>
              )}
              <td className="whitespace-nowrap px-3 py-3 text-right align-top"></td>
              {totais.valorResgatado > 0 && (
                <td className="whitespace-nowrap px-3 py-3 text-right align-top">
                  {formatCurrency(totais.valorResgatado)}
                </td>
              )}
              {totais.impostoIncorrido > 0 && (
                <td className="whitespace-nowrap px-3 py-3 text-right align-top">
                  {formatCurrency(totais.impostoIncorrido)}
                </td>
              )}
              {totais.impostoPrevisto > 0 && (
                <td className="whitespace-nowrap px-3 py-3 text-right align-top">
                  {formatCurrency(totais.impostoPrevisto)}
                </td>
              )}
              <td className="whitespace-nowrap px-3 py-3 text-right align-top">
                {formatCurrency(totais.saldoLiquido)}
              </td>
              <td className="whitespace-nowrap px-3 py-3 text-right align-top"></td>
              <td className="align-top"></td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

// Componente principal
export default async function InvestimentosTable({
  currentPage,
  queryAno,
  queryMes,
  queryCliente,
  queryBanco,
  queryAtivo,
  queryTipo,
  categoriaId,
}: InvestimentosTableProps) {
  // Buscar dados de investimentos
  const investimentos = await fetchFilteredInvestimentos(
    currentPage,
    queryAno,
    queryMes,
    queryCliente,
    queryBanco,
    queryAtivo,
    queryTipo,
    categoriaId
  );
  // console.log("investimentos**************************:", investimentos);

  // Calcular totais
  const totais = investimentos?.reduce(
    (acc, investimento) => ({
      rendimentoDoMes: acc.rendimentoDoMes + investimento.rendimentoDoMes,
      dividendosDoMes: acc.dividendosDoMes + investimento.dividendosDoMes,
      valorAplicado: acc.valorAplicado + investimento.valorAplicado,
      saldoBruto:
        acc.saldoBruto + Math.round(investimento.saldoBruto * 100) / 100,
      valorResgatado: acc.valorResgatado + investimento.valorResgatado,
      impostoIncorrido: acc.impostoIncorrido + investimento.impostoIncorrido,
      impostoPrevisto: acc.impostoPrevisto + investimento.impostoPrevisto,
      saldoLiquido: acc.saldoLiquido + investimento.saldoLiquido,
    }),
    {
      rendimentoDoMes: 0,
      dividendosDoMes: 0,
      valorAplicado: 0,
      saldoBruto: 0,
      valorResgatado: 0,
      impostoIncorrido: 0,
      impostoPrevisto: 0,
      saldoLiquido: 0,
    }
  );
  // console.log("totais**************************:", totais);
  return (
    <div className="mt-4 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Layout para dispositivos móveis */}
          <div className="md:hidden">
            {investimentos?.map((investimento) => (
              <MobileInvestimentoRow
                key={investimento.id}
                investimento={investimento}
              />
            ))}
            {investimentos?.length > 0 && <MobileTotals totais={totais} />}
          </div>
          {/* Layout para desktop */}
          <DesktopInvestimentosTable
            investimentos={investimentos}
            totais={totais}
          />
        </div>
      </div>
    </div>
  );
}
