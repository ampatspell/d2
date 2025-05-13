import { getter, options } from '../utils/options';

export type IsLoadedModels = (IsLoadedModel | undefined)[];

export type IsLoadedModel = {
  isLoaded: boolean;
};

export const isLoaded = (arr: IsLoadedModels) => {
  return !arr.find((item) => {
    if (item) {
      return !item.isLoaded;
    }
    return true;
  });
};

export const asIsLoadedModel = (arr: IsLoadedModels | undefined) => {
  return options({
    isLoaded: getter(() => {
      if (arr) {
        return isLoaded(arr);
      }
      return true;
    }),
  });
};
