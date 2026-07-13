import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Divider,
  Drawer,
  Group,
  Pagination,
  SegmentedControl,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useData } from '../context/DataContext';
import { ESTADO_COLORS, ESTADO_LABELS, formatCurrency, formatDateTime } from '../lib/format';
import { nextEstados } from '../lib/orderStatus';
import { orderTotal } from '../lib/stats';
import type { EstadoPedido, Pedido } from '../types';

const PAGE_SIZE = 10;

type FiltroEstado = EstadoPedido | 'todos';

const FILTRO_OPTIONS: { label: string; value: FiltroEstado }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Pendientes', value: 'pendiente' },
  { label: 'Confirmados', value: 'confirmado' },
  { label: 'Entregados', value: 'entregado' },
  { label: 'Cancelados', value: 'cancelado' },
];

// Texto del boton de accion segun el estado destino
const ACCION_LABELS: Record<EstadoPedido, string> = {
  pendiente: '',
  confirmado: 'Confirmar pedido',
  entregado: 'Marcar como entregado',
  cancelado: 'Cancelar pedido',
};

function EstadoBadge({ estado }: { estado: EstadoPedido }) {
  return (
    <Badge color={ESTADO_COLORS[estado]} variant="light">
      {ESTADO_LABELS[estado]}
    </Badge>
  );
}

interface PedidoDetailProps {
  pedido: Pedido;
  onCambiarEstado: (nuevoEstado: EstadoPedido) => void;
}

function PedidoDetail({ pedido, onCambiarEstado }: PedidoDetailProps) {
  const { productos } = useData();
  const productoById = new Map(productos.map((p) => [p.id, p]));

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <div>
          <Text fw={600}>{pedido.cliente}</Text>
          <Text size="sm" c="dimmed">
            {formatDateTime(pedido.fecha)}
          </Text>
        </div>
        <EstadoBadge estado={pedido.estado} />
      </Group>

      <Divider />

      <Table verticalSpacing="xs">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Producto</Table.Th>
            <Table.Th ta="center">Cant.</Table.Th>
            <Table.Th ta="right">Unitario</Table.Th>
            <Table.Th ta="right">Subtotal</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {pedido.items.map((item) => (
            <Table.Tr key={item.productoId}>
              <Table.Td>{productoById.get(item.productoId)?.nombre ?? item.productoId}</Table.Td>
              <Table.Td ta="center">{item.cantidad}</Table.Td>
              <Table.Td ta="right">{formatCurrency(item.precioUnitario)}</Table.Td>
              <Table.Td ta="right">{formatCurrency(item.cantidad * item.precioUnitario)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group justify="flex-end">
        <Text fw={700}>Total: {formatCurrency(orderTotal(pedido))}</Text>
      </Group>

      {nextEstados(pedido.estado).length > 0 && (
        <>
          <Divider label="Cambiar estado" labelPosition="center" />
          <Group grow>
            {nextEstados(pedido.estado).map((estado) => (
              <Button
                key={estado}
                variant={estado === 'cancelado' ? 'light' : 'filled'}
                color={ESTADO_COLORS[estado]}
                onClick={() => onCambiarEstado(estado)}
              >
                {ACCION_LABELS[estado]}
              </Button>
            ))}
          </Group>
        </>
      )}
    </Stack>
  );
}

export function PedidosPage() {
  const { pedidos, cambiarEstadoPedido } = useData();
  const [filtro, setFiltro] = useState<FiltroEstado>('todos');
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 250);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return pedidos
      .filter(
        (p) =>
          (filtro === 'todos' || p.estado === filtro) && p.cliente.toLowerCase().includes(term),
      )
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [pedidos, filtro, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const selected = pedidos.find((p) => p.id === selectedId);

  return (
    <Stack gap="lg">
      <Title order={2}>Pedidos</Title>

      <Group justify="space-between" gap="sm">
        <SegmentedControl
          value={filtro}
          onChange={(value) => {
            setFiltro(value as FiltroEstado);
            setPage(1);
          }}
          data={FILTRO_OPTIONS}
        />
        <TextInput
          placeholder="Buscar por cliente"
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
            setPage(1);
          }}
          w={{ base: '100%', sm: 260 }}
        />
      </Group>

      <Card withBorder padding={0} radius="md">
        <Table.ScrollContainer minWidth={640}>
          <Table highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Número</Table.Th>
                <Table.Th>Cliente</Table.Th>
                <Table.Th>Fecha</Table.Th>
                <Table.Th ta="center">Ítems</Table.Th>
                <Table.Th ta="right">Total</Table.Th>
                <Table.Th>Estado</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {visible.map((pedido) => (
                <Table.Tr
                  key={pedido.id}
                  onClick={() => setSelectedId(pedido.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <Table.Td fw={600}>#{pedido.numero}</Table.Td>
                  <Table.Td>{pedido.cliente}</Table.Td>
                  <Table.Td>{formatDateTime(pedido.fecha)}</Table.Td>
                  <Table.Td ta="center">{pedido.items.length}</Table.Td>
                  <Table.Td ta="right">{formatCurrency(orderTotal(pedido))}</Table.Td>
                  <Table.Td>
                    <EstadoBadge estado={pedido.estado} />
                  </Table.Td>
                </Table.Tr>
              ))}
              {visible.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Text ta="center" c="dimmed" py="md">
                      No hay pedidos que coincidan con la búsqueda.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>

      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          {filtered.length} pedidos
        </Text>
        <Pagination value={currentPage} onChange={setPage} total={totalPages} />
      </Group>

      <Drawer
        opened={selected !== undefined}
        onClose={() => setSelectedId(null)}
        title={selected !== undefined ? `Pedido #${selected.numero}` : ''}
        position="right"
        size="md"
      >
        {selected !== undefined && (
          <PedidoDetail
            pedido={selected}
            onCambiarEstado={(estado) => cambiarEstadoPedido(selected.id, estado)}
          />
        )}
      </Drawer>
    </Stack>
  );
}
