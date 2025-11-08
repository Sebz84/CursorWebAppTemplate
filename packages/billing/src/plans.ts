import { z } from 'zod';

export const featureSchema = z.object({
  key: z.string(),
  description: z.string()
});

export const planSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  currency: z.string().default('USD'),
  features: z.array(featureSchema),
  limits: z.record(z.string(), z.number().nullable()).default({})
});

export type FeatureDefinition = z.infer<typeof featureSchema>;
export type PlanDefinition = z.infer<typeof planSchema>;

export const plans: PlanDefinition[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    features: [
      { key: 'feature:projects-basic', description: 'Create up to 1 project' }
    ],
    limits: {
      'limit:max-projects': 1
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 2900,
    currency: 'USD',
    features: [
      { key: 'feature:projects-basic', description: 'Unlimited projects' },
      { key: 'feature:advanced-analytics', description: 'Advanced analytics suite' }
    ],
    limits: {
      'limit:max-projects': null
    }
  }
];

export const defaultPlanId = 'free';

export const getPlanById = (planId: string): PlanDefinition => {
  return plans.find((plan) => plan.id === planId) ?? plans[0];
};
