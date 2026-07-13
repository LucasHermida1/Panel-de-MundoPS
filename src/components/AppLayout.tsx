import { AppShell, Burger, Group, NavLink, Text, ThemeIcon, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconDeviceGamepad2,
  IconLayoutDashboard,
  IconPackage,
  IconReceipt2,
  IconSettings,
  type Icon,
} from '@tabler/icons-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';

interface NavItem {
  label: string;
  path: string;
  icon: Icon;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Resumen', path: '/', icon: IconLayoutDashboard },
  { label: 'Pedidos', path: '/pedidos', icon: IconReceipt2 },
  { label: 'Productos', path: '/productos', icon: IconPackage },
  { label: 'Configuración', path: '/configuracion', icon: IconSettings },
];

export function AppLayout() {
  const [opened, { toggle, close }] = useDisclosure();
  const location = useLocation();
  const { comercio } = useConfig();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" gap="sm">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <ThemeIcon size={38} radius="md" variant="filled">
            <IconDeviceGamepad2 size={24} stroke={1.6} />
          </ThemeIcon>
          <div>
            <Title order={3} lh={1.1}>
              {comercio.nombre}
            </Title>
            <Text size="xs" c="dimmed">
              {comercio.direccion}
            </Text>
          </div>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="xs">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              component={Link}
              to={item.path}
              label={item.label}
              leftSection={<Icon size={18} stroke={1.6} />}
              active={location.pathname === item.path}
              onClick={close}
              style={{ borderRadius: 'var(--mantine-radius-md)' }}
            />
          );
        })}
      </AppShell.Navbar>

      <AppShell.Main bg="var(--mantine-color-gray-0)">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
