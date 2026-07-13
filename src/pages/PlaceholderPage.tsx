import { Text, Title } from '@mantine/core';

interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div>
      <Title order={2}>{title}</Title>
      <Text c="dimmed" mt="sm">
        Pantalla en construcción.
      </Text>
    </div>
  );
}
