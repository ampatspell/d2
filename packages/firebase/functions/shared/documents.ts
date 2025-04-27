export const userRoles = ['admin', 'visitor'] as const;

export const isUserRole = (role: string): role is UserRole => {
  return (userRoles as unknown as string[]).includes(role);
};

export type UserRole = (typeof userRoles)[number];

export type UserData = {
  email?: string;
  isAnonymous: boolean;
  role: UserRole;
};
