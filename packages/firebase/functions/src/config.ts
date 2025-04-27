import { defineString } from 'firebase-functions/params';

export const config = {
  adminEmail: defineString('ADMIN_EMAIL', { description: 'admin email' }),
  region: defineString('REGION', { description: 'functions region' }),
} as const;

export type Config = typeof config;
