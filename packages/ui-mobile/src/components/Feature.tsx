import { PropsWithChildren, ReactNode } from 'react';
import { SizableText, YStack } from 'tamagui';

interface FeatureProps extends PropsWithChildren {
  enabled: boolean;
  fallback?: ReactNode;
}

export const Feature = ({ enabled, fallback, children }: FeatureProps) => {
  if (enabled) {
    return <>{children}</>;
  }

  return (
    <YStack
      padding="$md"
      borderRadius="$md"
      backgroundColor="$muted"
      borderWidth={1}
      borderColor="$primary"
    >
      {fallback ?? <SizableText size={3}>Upgrade your plan to access this feature.</SizableText>}
    </YStack>
  );
};


