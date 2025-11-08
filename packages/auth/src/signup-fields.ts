import { z } from 'zod';

export const signupFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  enabled: z.boolean().default(true),
  required: z.boolean().default(false)
});

export type SignupField = z.infer<typeof signupFieldSchema>;

export const signupFields: SignupField[] = [
  {
    name: 'firstName',
    label: 'First name',
    enabled: true,
    required: true
  },
  {
    name: 'lastName',
    label: 'Last name',
    enabled: true,
    required: true
  }
];

