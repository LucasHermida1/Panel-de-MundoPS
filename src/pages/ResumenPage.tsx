import { useMemo } from 'react';
import { Card, SimpleGrid, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { pedidos } from '../data/pedidos';
import { productos } from '../data/productos';
import { CATEGORIA_LABELS, formatCurrency, formatShortDate } from '../lib/format';
import {
  averageTicket,
  getLatestOrderDate,
  monthlyOrderCount,
  monthlySalesTotal,
  salesByCategory,
  salesByDay,
  topSellingProduct,
} from '../lib/stats';

interface KpiCardProps {
  label: string;
  value: string;
  detail?: string;
}

function KpiCard({ label, value, detail }: KpiCardProps) {
  return (
    <Card withBorder padding="lg" radius="md">
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <Text size="xl" fw={700} mt={4}>
        {value}
      </Text>
      {detail !== undefined && (
        <Text size="xs" c="dimmed" mt={4}>
          {detail}
        </Text>
      )}
    </Card>
  );
}

export function ResumenPage() {
  const theme = useMantineTheme();
  const chartColor = theme.colors[theme.primaryColor][6];

  const stats = useMemo(() => {
    const referenceDay = getLatestOrderDate(pedidos);
    return {
      referenceDay,
      ventasDelMes: monthlySalesTotal(pedidos, referenceDay),
      cantidadPedidos: monthlyOrderCount(pedidos, referenceDay),
      ticketPromedio: averageTicket(pedidos, referenceDay),
      masVendido: topSellingProduct(pedidos, productos),
      porDia: salesByDay(pedidos, 30, referenceDay),
      porCategoria: salesByCategory(pedidos, productos),
    };
  }, []);

  const dailyChartData = stats.porDia.map((d) => ({
    dia: formatShortDate(d.fecha),
    total: d.total,
  }));

  const categoryChartData = stats.porCategoria.map((c) => ({
    categoria: CATEGORIA_LABELS[c.categoria],
    total: c.total,
  }));

  return (
    <Stack gap="lg">
      <Title order={2}>Resumen</Title>

      <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }}>
        <KpiCard
          label="Ventas del mes"
          value={formatCurrency(stats.ventasDelMes)}
          detail={`Mes de referencia: ${stats.referenceDay.slice(0, 7)}`}
        />
        <KpiCard
          label="Pedidos del mes"
          value={String(stats.cantidadPedidos)}
          detail="Excluye cancelados"
        />
        <KpiCard label="Ticket promedio" value={formatCurrency(stats.ticketPromedio)} />
        <KpiCard
          label="Más vendido"
          value={stats.masVendido?.producto.nombre ?? 'Sin ventas'}
          detail={stats.masVendido !== null ? `${stats.masVendido.unidades} unidades` : undefined}
        />
      </SimpleGrid>

      <Card withBorder padding="lg" radius="md">
        <Text fw={600} mb="md">
          Ventas por día (últimos 30 días)
        </Text>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={dailyChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" interval={4} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} width={70} tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => [formatCurrency(value), 'Ventas']} />
            <Line type="monotone" dataKey="total" stroke={chartColor} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card withBorder padding="lg" radius="md">
        <Text fw={600} mb="md">
          Ventas por categoría
        </Text>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={categoryChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} width={70} tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => [formatCurrency(value), 'Ventas']} />
            <Bar dataKey="total" fill={chartColor} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Stack>
  );
}
