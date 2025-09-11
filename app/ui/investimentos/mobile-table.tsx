import { Badge } from "@/components/ui/badge";
import {
  InvestimentoComRelacoes,
  Totais,
} from "@/lib/investimentos/definitions";
import {
  formatCurrency,
  formatDateToMonth,
  formatDateToYear,
} from "@/lib/utils";
import { ButtonLinkDelete } from "@/app/ui/investimentos/buttonLinkDelete";
import { ButtonLinkUpdate } from "@/app/ui/shared/buttonLinkUpdate";

// Tipos e dados para a lista financeira do card mobile
type FinancialDataKey = keyof Pick<
  InvestimentoComRelacoes,
  | "saldoAnterior"
  | "rendimentoDoMes"
  | "dividendosDoMes"
  | "valorAplicado"
  | "valorResgatado"
  | "saldoBruto"
  | "impostoIncorrido"
  | "impostoPrevisto"
>;

type FinancialDataField = {
  key: FinancialDataKey;
  label: string;
  isSeparator?: boolean;
};

const financialDataFields: FinancialDataField[] = [
  { key: "saldoAnterior", label: "Saldo Anterior" },
  { key: "rendimentoDoMes", label: "Rendimento" },
  { key: "dividendosDoMes", label: "Dividendos" },
  { key: "valorAplicado", label: "Aplicação" },
  { key: "valorResgatado", label: "Resgate" },
  { key: "saldoBruto", label: "Saldo Bruto", isSeparator: true },
  { key: "impostoIncorrido", label: "Imposto Incorrido" },
  { key: "impostoPrevisto", label: "Imposto Previsto" },
];

const FinancialDataList = ({
  investimento,
}: {
  investimento: InvestimentoComRelacoes;
}) => (
  <div className="space-y-2 text-sm">
    {financialDataFields.map(({ key, label, isSeparator }) => {
      const value = investimento[key];
      if (typeof value === "number" && value > 0) {
        return (
          <div
            key={label}
            className={`flex justify-between ${isSeparator ? "border-t border-dashed pt-2" : ""}`}
          >
            <p className="text-gray-600">{label}</p>
            <p className="font-medium text-gray-800">{formatCurrency(value)}</p>
          </div>
        );
      }
      return null;
    })}
  </div>
);

// Componente para exibir uma linha de investimento no layout mobile
export function MobileInvestimentoRow({
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
      <FinancialDataList investimento={investimento} />

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
export function MobileTotals({ totais }: { totais: Totais }) {
  return (
    <div className="mb-1 w-full rounded-md bg-gray-100 p-3 mt-4 border-t-4 border-gray-200">
      <p className="text-lg font-bold mb-2 text-gray-800">Total Geral do Mês</p>
      {Object.entries(totais).flatMap(([key, value]) => {
        if (typeof value === "number" && value > 0) {
          return [
            <div key={key} className="flex items-center justify-between pb-1">
              <p>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </p>
              <p>{formatCurrency(value)}</p>
            </div>,
          ];
        }
        return [];
      })}
    </div>
  );
}
