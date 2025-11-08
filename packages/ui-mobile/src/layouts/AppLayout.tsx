import { PropsWithChildren } from 'react';
import { Stack, YStack, Text, Button } from 'tamagui';

export interface AppLayoutProps extends PropsWithChildren {
  title?: string;
  onLogout?: () => void;
}

export const AppLayout = ({ children, title, onLogout }: AppLayoutProps) => (
  <YStack flex={1} backgroundColor="$background">
    <Stack
      padding="$md"
      backgroundColor="$muted"
      justifyContent="space-between"
      alignItems="center"
      flexDirection="row"
    >
      <Text fontSize={20} fontWeight="600">
        {title ?? 'Dashboard'}
      </Text>
      {onLogout ? (
        <Button onPress={onLogout} accessibilityLabel="Logout">
          Logout
        </Button>
      ) : null}
    </Stack>
    <YStack flex={1} padding="$md">
      {children}
    </YStack>
  </YStack>
);


