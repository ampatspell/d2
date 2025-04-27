import { initializeApp } from 'firebase-admin/app';
import * as functions from 'firebase-functions/v2';
import * as logger from 'firebase-functions/logger';
import Application from './app';
import {
  FunctionsSetRoleEventRequest,
  FunctionsSetRoleEventResponse,
} from '../shared/functions';
import { config } from './config';
import { isUserRole } from '../shared/documents';

functions.setGlobalOptions({ region: config.region });

const instance = initializeApp();
const app = new Application({ instance, logger, config: config });

export const userOnBeforeCreated = functions.identity.beforeUserCreated(async (event) => {
  return await app.identity.onBeforeUserCreated(event.data!);
});

export const setRole = functions.https.onCall<FunctionsSetRoleEventRequest, Promise<FunctionsSetRoleEventResponse>>(
  async (event) => {
    return await app.identity.withAdmin(event.auth, async () => {
      const uid = event.data.uid;
      const role = event.data.role;
      if (!uid || !role) {
        return {
          status: 'failed',
          reason: 'uid and role is required',
        };
      }
      if (!isUserRole(role)) {
        return {
          status: 'failed',
          reason: 'invalid role',
        };
      }
      await app.identity.setRole(uid, role);
      return {
        status: 'success',
      };
    });
  },
);
