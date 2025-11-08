import { render } from '@testing-library/react';
import { ReactElement } from 'react';

export const renderWithProviders = (ui: ReactElement) => render(ui);

