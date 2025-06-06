import { initializeApp } from 'firebase-admin/app';
import Application from '../../src/app';
import functionsTest from 'firebase-functions-test';
import config from './config.json';
import { FeaturesList } from 'firebase-functions-test/lib/features';
import { Param } from 'firebase-functions/lib/params/types';

// https://github.com/firebase/firebase-admin-node/issues/2658
const test = functionsTest(config.firebase, config.serviceAccountKeyPath);
const instance = initializeApp();

const noop = () => {};

const log = <T>(fn: T) => {
  if (process.env.LOGGING) {
    return fn;
  }
  return noop;
};

const logger = {
  info: log(console.info.bind(console)),
};

const key = '__setup';

type Setup = {
  app: Application;
  test: FeaturesList;
};

const param = <T extends string>(value: T) => {
  return {
    value: () => value,
  } as unknown as Param<T>;
};

export const setup = (caller: Mocha.Suite) => {
  caller.beforeEach(() => {
    const app = new Application({
      instance,
      logger,
      config: {
        adminEmail: param('ampatspell@gmail.com'),
        regionFunctions: param('europe-west1'),
        regionBucket: param('europe-west1'),
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (caller as any)[key] = { app, test };
  });
};

export const getTestApp = (caller: Mocha.Suite) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setup = (caller as any)[key] as Setup;
  return setup.app;
};
