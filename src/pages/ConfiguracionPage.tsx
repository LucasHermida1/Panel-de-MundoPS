import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  ColorInput,
  Group,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconDeviceGamepad2, IconInfoCircle } from '@tabler/icons-react';
import { useConfig } from '../context/ConfigContext';
import type { ComercioInfo } from '../types';

const COLOR_SWATCHES = [
  '#0070d1', // azul PlayStation
  '#e03131',
  '#f76707',
  '#f59f00',
  '#2f9e44',
  '#12b886',
  '#7048e8',
  '#d6336c',
];

function ThemePreview() {
  return (
    <Card withBorder radius="md" padding="lg">
      <Text fw={600} mb="md">
        Vista previa
      </Text>
      <Stack gap="md">
        <Group gap="sm">
          <ThemeIcon size={38} radius="md">
            <IconDeviceGamepad2 size={22} stroke={1.6} />
          </ThemeIcon>
          <div>
            <Text fw={600} lh={1.2}>
              Así se ve el color de marca
            </Text>
            <Text size="sm" c="dimmed">
              Botones, badges, íconos y gráficos lo heredan.
            </Text>
          </div>
        </Group>
        <Group gap="sm">
          <Button>Botón primario</Button>
          <Button variant="light">Variante light</Button>
          <Button variant="outline">Outline</Button>
        </Group>
        <Group gap="sm">
          <Badge>Badge</Badge>
          <Badge variant="light">Badge light</Badge>
          <Switch defaultChecked label="Switch activo" />
        </Group>
      </Stack>
    </Card>
  );
}

export function ConfiguracionPage() {
  const { comercio, setComercio, brandColor, setBrandColor } = useConfig();
  const [saved, setSaved] = useState(false);

  const form = useForm<ComercioInfo>({
    initialValues: comercio,
    validate: {
      nombre: (value) => (value.trim().length === 0 ? 'El nombre es obligatorio' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    setComercio(values);
    form.resetDirty(values);
    setSaved(true);
  });

  return (
    <Stack gap="lg">
      <Title order={2}>Configuración</Title>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Card withBorder radius="md" padding="lg">
          <Text fw={600} mb="md">
            Datos del comercio
          </Text>
          <form onSubmit={handleSubmit}>
            <Stack gap="sm">
              <TextInput label="Nombre" withAsterisk {...form.getInputProps('nombre')} />
              <TextInput label="Dirección" {...form.getInputProps('direccion')} />
              <TextInput label="Teléfono" {...form.getInputProps('telefono')} />
              <TextInput label="Horario" {...form.getInputProps('horario')} />
              <Group justify="flex-end" mt="sm" gap="sm">
                {saved && !form.isDirty() && (
                  <Group gap={4}>
                    <IconCheck size={16} color="var(--mantine-color-teal-6)" />
                    <Text size="sm" c="teal">
                      Cambios guardados
                    </Text>
                  </Group>
                )}
                <Button type="submit" disabled={!form.isDirty()}>
                  Guardar cambios
                </Button>
              </Group>
            </Stack>
          </form>
        </Card>

        <Stack gap="lg">
          <Card withBorder radius="md" padding="lg">
            <Text fw={600} mb="md">
              Color de marca
            </Text>
            <ColorInput
              label="Color primario de la interfaz"
              description="El cambio se aplica en vivo a toda la aplicación"
              value={brandColor}
              onChange={setBrandColor}
              swatches={COLOR_SWATCHES}
              format="hex"
            />
          </Card>

          <ThemePreview />

          <Alert icon={<IconInfoCircle size={18} />} variant="light">
            La configuración vive solo en memoria (estado de React). En producción se persistiría en
            un backend o en localStorage.
          </Alert>
        </Stack>
      </SimpleGrid>
    </Stack>
  );
}
