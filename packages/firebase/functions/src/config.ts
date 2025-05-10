import { defineString } from 'firebase-functions/params';

export const config = {
  adminEmail: defineString('ADMIN_EMAIL', { description: 'admin email' }),
  regionFunctions: defineString('REGION_FUNCTIONS', { description: 'functions region' }),
  regionBucket: defineString('REGION_BUCKET', { description: 'storage bucket region' }),
} as const;

export type Config = typeof config;
