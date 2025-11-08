import { ReactElement } from 'react';

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps): ReactElement => (
  <html>
    <body>
      <h1>Welcome to Cursor Template</h1>
      <p>Hey {name}, we&apos;re excited to have you onboard.</p>
    </body>
  </html>
);

