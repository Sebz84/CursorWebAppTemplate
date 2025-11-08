import { render } from '@testing-library/react';

export const renderWithProviders = (...args: Parameters<typeof render>) => {
  return render(...args);
};

