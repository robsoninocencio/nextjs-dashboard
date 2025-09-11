import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import { formatCurrency, formatToDecimals } from "@/lib/utils";
import {
  InvestimentoComRelacoes,
  Totais,
  GrupoInvestimento,
  GrupoInvestimentoComTotais,
} from "@/lib/investimentos/definitions";
import { ButtonLinkUpdate } from "@/app/ui/shared/buttonLinkUpdate";
import { ButtonLinkDelete } from "@/app/ui/investimentos/buttonLinkDelete";

type HeaderConfig = {
  label: string;
  key: string;
  condition?: boolean;
  render: (
    data: InvestimentoComRelacoes | Totais,
    type: "investment" | "group" | "grand"
  ) => React.ReactNode;
};

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

const calculatePercentage = (value: number, total: number) => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

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

const HeaderIndicator = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => {
  const isPositive = value >= 0;
  return (
    <span>
      {label}:{" "}
      <span
        className={`font-semibold ${
          isPositive ? "text-green-700" : "text-red-700"
        }`}
      >
        {isPositive ? (
          <ArrowUpIcon className="mr-1 inline-block h-4 w-4" />
        ) : (
          <ArrowDownIcon className="mr-1 inline-block h-4 w-4" />
        )}
        {formatCurrency(Math.abs(value))}
      </span>
    </span>
  );
};

const GroupHeaderRow = ({
  group,
  colSpan,
}: {
  group: GrupoInvestimentoComTotais;
  colSpan: number;
}) => {
  const evolucao = group.totals.saldoBruto - group.totals.saldoAnterior;
  const movimentacao = group.totals.valorAplicado - group.totals.valorResgatado;

  return (
    <tr className="border-y-2 border-gray-300 bg-gray-100">
      <td colSpan={colSpan} className="p-3 text-lg">
        <span className="font-bold text-gray-900">{group.cliente}</span>
        <span className="mx-2 text-gray-400">|</span>
        <span className="font-medium text-gray-700">
          {monthNames[group.mes]} de {group.ano}
        </span>
        <span className="float-right flex gap-6">
          <HeaderIndicator label="Evolução" value={evolucao} />
          <HeaderIndicator label="Movimentação" value={movimentacao} />
        </span>
      </td>
    </tr>
  );
};

const TableHeaderRow = ({
  visibleHeaders,
}: {
  visibleHeaders: HeaderConfig[];
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

// Componente para renderizar as células de dados dinâmicas de uma linha
const DynamicDataCells = ({
  data,
  visibleHeaders,
  type,
  cellClassName,
}: {
  data: InvestimentoComRelacoes | Totais;
  visibleHeaders: HeaderConfig[];
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
  visibleHeaders,
  searchParams,
}: {
  investimento: InvestimentoComRelacoes;
  visibleHeaders: HeaderConfig[];
  searchParams?: { [key: string]: string | string[] | undefined };
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
          href={{
            pathname: `/dashboard/investimentos/${investimento.id}/edit`,
            query: searchParams,
          }}
        />
        <ButtonLinkDelete id={investimento.id} />
      </div>
    </td>
  </tr>
);

const GroupTotalRow = ({
  groupTotals,
  visibleHeaders,
}: {
  groupTotals: Totais;
  visibleHeaders: HeaderConfig[];
}) => (
  <tr className="border-t-2 border-b-4 border-gray-300 bg-gray-50 font-medium">
    <td colSpan={4} className="px-2 py-1.5 text-left font-semibold align-top ">
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

const GrandTotalRow = ({
  totais,
  visibleHeaders,
}: {
  totais: Totais;
  visibleHeaders: HeaderConfig[];
}) => (
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

type DesktopTableProps = {
  investimentos: InvestimentoComRelacoes[];
  totais: Totais;
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function DesktopInvestimentosTable({
  investimentos,
  totais,
  searchParams,
}: DesktopTableProps) {
  const groupedInvestimentos: GrupoInvestimentoComTotais[] = useMemo(() => {
    if (!investimentos) {
      return [];
    }
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

  const { visibleHeaders, colSpan } = useMemo(() => {
    const headerConfig: HeaderConfig[] = [
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
    return { visibleHeaders, colSpan };
  }, [totais]);

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
                  visibleHeaders={visibleHeaders}
                  searchParams={searchParams}
                />
              ))}
              <GroupTotalRow
                groupTotals={group.totals}
                visibleHeaders={visibleHeaders}
              />
            </React.Fragment>
          ))}
        </tbody>
        {investimentos?.length > 0 && (
          <GrandTotalRow totais={totais} visibleHeaders={visibleHeaders} />
        )}
      </table>
    </div>
  );
}
