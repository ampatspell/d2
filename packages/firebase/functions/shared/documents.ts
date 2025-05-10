import type { NodePropertiesRegistry } from './nodes';

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

//

export type NodeType = keyof NodePropertiesRegistry;

export type { NodePropertiesRegistry };

export type NodeData<Type extends NodeType = NodeType> = {
  kind: Type;
  identifier: string;
  properties: NodePropertiesRegistry[Type];
  parent: string | null;
  createdAt: Date;
};
