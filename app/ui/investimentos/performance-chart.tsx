'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

import { Decimal } from '@prisma/client/runtime/library';

interface PerformanceData {
  periodo: string;
  ano: string;
  mes: string;
  saldoBruto: number | Decimal;
  rendimentoDoMes: number | Decimal;
  dividendosDoMes: number | Decimal;
  valorAplicado: number | Decimal;
  valorResgatado: number | Decimal;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'Saldo Bruto') {
      return [formatCurrency(value), name];
    }
    return [formatCurrency(value), name];
  };

  const formatYAxisLabel = (value: number) => {
    return formatCurrency(value);
  };

  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle>Evolução do Patrimônio</CardTitle>
        <CardDescription>Acompanhe a evolução do seu saldo bruto ao longo do tempo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
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
              <Line
                type='monotone'
                dataKey='saldoBruto'
                stroke='#2563eb'
                strokeWidth={2}
                name='Saldo Bruto'
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
