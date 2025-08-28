import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.string().default('3000'),
  JWT_SECRET: z.string(),
  API_AD: z.string(),
});

export type Env = z.infer<typeof envSchema>;
