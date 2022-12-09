export type EmailType = string & { __type: 'user.email' };
export const AsEmailType = (email: string) => email as EmailType;
