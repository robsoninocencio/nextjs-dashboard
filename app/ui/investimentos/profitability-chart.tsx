'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface PerformanceData {
  periodo: string;
  ano: string;
  mes: string;
  saldoBruto: number;
  rendimentoDoMes: number;
  dividendosDoMes: number;
  valorAplicado: number;
  valorResgatado: number;
}

interface ProfitabilityChartProps {
  data: PerformanceData[];
}

export function ProfitabilityChart({ data }: ProfitabilityChartProps) {
  const formatTooltipValue = (value: number, name: string) => {
    return [formatCurrency(value), name];
  };

  const formatYAxisLabel = (value: number) => {
    return formatCurrency(value);
  };

  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle>Análise de Rentabilidade por Período</CardTitle>
        <CardDescription>Rendimentos e dividendos mensais ao longo do tempo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='periodo'
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor='end'
                height={60}
              />
              <YAxis tickFormatter={formatYAxisLabel} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={formatTooltipValue}
                labelFormatter={label => `Período: ${label}`}
              />
              <Legend />
              <Bar
                dataKey='rendimentoDoMes'
                fill='#10b981'
                name='Rendimento do Mês'
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey='dividendosDoMes'
                fill='#f59e0b'
                name='Dividendos do Mês'
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
