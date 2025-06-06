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

export type NodeParentData = {
  id: string;
  path: string;
  identifier: string;
};

export type BaseNodeData<Type extends string, NodePropertiesRegistry extends { [key in Type]: object }> = {
  kind: Type;
  path: string;
  identifier: string;
  position: number;
  properties: NodePropertiesRegistry[Type];
  parent: NodeParentData | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SubscriptionData = {
  createdAt: Date;
  updatedAt: Date;
  kinds: string[];
  fullName: string | null;
  email: string;
  isEmailVerified: boolean;
};
