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

export type UserNodeData = {
  open: boolean;
};

export type BaseNodeData<Type extends string, NodePropertiesRegistry extends { [key in Type]: object }> = {
  kind: Type;
  path: string;
  identifier: string;
  properties: NodePropertiesRegistry[Type];
  parent: string | null;
  createdAt: Date;
  updatedAt: Date;
};
