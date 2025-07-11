import { ButtonLinkUpdate } from "@/app/ui/shared/buttonLinkUpdate";
import { ButtonLinkDelete } from "@/app/ui/investimentos/buttonLinkDelete";
import {
  formatDateToLocal,
  formatCurrency,
  formatDateToYear,
  formatDateToMonth,
} from "@/lib/utils";
import {
  fetchFilteredInvestimentos,
  fetchInvestimentoGroupByClienteAnoMes,
} from "@/lib/investimentos/data";

// Interface para os props do componente
interface InvestimentosTableProps {
  currentPage: number;
  queryAno: string;
  queryMes: string;
  queryCliente: string;
  queryBanco: string;
  queryAtivo: string;
  queryTipo: string;
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
      <div className="flex items-center justify-between pb-1">
        <p>Rendimento</p>
        <p>{formatCurrency(investimento.rendimentoDoMes)}</p>
      </div>
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
    <div className="mb-1 w-full rounded-md bg-white p-2">
      <p className="text-lg font-medium mb-1">Total Geral do Mês</p>
      {[
        { label: "Rendimento", value: totais.rendimentoDoMes },
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
  investimentos: any[];
  totais: any;
}) {
  return (
    <table className="hidden min-w-full text-gray-900 md:table">
      <thead className="rounded-lg text-left text-sm font-normal">
        <tr>
          {["Ano", "Mês", "Cliente", "Banco", "Ativo", "Tipo"].map((header) => (
            <th
              key={header}
              scope="col"
              className="px-2 py-1.5 font-medium text-left"
            >
              {header}
            </th>
          ))}
          {[
            { label: "Rendimento", key: "rendimentoDoMes" },
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
          ].map(
            ({ label, condition = true }) =>
              condition && (
                <th
                  key={label}
                  scope="col"
                  className="px-2 py-1.5 font-medium text-right"
                >
                  {label}
                </th>
              )
          )}
          <th scope="col" className="relative py-1.5 pl-2 pr-3">
            <span className="sr-only">Ações</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {investimentos?.map((investimento) => (
          <tr
            key={investimento.id}
            className="border-b text-sm last:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
          >
            <td className="whitespace-nowrap px-2 py-1.5">
              {formatDateToYear(investimento.data.toISOString())}
            </td>
            <td className="whitespace-nowrap px-2 py-1.5">
              {formatDateToMonth(investimento.data.toISOString())}
            </td>
            <td className="whitespace-nowrap px-2 py-1.5">
              {investimento.clientes.name}
            </td>
            <td className="whitespace-nowrap px-2 py-1.5">
              {investimento.bancos.nome}
            </td>
            <td className="whitespace-nowrap px-2 py-1.5">
              {investimento.ativos.nome}
            </td>
            <td className="whitespace-nowrap px-2 py-1.5">
              {investimento.ativos.tipos?.nome}
            </td>
            <td className="whitespace-nowrap px-2 py-1.5 text-right">
              {formatCurrency(investimento.rendimentoDoMes)}
            </td>
            {totais.valorAplicado > 0 && (
              <td className="whitespace-nowrap px-2 py-1.5 text-right">
                {formatCurrency(investimento.valorAplicado)}
              </td>
            )}
            {totais.saldoBruto > 0 && (
              <td className="whitespace-nowrap px-2 py-1.5 text-right">
                {formatCurrency(investimento.saldoBruto)}
              </td>
            )}
            {totais.valorResgatado > 0 && (
              <td className="whitespace-nowrap px-2 py-1.5 text-right">
                {formatCurrency(investimento.valorResgatado)}
              </td>
            )}
            {totais.impostoIncorrido > 0 && (
              <td className="whitespace-nowrap px-2 py-1.5 text-right">
                {formatCurrency(investimento.impostoIncorrido)}
              </td>
            )}
            {totais.impostoPrevisto > 0 && (
              <td className="whitespace-nowrap px-2 py-1.5 text-right">
                {formatCurrency(investimento.impostoPrevisto)}
              </td>
            )}
            <td className="whitespace-nowrap px-2 py-1.5 text-right">
              {formatCurrency(investimento.saldoLiquido)}
            </td>
            <td className="whitespace-nowrap py-1.5 pl-2 pr-3">
              <div className="flex justify-end gap-1">
                <ButtonLinkUpdate
                  href={`/dashboard/investimentos/${investimento.id}/edit`}
                />
                <ButtonLinkDelete id={investimento.id} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      {investimentos?.length > 0 && (
        <tfoot className="bg-gray-100 text-sm font-medium">
          <tr>
            <td colSpan={6} className="px-2 py-1.5 text-lg font-medium">
              Totais
            </td>
            <td className="whitespace-nowrap px-2 py-1.5 text-right">
              {formatCurrency(totais.rendimentoDoMes)}
            </td>
            {totais.valorAplicado > 0 && (
              <td className="whitespace-nowrap px-2 py-1.5 text-right">
                {formatCurrency(totais.valorAplicado)}
              </td>
            )}
            {totais.saldoBruto > 0 && (
              <td className="whitespace-nowrap px-2 py-1.5 text-right">
                {formatCurrency(totais.saldoBruto)}
              </td>
            )}
            {totais.valorResgatado > 0 && (
              <td className="whitespace-nowrap px-2 py-1.5 text-right">
                {formatCurrency(totais.valorResgatado)}
              </td>
            )}
            {totais.impostoIncorrido > 0 && (
              <td className="whitespace-nowrap px-2 py-1.5 text-right">
                {formatCurrency(totais.impostoIncorrido)}
              </td>
            )}
            {totais.impostoPrevisto > 0 && (
              <td className="whitespace-nowrap px-2 py-1.5 text-right">
                {formatCurrency(totais.impostoPrevisto)}
              </td>
            )}
            <td className="whitespace-nowrap px-2 py-1.5 text-right">
              {formatCurrency(totais.saldoLiquido)}
            </td>
            <td></td>
          </tr>
        </tfoot>
      )}
    </table>
  );
}

// Componente para exibir a tabela de investimentos agrupados por cliente
function DesktopGroupedInvestimentosTable({
  grupoInvestimentos,
}: {
  grupoInvestimentos: any[];
}) {
  return (
    <table className="hidden min-w-full text-gray-900 md:table bg-white mt-4">
      <thead className="rounded-lg text-left text-sm font-normal">
        <tr>
          <th scope="col" className="px-2 py-1.5 font-medium text-left">
            Clientes
          </th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {grupoInvestimentos?.map((grupo) => (
          <tr
            key={grupo.Cliente}
            className="border-b text-sm last:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
          >
            <td className="px-2 py-1.5">
              <div className="font-medium">{grupo.Cliente}</div>
              <table className="min-w-full text-gray-900 mt-2">
                <thead className="text-left text-sm font-normal">
                  <tr>
                    {[
                      "Ano",
                      "Mês",
                      "Rendimento",
                      "Valor Aplicado",
                      "Saldo Bruto",
                      "Valor Resgatado",
                      "Imposto Incorrido",
                      "Imposto Previsto",
                      "Saldo Líquido",
                    ].map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-2 py-1.5 font-medium text-left"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grupo.investimentos?.map((grupoInvestimento: any) => (
                    <tr
                      key={`${grupo.Cliente}-${grupoInvestimento.ano}-${grupoInvestimento.mes}`}
                      className="border-b text-sm last:border-none"
                    >
                      <td className="whitespace-nowrap px-2 py-1.5">
                        {grupoInvestimento.ano}
                      </td>
                      <td className="whitespace-nowrap px-2 py-1.5">
                        {grupoInvestimento.mes}
                      </td>
                      <td className="whitespace-nowrap px-2 py-1.5">
                        {formatCurrency(grupoInvestimento.rendimentoDoMes)}
                      </td>
                      <td className="whitespace-nowrap px-2 py-1.5">
                        {formatCurrency(grupoInvestimento.valorAplicado)}
                      </td>
                      <td className="whitespace-nowrap px-2 py-1.5">
                        {formatCurrency(grupoInvestimento.saldoBruto)}
                      </td>
                      <td className="whitespace-nowrap px-2 py-1.5">
                        {formatCurrency(grupoInvestimento.valorResgatado)}
                      </td>
                      <td className="whitespace-nowrap px-2 py-1.5">
                        {formatCurrency(grupoInvestimento.impostoIncorrido)}
                      </td>
                      <td className="whitespace-nowrap px-2 py-1.5">
                        {formatCurrency(grupoInvestimento.impostoPrevisto)}
                      </td>
                      <td className="whitespace-nowrap px-2 py-1.5">
                        {formatCurrency(grupoInvestimento.saldoLiquido)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
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
}: InvestimentosTableProps) {
  // Buscar dados de investimentos
  const investimentos = await fetchFilteredInvestimentos(
    currentPage,
    queryAno,
    queryMes,
    queryCliente,
    queryBanco,
    queryAtivo,
    queryTipo
  );

  // Calcular totais
  const totais = investimentos?.reduce(
    (acc, investimento) => ({
      rendimentoDoMes: acc.rendimentoDoMes + investimento.rendimentoDoMes,
      valorAplicado: acc.valorAplicado + investimento.valorAplicado,
      saldoBruto: acc.saldoBruto + investimento.saldoBruto,
      valorResgatado: acc.valorResgatado + investimento.valorResgatado,
      impostoIncorrido: acc.impostoIncorrido + investimento.impostoIncorrido,
      impostoPrevisto: acc.impostoPrevisto + investimento.impostoPrevisto,
      saldoLiquido: acc.saldoLiquido + investimento.saldoLiquido,
    }),
    {
      rendimentoDoMes: 0,
      valorAplicado: 0,
      saldoBruto: 0,
      valorResgatado: 0,
      impostoIncorrido: 0,
      impostoPrevisto: 0,
      saldoLiquido: 0,
    }
  );

  // Buscar dados agrupados por cliente, ano e mês
  const grupoInvestimentos = await fetchInvestimentoGroupByClienteAnoMes();

  return (
    <div className="mt-4 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2">
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
          <DesktopGroupedInvestimentosTable
            grupoInvestimentos={grupoInvestimentos}
          />
        </div>
      </div>
    </div>
  );
}
