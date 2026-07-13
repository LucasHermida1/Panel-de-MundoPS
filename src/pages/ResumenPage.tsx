import { useMemo, type ReactNode } from 'react';
import {
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconCoin, IconReceipt2, IconReportMoney, IconTrophy } from '@tabler/icons-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useData } from '../context/DataContext';
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
  icon: ReactNode;
  detail?: string;
}

function KpiCard({ label, value, icon, detail }: KpiCardProps) {
  return (
    <Card withBorder padding="lg" radius="md">
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <div>
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
        </div>
        <ThemeIcon size={40} radius="md" variant="light">
          {icon}
        </ThemeIcon>
      </Group>
    </Card>
  );
}

export function ResumenPage() {
  const theme = useMantineTheme();
  const chartColor = theme.colors[theme.primaryColor][6];
  const { pedidos, productos } = useData();

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
  }, [pedidos, productos]);

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
          icon={<IconCoin size={22} stroke={1.6} />}
          detail={`Mes de referencia: ${stats.referenceDay.slice(0, 7)}`}
        />
        <KpiCard
          label="Pedidos del mes"
          value={String(stats.cantidadPedidos)}
          icon={<IconReceipt2 size={22} stroke={1.6} />}
          detail="Excluye cancelados"
        />
        <KpiCard
          label="Ticket promedio"
          value={formatCurrency(stats.ticketPromedio)}
          icon={<IconReportMoney size={22} stroke={1.6} />}
        />
        <KpiCard
          label="Más vendido"
          value={stats.masVendido?.producto.nombre ?? 'Sin ventas'}
          icon={<IconTrophy size={22} stroke={1.6} />}
          detail={stats.masVendido !== null ? `${stats.masVendido.unidades} unidades` : undefined}
        />
      </SimpleGrid>

      <Card withBorder padding="lg" radius="md">
        <Text fw={600} mb="md">
          Ventas por día (últimos 30 días)
        </Text>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={dailyChartData}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.35} />
                <stop offset="100%" stopColor={chartColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="dia" interval={4} tick={{ fontSize: 12 }} tickLine={false} />
            <YAxis
              tick={{ fontSize: 12 }}
              width={80}
              tickFormatter={formatCurrency}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip formatter={(value: number) => [formatCurrency(value), 'Ventas']} />
            <Area
              type="monotone"
              dataKey="total"
              stroke={chartColor}
              strokeWidth={2}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card withBorder padding="lg" radius="md">
        <Text fw={600} mb="md">
          Ventas por categoría
        </Text>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={categoryChartData} barSize={48}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="categoria" tick={{ fontSize: 12 }} tickLine={false} />
            <YAxis
              tick={{ fontSize: 12 }}
              width={80}
              tickFormatter={formatCurrency}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Ventas']}
              cursor={{ fill: 'rgba(0, 112, 209, 0.06)' }}
            />
            <Bar dataKey="total" fill={chartColor} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Stack>
  );
}
