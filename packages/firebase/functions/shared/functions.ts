export type WithAdminResponse<T> =
  | {
      status: 'success';
      result: T;
    }
  | {
      status: 'failed';
      reason: string;
    };

export type FunctionsSetRoleEventRequest = {
  uid: string;
  role: string;
};

export type FunctionsSetRoleEventResponse = WithAdminResponse<
  | {
      status: 'success';
    }
  | {
      status: 'failed';
      reason: string;
    }
>;
