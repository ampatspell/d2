export const userRoles = ['admin', 'visitor'] as const;
export type UserRole = (typeof userRoles)[number];

export const isUserRole = (role: string): role is UserRole => {
  return (userRoles as unknown as string[]).includes(role);
};

export type UserData = {
  email?: string;
  isAnonymous: boolean;
  role: UserRole;
};

export type NodeTypes = {
  'missing': {
    message?: string;
  };
  'file': undefined;
};

export type NodeType = keyof NodeTypes;

export type NodeData<T extends NodeType> = {
  kind: T;
  properties: NodeTypes[T];
  parent: string | null;
  createdAt: Date;
};
