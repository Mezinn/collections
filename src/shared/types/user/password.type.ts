export type PasswordType = string & { __type: 'user.password' };
export const AsPasswordType = (password: string) => password as PasswordType;
