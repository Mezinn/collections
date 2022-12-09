export type PasswordHashType = string & { __type: 'user.passwordHash' };
export const AsPasswordHashType = (passwordHash: string) =>
  passwordHash as PasswordHashType;
