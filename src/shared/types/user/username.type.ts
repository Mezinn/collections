export type UsernameType = string & { __type: 'user.username' };
export const AsUsernameType = (username: string) => username as UsernameType;
