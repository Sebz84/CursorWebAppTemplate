import { PostHog } from 'posthog-node';

let client: PostHog | null = null;

export const initPosthog = (apiKey?: string, host = 'https://app.posthog.com') => {
  if (!apiKey) return null;
  if (!client) {
    client = new PostHog(apiKey, { host });
  }
  return client;
};

export const getPosthog = () => client;
import { PostHog } from 'posthog-node';

let client: PostHog | null = null;

export const getPosthogClient = (apiKey?: string, host?: string) => {
  if (!apiKey) {
    return null;
  }

  if (!client) {
    client = new PostHog(apiKey, {
      host: host ?? 'https://app.posthog.com'
    });
  }

  return client;
};

