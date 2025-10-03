'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Banknote, Receipt } from 'lucide-react';

interface MetricsData {
  totalInvestido: number;
  totalResgatado: number;
  totalRendimento: number;
  totalDividendos: number;
  saldoBrutoAtual: number;
  saldoLiquidoAtual: number;
  totalImpostos: number;
  totalAtivos: number;
}

interface MetricsCardsProps {
  data: MetricsData;
}

export function MetricsCards({ data }: MetricsCardsProps) {
  const cards = [
    {
      title: 'Total Investido',
      value: data.totalInvestido,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Saldo Bruto Atual',
      value: data.saldoBrutoAtual,
      icon: Banknote,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Saldo Líquido Atual',
      value: data.saldoLiquidoAtual,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Total Rendimentos',
      value: data.totalRendimento,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Dividendos',
      value: data.totalDividendos,
      icon: Receipt,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Total Resgatado',
      value: data.totalResgatado,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Total Impostos',
      value: data.totalImpostos,
      icon: Receipt,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      title: 'Total de Ativos',
      value: data.totalAtivos,
      icon: PieChart,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      isCount: true,
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className='hover:shadow-md transition-shadow'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {card.isCount ? card.value : formatCurrency(card.value)}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
