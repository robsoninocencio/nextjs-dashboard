'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface DiversificationData {
  categoria?: string;
  banco?: string;
  valor: number;
  [key: string]: any; // Adiciona index signature para compatibilidade com recharts
}

interface DiversificationChartsProps {
  categoryData: DiversificationData[];
  bankData: DiversificationData[];
}

const COLORS = [
  '#2563eb', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#ec4899', // pink
  '#6b7280', // gray
];

export function DiversificationCharts({ categoryData, bankData }: DiversificationChartsProps) {
  const formatTooltipValue = (value: number) => {
    return [formatCurrency(value), 'Valor'];
  };

  const renderCustomizedLabel = (entry: any) => {
    return `${((entry.value / entry.total) * 100).toFixed(1)}%`;
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
      {/* Gráfico por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Categoria</CardTitle>
          <CardDescription>Diversificação do patrimônio por categoria de ativos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='valor'
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={formatTooltipValue} />
                <Legend formatter={value => value} wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico por Banco */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Banco</CardTitle>
          <CardDescription>Diversificação do patrimônio por instituição financeira</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={bankData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='valor'
                >
                  {bankData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={formatTooltipValue} />
                <Legend formatter={value => value} wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
