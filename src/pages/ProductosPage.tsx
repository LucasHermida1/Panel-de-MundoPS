import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Group,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconCloudDownload,
  IconDeviceGamepad2,
  IconDeviceTv,
  IconHeadphones,
  IconPencil,
  IconPlus,
  type Icon,
} from '@tabler/icons-react';
import { useData } from '../context/DataContext';
import { CATEGORIA_LABELS, formatCurrency } from '../lib/format';
import { isLowStock, isValidOferta } from '../lib/productRules';
import type { CategoriaProducto, Producto } from '../types';

const CATEGORIA_ICONS: Record<CategoriaProducto, Icon> = {
  juegos: IconDeviceGamepad2,
  accesorios: IconHeadphones,
  consolas: IconDeviceTv,
  digital: IconCloudDownload,
};

const CATEGORIA_GRADIENTS: Record<CategoriaProducto, string> = {
  juegos: 'linear-gradient(135deg, #0070d1, #003791)',
  accesorios: 'linear-gradient(135deg, #12b886, #087f5b)',
  consolas: 'linear-gradient(135deg, #7048e8, #5f3dc4)',
  digital: 'linear-gradient(135deg, #f76707, #e8590c)',
};

const CATEGORIA_OPTIONS = (Object.keys(CATEGORIA_LABELS) as CategoriaProducto[]).map((value) => ({
  value,
  label: CATEGORIA_LABELS[value],
}));

function StockBadge({ stock }: { stock: number | null }) {
  if (stock === null) {
    return (
      <Badge color="gray" variant="light">
        Ilimitado
      </Badge>
    );
  }
  if (isLowStock(stock)) {
    return <Badge color="red">Quedan {stock}</Badge>;
  }
  return (
    <Badge color="gray" variant="light">
      Stock: {stock}
    </Badge>
  );
}

interface ProductoCardProps {
  producto: Producto;
  onEdit: () => void;
}

function ProductoCard({ producto, onEdit }: ProductoCardProps) {
  const CategoriaIcon = CATEGORIA_ICONS[producto.categoria];
  const enOferta = producto.precioOferta !== undefined;

  return (
    <Card withBorder radius="md" padding="md">
      <Card.Section
        style={{
          background: CATEGORIA_GRADIENTS[producto.categoria],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 110,
        }}
      >
        <CategoriaIcon size={44} stroke={1.2} color="white" />
      </Card.Section>

      <Stack gap="xs" mt="md">
        <Group justify="space-between" gap="xs">
          <Badge variant="light">{CATEGORIA_LABELS[producto.categoria]}</Badge>
          <StockBadge stock={producto.stock} />
        </Group>

        <Text fw={600} lineClamp={1} title={producto.nombre}>
          {producto.nombre}
        </Text>

        <Group gap="xs" align="baseline">
          {enOferta ? (
            <>
              <Text fw={700}>{formatCurrency(producto.precioOferta ?? 0)}</Text>
              <Text size="sm" c="dimmed" td="line-through">
                {formatCurrency(producto.precio)}
              </Text>
              <Badge color="orange" size="sm">
                Oferta
              </Badge>
            </>
          ) : (
            <Text fw={700}>{formatCurrency(producto.precio)}</Text>
          )}
        </Group>

        {producto.descripcion !== undefined && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {producto.descripcion}
          </Text>
        )}

        <Button variant="light" leftSection={<IconPencil size={16} />} onClick={onEdit} mt="xs">
          Editar
        </Button>
      </Stack>
    </Card>
  );
}

// El formulario maneja sus propios tipos: NumberInput usa '' cuando esta
// vacio, y categoria arranca sin seleccionar. Al guardar se convierte
// a un Producto valido del dominio.
interface ProductoFormValues {
  nombre: string;
  categoria: CategoriaProducto | null;
  precio: number | string;
  stock: number | string;
  descripcion: string;
  enOferta: boolean;
  precioOferta: number | string;
}

const EMPTY_VALUES: ProductoFormValues = {
  nombre: '',
  categoria: null,
  precio: '',
  stock: '',
  descripcion: '',
  enOferta: false,
  precioOferta: '',
};

function toFormValues(producto: Producto): ProductoFormValues {
  return {
    nombre: producto.nombre,
    categoria: producto.categoria,
    precio: producto.precio,
    stock: producto.stock ?? '',
    descripcion: producto.descripcion ?? '',
    enOferta: producto.precioOferta !== undefined,
    precioOferta: producto.precioOferta ?? '',
  };
}

export function ProductosPage() {
  const { productos, saveProducto } = useData();
  const [modalOpened, setModalOpened] = useState(false);
  const [editing, setEditing] = useState<Producto | null>(null);

  const form = useForm<ProductoFormValues>({
    initialValues: EMPTY_VALUES,
    validate: {
      nombre: (value) => (value.trim().length === 0 ? 'El nombre es obligatorio' : null),
      categoria: (value) => (value === null ? 'Elegí una categoría' : null),
      precio: (value) =>
        value === '' || Number(value) <= 0 ? 'El precio debe ser mayor a 0' : null,
      stock: (value) =>
        value !== '' && Number(value) < 0 ? 'El stock no puede ser negativo' : null,
      precioOferta: (value, values) => {
        if (!values.enOferta) {
          return null;
        }
        if (value === '') {
          return 'Ingresá el precio de oferta';
        }
        if (values.precio !== '' && !isValidOferta(Number(values.precio), Number(value))) {
          return 'La oferta debe ser menor al precio normal';
        }
        return null;
      },
    },
  });

  const openNew = () => {
    setEditing(null);
    form.setValues(EMPTY_VALUES);
    form.clearErrors();
    setModalOpened(true);
  };

  const openEdit = (producto: Producto) => {
    setEditing(producto);
    form.setValues(toFormValues(producto));
    form.clearErrors();
    setModalOpened(true);
  };

  const handleSubmit = form.onSubmit((values) => {
    const producto: Producto = {
      id: editing?.id ?? crypto.randomUUID(),
      nombre: values.nombre.trim(),
      // La validacion garantiza que categoria no es null al llegar aca
      categoria: values.categoria as CategoriaProducto,
      precio: Number(values.precio),
      stock: values.stock === '' ? null : Number(values.stock),
    };
    if (values.descripcion.trim().length > 0) {
      producto.descripcion = values.descripcion.trim();
    }
    if (values.enOferta && values.precioOferta !== '') {
      producto.precioOferta = Number(values.precioOferta);
    }
    saveProducto(producto);
    setModalOpened(false);
  });

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2}>Productos</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={openNew}>
          Nuevo producto
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, xs: 2, md: 3, xl: 4 }}>
        {productos.map((producto) => (
          <ProductoCard key={producto.id} producto={producto} onEdit={() => openEdit(producto)} />
        ))}
      </SimpleGrid>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editing !== null ? `Editar: ${editing.nombre}` : 'Nuevo producto'}
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="sm">
            <TextInput
              label="Nombre"
              placeholder="God of War Ragnarok"
              withAsterisk
              {...form.getInputProps('nombre')}
            />
            <Select
              label="Categoría"
              placeholder="Elegí una categoría"
              data={CATEGORIA_OPTIONS}
              withAsterisk
              {...form.getInputProps('categoria')}
            />
            <Group grow>
              <NumberInput
                label="Precio (UYU)"
                placeholder="2500"
                min={1}
                withAsterisk
                {...form.getInputProps('precio')}
              />
              <NumberInput
                label="Stock"
                placeholder="Vacío = ilimitado"
                min={0}
                {...form.getInputProps('stock')}
              />
            </Group>
            <Textarea
              label="Descripción"
              placeholder="Texto corto para la card del producto"
              autosize
              minRows={2}
              {...form.getInputProps('descripcion')}
            />
            <Switch label="En oferta" {...form.getInputProps('enOferta', { type: 'checkbox' })} />
            {form.values.enOferta && (
              <NumberInput
                label="Precio de oferta (UYU)"
                placeholder="Debe ser menor al precio normal"
                min={1}
                withAsterisk
                {...form.getInputProps('precioOferta')}
              />
            )}
            <Group justify="flex-end" mt="sm">
              <Button variant="default" onClick={() => setModalOpened(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editing !== null ? 'Guardar cambios' : 'Crear producto'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
