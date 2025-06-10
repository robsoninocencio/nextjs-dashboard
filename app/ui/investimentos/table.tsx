import { ButtonLinkUpdate } from "@/app/ui/shared/buttonLinkUpdate";

import {
  formatDateToLocal,
  formatCurrency,
  formatDateToYear,
  formatDateToMonth,
} from "@/lib/utils";

import { fetchFilteredInvestimentos } from "@/lib/investimentos/data";

import { ButtonLinkDelete } from "@/app/ui/investimentos/buttonLinkDelete";

export default async function InvestimentosTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const investimentos = await fetchFilteredInvestimentos(query, currentPage);

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

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 md:pt-0">
          <div className="md:hidden">
            {investimentos?.map((investimento) => (
              <div
                key={investimento.id}
                className="mb-2 w-full rounded-md bg-white p-2"
              >
                <div className="flex items-center justify-between pb-2">
                  <div className="flex flex-1">
                    <p className="text-xl font-medium">
                      {investimento.clientes.name}
                    </p>
                  </div>
                  <div className="flex flex-1 items-center justify-end gap-4">
                    <p>{formatDateToMonth(investimento.data.toISOString())}</p>
                    <p>{formatDateToYear(investimento.data.toISOString())}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pb-2">
                  <p className="text-xl font-medium">
                    {investimento.bancos.nome}
                  </p>
                  <p className="font-medium">{investimento.ativos.nome}</p>
                </div>
                <div className="flex items-center justify-between pb-2">
                  <p>Rendimento</p>
                  <p>{formatCurrency(investimento.rendimentoDoMes)}</p>
                </div>

                {investimento.valorAplicado > 0 && (
                  <div className="flex items-center justify-between pb-2">
                    <p>Aplicação</p>
                    <p>{formatCurrency(investimento.valorAplicado)}</p>
                  </div>
                )}

                {investimento.saldoBruto > 0 && (
                  <div className="flex items-center justify-between pb-2">
                    <p>Saldo Bruto</p>
                    <p>{formatCurrency(investimento.saldoBruto)}</p>
                  </div>
                )}

                {investimento.valorResgatado > 0 && (
                  <div className="flex items-center justify-between pb-2">
                    <p>Resgates</p>
                    <p>{formatCurrency(investimento.valorResgatado)}</p>
                  </div>
                )}

                {investimento.impostoIncorrido > 0 && (
                  <div className="flex items-center justify-between pb-2">
                    <p>Impostos Incorridos</p>
                    <p>{formatCurrency(investimento.impostoIncorrido)}</p>
                  </div>
                )}

                {investimento.impostoPrevisto > 0 && (
                  <div className="flex items-center justify-between pb-2">
                    <p>Impostos Previstos</p>
                    <p>{formatCurrency(investimento.impostoPrevisto)}</p>
                  </div>
                )}

                <div className="flex w-full items-center justify-between">
                  <div>
                    <p className="text-xl font-medium">Saldo Liquido</p>
                    <p className="text-xl font-medium">
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
            ))}
            {investimentos?.length > 0 && (
              <div className="mb-2 w-full rounded-md bg-white p-2">
                <div className="flex flex-1  mb-2">
                  <p className="text-xl font-medium">Total Geral do Mês</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center justify-between">
                    <p>Rendimento</p>
                    <p>{formatCurrency(totais.rendimentoDoMes)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center justify-between">
                    <p>Valores Aplicados</p>
                    <p>{formatCurrency(totais.valorAplicado)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center justify-between">
                    <p>Saldo Bruto</p>
                    <p>{formatCurrency(totais.saldoBruto)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center justify-between">
                    <p>Valores Resgatados</p>
                    <p>{formatCurrency(totais.valorResgatado)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center justify-between">
                    <p>Impostos Incorridos</p>
                    <p>{formatCurrency(totais.impostoIncorrido)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center justify-between">
                    <p>Impostos Previstos</p>
                    <p>{formatCurrency(totais.impostoPrevisto)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center justify-between">
                    <p>Saldo Líquido</p>
                    <p>{formatCurrency(totais.saldoLiquido)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-1 py-2 font-medium text-left">
                  Ano
                </th>
                <th scope="col" className="px-1 py-2 font-medium text-left">
                  Mês
                </th>
                <th scope="col" className="px-1 py-2 font-medium text-left">
                  Cliente
                </th>
                <th scope="col" className="px-1 py-2 font-medium text-left">
                  Banco
                </th>
                <th scope="col" className="px-1 py-2 font-medium text-left">
                  Ativo
                </th>
                <th scope="col" className="px-1 py-2 font-medium text-left">
                  Tipo
                </th>
                <th scope="col" className="px-1 py-2 font-medium text-right">
                  Rendimento
                </th>

                {totais.valorAplicado > 0 && (
                  <th scope="col" className="px-1 py-2 font-medium text-right">
                    Aplicações
                  </th>
                )}

                {totais.saldoBruto > 0 && (
                  <th scope="col" className="px-1 py-2 font-medium text-right">
                    Saldo Bruto
                  </th>
                )}

                {totais.valorResgatado > 0 && (
                  <th scope="col" className="px-1 py-2 font-medium text-right">
                    Resgates
                  </th>
                )}

                {totais.impostoIncorrido > 0 && (
                  <th scope="col" className="px-1 py-2 font-medium text-right">
                    Imposto Incorrido
                  </th>
                )}

                {totais.impostoPrevisto > 0 && (
                  <th scope="col" className="px-1 py-2 font-medium text-right">
                    Imposto Previsto
                  </th>
                )}

                <th scope="col" className="px-1 py-2 font-medium text-right">
                  Saldo Liquido
                </th>

                <th scope="col" className="relative py-2 pl-3 pr-2">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {investimentos?.map((investimento) => (
                <tr
                  key={investimento.id}
                  className="w-full border-b py-2 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-1 py-2 text-left">
                    {formatDateToYear(investimento.data.toISOString())}
                  </td>

                  <td className="whitespace-nowrap px-1 py-2 text-left">
                    {formatDateToMonth(investimento.data.toISOString())}
                  </td>

                  <td className="whitespace-nowrap px-1 py-2 text-left">
                    <p>{investimento.clientes.name}</p>
                  </td>

                  <td className="whitespace-nowrap px-1 py-2 text-left">
                    <p>{investimento.bancos.nome}</p>
                  </td>

                  <td className="whitespace-nowrap px-1 py-2 text-left">
                    <p>{investimento.ativos.nome}</p>
                  </td>

                  <td className="whitespace-nowrap px-1 py-2 text-left">
                    <p>{investimento.ativos.tipos?.nome}</p>
                  </td>

                  <td className="whitespace-nowrap px-1 py-2 text-right">
                    {formatCurrency(investimento.rendimentoDoMes)}
                  </td>

                  {totais.valorAplicado > 0 && (
                    <td className="whitespace-nowrap px-1 py-2 text-right">
                      {formatCurrency(investimento.valorAplicado)}
                    </td>
                  )}

                  {totais.saldoBruto > 0 && (
                    <td className="whitespace-nowrap px-1 py-2 text-right">
                      {formatCurrency(investimento.saldoBruto)}
                    </td>
                  )}

                  {totais.valorResgatado > 0 && (
                    <td className="whitespace-nowrap px-1 py-2 text-right">
                      {formatCurrency(investimento.valorResgatado)}
                    </td>
                  )}

                  {totais.impostoIncorrido > 0 && (
                    <td className="whitespace-nowrap px-1 py-2 text-right">
                      {formatCurrency(investimento.impostoIncorrido)}
                    </td>
                  )}

                  {totais.impostoPrevisto > 0 && (
                    <td className="whitespace-nowrap px-1 py-2 text-right">
                      {formatCurrency(investimento.impostoPrevisto)}
                    </td>
                  )}

                  <td className="whitespace-nowrap px-1 py-2 text-right">
                    {formatCurrency(investimento.saldoLiquido)}
                  </td>

                  <td className="whitespace-nowrap py-2 pl-3 pr-2">
                    <div className="flex justify-end gap-3">
                      <ButtonLinkUpdate
                        href={`/dashboard/investimentos/${investimento.id}/edit`}
                      />
                      <ButtonLinkDelete id={investimento.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Rodapé com totais */}
            {investimentos?.length > 0 && (
              <tfoot className="bg-gray-100 text-sm font-medium">
                <tr>
                  <td colSpan={6} className="px-1 py-2 text-lg font-medium">
                    Totais
                  </td>
                  <td className="whitespace-nowrap px-1 py-2 text-right">
                    {formatCurrency(totais.rendimentoDoMes)}
                  </td>

                  {totais.valorAplicado > 0 && (
                    <td className="whitespace-nowrap px-1 py-2 text-right">
                      {formatCurrency(totais.valorAplicado)}
                    </td>
                  )}

                  {totais.saldoBruto > 0 && (
                    <td className="whitespace-nowrap px-1 py-2 text-right">
                      {formatCurrency(totais.saldoBruto)}
                    </td>
                  )}

                  {totais.valorResgatado > 0 && (
                    <td className="whitespace-nowrap px-1 py-2 text-right">
                      {formatCurrency(totais.valorResgatado)}
                    </td>
                  )}

                  {totais.impostoIncorrido > 0 && (
                    <td className="whitespace-nowrap px-1 py-2 text-right">
                      {formatCurrency(totais.impostoIncorrido)}
                    </td>
                  )}

                  {totais.impostoPrevisto > 0 && (
                    <td className="whitespace-nowrap px-1 py-2 text-right">
                      {formatCurrency(totais.impostoPrevisto)}
                    </td>
                  )}

                  <td className="whitespace-nowrap px-1 py-2 text-right">
                    {formatCurrency(totais.saldoLiquido)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
