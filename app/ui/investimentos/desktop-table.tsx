import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
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
    <div className="flex items-center gap-1">
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span
        className={`font-semibold flex items-center gap-1 ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {isPositive ? (
          <ArrowUpIcon className="h-4 w-4" />
        ) : (
          <ArrowDownIcon className="h-4 w-4" />
        )}
        {formatCurrency(Math.abs(value))}
      </span>
    </div>
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
    <TableRow className="border-y-2 border-muted bg-muted/50 hover:bg-muted/70 transition-colors">
      <TableCell colSpan={colSpan} className="p-4 text-lg font-semibold">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-foreground font-bold">{group.cliente}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground font-medium">
              {monthNames[group.mes]} de {group.ano}
            </span>
          </div>
          <div className="flex gap-6">
            <HeaderIndicator label="Evolução" value={evolucao} />
            <HeaderIndicator label="Movimentação" value={movimentacao} />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

const TableHeaderRow = ({
  visibleHeaders,
}: {
  visibleHeaders: HeaderConfig[];
}) => (
  <TableRow className="border-b-2 border-muted bg-muted/30 hover:bg-muted/50 transition-colors">
    {["Banco", "Ativo", "Tipo", "Categorias"].map((header) => (
      <TableHead
        key={header}
        className="px-4 py-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide text-left"
      >
        {header}
      </TableHead>
    ))}
    {visibleHeaders.map(({ label }) => (
      <TableHead
        key={label}
        className="px-4 py-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide text-right"
      >
        {label}
      </TableHead>
    ))}
    <TableHead className="px-4 py-3 text-right">
      <span className="sr-only">Ações</span>
    </TableHead>
  </TableRow>
);

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
      <TableCell key={header.key} className={cellClassName}>
        {header.render(data, type)}
      </TableCell>
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
  <TableRow
    key={investimento.id}
    className="border-b text-sm last:border-none rounded-none first:rounded-tl-lg first:rounded-tr-lg last:rounded-bl-lg last:rounded-br-lg"
  >
    <TableCell className="whitespace-nowrap px-2 py-1.5 align-top">
      {investimento.bancos.nome}
    </TableCell>
    <TableCell className="whitespace-nowrap px-2 py-1.5 align-top">
      {investimento.ativos.nome}
    </TableCell>
    <TableCell className="whitespace-nowrap px-2 py-1.5 align-top">
      {investimento.ativos.tipos?.nome}
    </TableCell>
    <TableCell className="whitespace-nowrap px-2 py-1.5 align-top">
      <div className="flex flex-wrap gap-1">
        {investimento.ativos.ativo_categorias.map(({ categoria }) => (
          <Badge key={categoria.id} variant="secondary">
            {categoria.nome}
          </Badge>
        ))}
      </div>
    </TableCell>
    <DynamicDataCells
      data={investimento}
      visibleHeaders={visibleHeaders}
      type="investment"
      cellClassName="whitespace-nowrap px-2 py-1.5 text-right align-top"
    />
    <TableCell className="whitespace-nowrap py-1.5 pl-2 pr-3 align-top">
      <div className="flex justify-end gap-1">
        <ButtonLinkUpdate
          href={{
            pathname: `/dashboard/investimentos/${investimento.id}/edit`,
            query: searchParams,
          }}
        />
        <ButtonLinkDelete id={investimento.id} />
      </div>
    </TableCell>
  </TableRow>
);

const GroupTotalRow = ({
  groupTotals,
  visibleHeaders,
}: {
  groupTotals: Totais;
  visibleHeaders: HeaderConfig[];
}) => (
  <TableRow className="border-t-2 border-b-4 border-muted bg-accent/20 font-semibold hover:bg-accent/50 transition-colors">
    <TableCell
      colSpan={4}
      className="px-2 py-1.5 text-left font-bold align-top text-accent-foreground"
    >
      Total do Grupo
    </TableCell>
    <DynamicDataCells
      data={groupTotals}
      visibleHeaders={visibleHeaders}
      type="group"
      cellClassName="whitespace-nowrap px-2 py-1.5 text-right align-top font-semibold"
    />
    <TableCell className="whitespace-nowrap px-2 py-1.5 text-right align-top"></TableCell>
  </TableRow>
);

const GrandTotalRow = ({
  totais,
  visibleHeaders,
}: {
  totais: Totais;
  visibleHeaders: HeaderConfig[];
}) => (
  <TableFooter className="bg-primary/5 text-base font-bold border-t-4 border-primary/20">
    <TableRow className="hover:bg-primary/10 transition-colors">
      <TableCell
        colSpan={4}
        className="px-2 py-4 text-left font-bold text-lg align-top text-primary"
      >
        Totais Geral
      </TableCell>
      <DynamicDataCells
        data={totais}
        visibleHeaders={visibleHeaders}
        type="grand"
        cellClassName="whitespace-nowrap px-4 py-4 text-right align-top font-bold text-primary"
      />
      <TableCell className="whitespace-nowrap px-4 py-4 text-right align-top"></TableCell>
    </TableRow>
  </TableFooter>
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
      <Table className="min-w-full text-gray-900">
        <TableBody className="bg-white">
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
        </TableBody>
        {investimentos?.length > 0 && (
          <GrandTotalRow totais={totais} visibleHeaders={visibleHeaders} />
        )}
      </Table>
    </div>
  );
}
