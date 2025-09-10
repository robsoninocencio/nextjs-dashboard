import React, { useMemo } from "react";
import { ButtonLinkUpdate } from "@/app/ui/shared/buttonLinkUpdate";
import { ButtonLinkDelete } from "@/app/ui/investimentos/buttonLinkDelete";
import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import {
  formatCurrency,
  formatDateToYear,
  formatDateToMonth,
  formatToDecimals,
} from "@/lib/utils";
import { fetchFilteredInvestimentos } from "@/lib/investimentos/data";

// Tipagem inferida da função de busca para garantir consistência
type InvestimentoComRelacoes = Awaited<
  ReturnType<typeof fetchFilteredInvestimentos>
>[number];

type Totais = {
  rendimentoDoMes: number;
  dividendosDoMes: number;
  valorAplicado: number;
  saldoAnterior: number;
  saldoBruto: number;
  valorResgatado: number;
  impostoIncorrido: number;
  impostoPrevisto: number;
  saldoLiquido: number;
};

type GrupoInvestimento = {
  cliente: string;
  ano: string;
  mes: string;
  investimentos: InvestimentoComRelacoes[];
};

type GrupoInvestimentoComTotais = GrupoInvestimento & { totals: Totais };

// Helper para agrupar investimentos
const groupInvestimentos = (
  investimentos: InvestimentoComRelacoes[]
): Record<string, GrupoInvestimento> => {
  const grouped: Record<string, GrupoInvestimento> = {};
  if (!investimentos) return grouped;

  for (const inv of investimentos) {
    const key = `${inv.clientes.name}-${inv.ano}-${inv.mes}`;
    if (!grouped[key]) {
      grouped[key] = {
        cliente: inv.clientes.name,
        ano: inv.ano,
        mes: inv.mes,
        investimentos: [],
      };
    }
    grouped[key].investimentos.push(inv);
  }
  return grouped;
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
function MobileInvestimentoRow({
  investimento,
}: {
  investimento: InvestimentoComRelacoes;
}) {
  return (
    <div
      key={investimento.id}
      className="mb-4 w-full rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
    >
      {/* Card Header */}
      <div className="mb-3 flex items-start justify-between border-b border-gray-200 pb-3">
        <div>
          <p className="text-lg font-bold text-gray-900">
            {investimento.ativos.nome}
          </p>
          <p className="text-sm text-gray-500">{investimento.bancos.nome}</p>
        </div>
        <div className="text-right">
          <p className="text-base font-semibold text-gray-800">
            {investimento.clientes.name}
          </p>
          <p className="text-xs text-gray-500">
            {formatDateToMonth(investimento.data.toISOString())} /{" "}
            {formatDateToYear(investimento.data.toISOString())}
          </p>
        </div>
      </div>

      {/* Categories */}
      {investimento.ativos.ativo_categorias.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1">
          {investimento.ativos.ativo_categorias.map(({ categoria }) => (
            <Badge key={categoria.id} variant="outline">
              {categoria.nome}
            </Badge>
          ))}
        </div>
      )}

      {/* Financial Data */}
      <div className="space-y-2 text-sm">
        {[
          { label: "Saldo Anterior", value: investimento.saldoAnterior },
          { label: "Rendimento", value: investimento.rendimentoDoMes },
          { label: "Dividendos", value: investimento.dividendosDoMes },
          { label: "Aplicação", value: investimento.valorAplicado },
          { label: "Resgate", value: investimento.valorResgatado },
          {
            label: "Saldo Bruto",
            value: investimento.saldoBruto,
            isSeparator: true,
          },
          { label: "Imposto Incorrido", value: investimento.impostoIncorrido },
          { label: "Imposto Previsto", value: investimento.impostoPrevisto },
        ].map(
          ({ label, value, isSeparator }) =>
            value > 0 && (
              <div
                key={label}
                className={`flex justify-between ${isSeparator ? "border-t border-dashed pt-2" : ""}`}
              >
                <p className="text-gray-600">{label}</p>
                <p className="font-medium text-gray-800">
                  {formatCurrency(value)}
                </p>
              </div>
            )
        )}
      </div>

      {/* Totals and Actions */}
      <div className="mt-4 flex items-end justify-between border-t border-gray-200 pt-4">
        <div>
          <p className="text-sm text-gray-500">Saldo Líquido</p>
          <p className="text-xl font-bold text-blue-600">
            {formatCurrency(investimento.saldoLiquido)}
          </p>
        </div>
        <div className="flex justify-end gap-2">
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
function MobileTotals({ totais }: { totais: Totais }) {
  return (
    <div className="mb-1 w-full rounded-md bg-gray-100 p-3 mt-4 border-t-4 border-gray-200">
      <p className="text-lg font-bold mb-2 text-gray-800">Total Geral do Mês</p>
      {[
        { label: "Rendimento", value: totais.rendimentoDoMes },
        { label: "Dividendos", value: totais.dividendosDoMes },
        { label: "Valores Aplicados", value: totais.valorAplicado },
        { label: "Saldo Anterior", value: totais.saldoAnterior },
        { label: "Valores Resgatados", value: totais.valorResgatado },
        { label: "Saldo Bruto", value: totais.saldoBruto },
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

const calculatePercentage = (value: number, total: number) => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

type DesktopTableProps = {
  investimentos: InvestimentoComRelacoes[];
  totais: Totais;
};

function DesktopInvestimentosTable({
  investimentos,
  totais,
}: DesktopTableProps) {
  const groupedInvestimentos: GrupoInvestimentoComTotais[] = useMemo(() => {
    return Object.values(groupInvestimentos(investimentos)).map((group) => {
      // Calcula os totais para cada grupo
      const groupTotals = group.investimentos.reduce(
        (acc, inv) => {
          acc.rendimentoDoMes += inv.rendimentoDoMes;
          acc.dividendosDoMes += inv.dividendosDoMes;
          acc.valorAplicado += inv.valorAplicado;
          acc.saldoAnterior += inv.saldoAnterior;
          acc.saldoBruto += inv.saldoBruto;
          acc.valorResgatado += inv.valorResgatado;
          acc.impostoIncorrido += inv.impostoIncorrido;
          acc.impostoPrevisto += inv.impostoPrevisto;
          acc.saldoLiquido += inv.saldoLiquido;
          return acc;
        },
        {
          rendimentoDoMes: 0,
          dividendosDoMes: 0,
          valorAplicado: 0,
          saldoBruto: 0,
          saldoAnterior: 0,
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
  }, [investimentos]);

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

  const GroupHeaderRow = ({
    group,
    colSpan,
  }: {
    group: GrupoInvestimentoComTotais;
    colSpan: number;
  }) => {
    const evolucao = group.totals.saldoBruto - group.totals.saldoAnterior;
    const movimentacao =
      group.totals.valorAplicado - group.totals.valorResgatado;

    return (
      <tr className="border-y-2 border-gray-300 bg-gray-100">
        <td colSpan={colSpan} className="p-3 text-lg">
          <span className="font-bold text-gray-900">{group.cliente}</span>
          <span className="mx-2 text-gray-400">|</span>
          <span className="font-medium text-gray-700">
            {monthNames[group.mes]} de {group.ano}
          </span>
          <span className="float-right flex gap-6">
            <span>
              Evolução:{" "}
              <span
                className={`font-semibold ${evolucao >= 0 ? "text-green-700" : "text-red-700"}`}
              >
                {evolucao >= 0 ? (
                  <ArrowUpIcon className="mr-1 inline-block h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="mr-1 inline-block h-4 w-4" />
                )}
                {formatCurrency(Math.abs(evolucao))}
              </span>
            </span>
            <span>
              Movimentação:{" "}
              <span
                className={`font-semibold ${movimentacao >= 0 ? "text-green-700" : "text-red-700"}`}
              >
                {movimentacao >= 0 ? (
                  <ArrowUpIcon className="mr-1 inline-block h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="mr-1 inline-block h-4 w-4" />
                )}
                {formatCurrency(Math.abs(movimentacao))}
              </span>
            </span>
          </span>
        </td>
      </tr>
    );
  };

  const TableHeaderRow = ({
    visibleHeaders,
  }: {
    visibleHeaders: { label: string; key: string }[];
  }) => (
    <tr className="text-sm font-normal border-b-2 border-t-2 border-gray-300 bg-gray-100">
      {["Banco", "Ativo", "Tipo", "Categorias"].map((header) => (
        <th
          key={header}
          scope="col"
          className="align-top px-3 py-2 text-sm font-semibold text-gray-700 uppercase tracking-wide text-left"
        >
          {header}
        </th>
      ))}
      {visibleHeaders.map(({ label }) => (
        <th
          key={label}
          scope="col"
          className="align-top px-3 py-2 text-sm font-semibold text-gray-700 uppercase tracking-wide text-right"
        >
          {label}
        </th>
      ))}
      <th scope="col" className="relative py-1.5 pl-2 pr-3">
        <span className="sr-only">Ações</span>
      </th>
    </tr>
  );

  const headerConfig: {
    label: string;
    key: string;
    condition?: boolean;
    render: (
      data: any,
      type: "investment" | "group" | "grand"
    ) => React.ReactNode;
  }[] = [
    {
      label: "Saldo Anterior",
      key: "saldoAnterior",
      render: (data) => formatCurrency(data.saldoAnterior),
    },
    {
      label: "Rendimento",
      key: "rendimentoDoMes",
      render: (data) => formatCurrency(data.rendimentoDoMes),
    },
    {
      label: "Rendimento (%)",
      key: "percentualRendimentoDoMes",
      render: (data) =>
        formatToDecimals(
          calculatePercentage(
            data.rendimentoDoMes,
            data.saldoAnterior !== 0 ? data.saldoAnterior : data.valorAplicado
          ),
          6
        ),
    },
    {
      label: "Dividendo",
      key: "dividendosDoMes",
      condition: totais.dividendosDoMes > 0,
      render: (data) => formatCurrency(data.dividendosDoMes),
    },
    {
      label: "Dividendo (%)",
      key: "percentualDividendosDoMes",
      condition: totais.dividendosDoMes > 0,
      render: (data) =>
        formatToDecimals(
          calculatePercentage(
            data.dividendosDoMes,
            data.saldoAnterior !== 0 ? data.saldoAnterior : data.valorAplicado
          ),
          6
        ),
    },
    {
      label: "Rend + Div (%)",
      key: "percentualRendMaisDivDoMes",
      condition: totais.dividendosDoMes > 0,
      render: (data) =>
        formatToDecimals(
          calculatePercentage(
            data.rendimentoDoMes + data.dividendosDoMes,
            data.saldoAnterior !== 0 ? data.saldoAnterior : data.valorAplicado
          ),
          6
        ),
    },
    {
      label: "Aplicações",
      key: "valorAplicado",
      condition: totais.valorAplicado > 0,
      render: (data) => formatCurrency(data.valorAplicado),
    },
    {
      label: "Resgates",
      key: "valorResgatado",
      condition: totais.valorResgatado > 0,
      render: (data) => formatCurrency(data.valorResgatado),
    },
    {
      label: "Saldo Bruto",
      key: "saldoBruto",
      condition: totais.saldoBruto > 0,
      render: (data) => formatCurrency(data.saldoBruto),
    },
    {
      label: "% Cresc Bruto",
      key: "percentualDeCrescimentoSaldoBruto",
      render: (data, type) => {
        if (type === "investment") {
          return formatToDecimals(
            data.percentualDeCrescimentoSaldoBruto ?? 0,
            6
          );
        }
        const base =
          type === "grand"
            ? data.saldoAnterior
            : data.saldoAnterior !== 0
              ? data.saldoAnterior
              : data.valorAplicado;
        return formatToDecimals(
          calculatePercentage(data.saldoBruto - data.saldoAnterior, base),
          6
        );
      },
    },
    {
      label: "Imposto Incorrido",
      key: "impostoIncorrido",
      condition: totais.impostoIncorrido > 0,
      render: (data) => formatCurrency(data.impostoIncorrido),
    },
    {
      label: "Imposto Previsto",
      key: "impostoPrevisto",
      condition: totais.impostoPrevisto > 0,
      render: (data) => formatCurrency(data.impostoPrevisto),
    },
    {
      label: "Saldo Líquido",
      key: "saldoLiquido",
      render: (data) => formatCurrency(data.saldoLiquido),
    },
  ];

  const visibleHeaders = headerConfig.filter(
    ({ condition = true }) => condition
  );
  const colSpan = 4 + visibleHeaders.length + 1; // 4 estáticos + dinâmicos + 1 ações

  // Componente para renderizar as células de dados dinâmicas de uma linha
  const DynamicDataCells = ({
    data,
    visibleHeaders,
    type,
    cellClassName,
  }: {
    data: any;
    visibleHeaders: typeof headerConfig;
    type: "investment" | "group" | "grand";
    cellClassName: string;
  }) => (
    <>
      {visibleHeaders.map((header) => (
        <td key={header.key} className={cellClassName}>
          {header.render(data, type)}
        </td>
      ))}
    </>
  );

  const InvestmentRow = ({
    investimento,
  }: {
    investimento: InvestimentoComRelacoes;
  }) => (
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
          {investimento.ativos.ativo_categorias.map(({ categoria }) => (
            <Badge key={categoria.id} variant="secondary">
              {categoria.nome}
            </Badge>
          ))}
        </div>
      </td>
      <DynamicDataCells
        data={investimento}
        visibleHeaders={visibleHeaders}
        type="investment"
        cellClassName="whitespace-nowrap px-2 py-1.5 text-right align-top"
      />
      <td className="whitespace-nowrap py-1.5 pl-2 pr-3 align-top">
        <div className="flex justify-end gap-1">
          <ButtonLinkUpdate
            href={`/dashboard/investimentos/${investimento.id}/edit`}
          />
          <ButtonLinkDelete id={investimento.id} />
        </div>
      </td>
    </tr>
  );

  const GroupTotalRow = ({ groupTotals }: { groupTotals: Totais }) => (
    <tr className="border-t-2 border-b-4 border-gray-300 bg-gray-50 font-medium">
      <td
        colSpan={4}
        className="px-2 py-1.5 text-left font-semibold align-top "
      >
        Total do Grupo
      </td>
      <DynamicDataCells
        data={groupTotals}
        visibleHeaders={visibleHeaders}
        type="group"
        cellClassName="whitespace-nowrap px-2 py-1.5 text-right align-top"
      />
      <td className="whitespace-nowrap px-2 py-1.5 text-right align-top"></td>
    </tr>
  );

  const GrandTotalRow = ({ totais }: { totais: Totais }) => (
    <tfoot className="bg-gray-200 text-base font-bold border-t-4 border-gray-300">
      <tr>
        <td
          colSpan={4}
          className="px-3 py-3 text-left text-lg font-bold align-top"
        >
          Totais Geral
        </td>
        <DynamicDataCells
          data={totais}
          visibleHeaders={visibleHeaders}
          type="grand"
          cellClassName="whitespace-nowrap px-3 py-3 text-right align-top"
        />
        <td className="align-top"></td>
      </tr>
    </tfoot>
  );

  return (
    <div className="hidden md:block">
      <table className="min-w-full text-gray-900">
        <tbody className="bg-white">
          {groupedInvestimentos.map((group) => (
            <React.Fragment key={`${group.cliente}-${group.ano}-${group.mes}`}>
              <GroupHeaderRow group={group} colSpan={colSpan} />
              <TableHeaderRow visibleHeaders={visibleHeaders} />
              {group.investimentos.map((investimento) => (
                <InvestmentRow
                  key={investimento.id}
                  investimento={investimento}
                />
              ))}
              <GroupTotalRow groupTotals={group.totals} />
            </React.Fragment>
          ))}
        </tbody>
        {investimentos?.length > 0 && <GrandTotalRow totais={totais} />}
      </table>
    </div>
  );
}

// Componente principal
export default async function Table({
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

  // Calcular totais
  const totais: Totais = (investimentos || []).reduce(
    (acc, investimento) => ({
      rendimentoDoMes: acc.rendimentoDoMes + investimento.rendimentoDoMes,
      dividendosDoMes: acc.dividendosDoMes + investimento.dividendosDoMes,
      valorAplicado: acc.valorAplicado + investimento.valorAplicado,
      saldoAnterior: acc.saldoAnterior + investimento.saldoAnterior,
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
      saldoAnterior: 0,
      valorResgatado: 0,
      impostoIncorrido: 0,
      impostoPrevisto: 0,
      saldoLiquido: 0,
    }
  );
  // console.log("totais**************************:", totais);

  if (!investimentos || investimentos.length === 0) {
    return (
      <p className="mt-6 text-center text-gray-500">
        Nenhum investimento encontrado.
      </p>
    );
  }

  return (
    <div className="mt-4 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Layout para dispositivos móveis */}
          <div className="md:hidden">
            {investimentos.map((investimento) => (
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
