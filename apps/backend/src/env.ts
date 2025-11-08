import { env as sharedEnv } from '@template/config';

export const env = {
  ...sharedEnv,
  PORT: Number(process.env.PORT ?? 3001)
};

