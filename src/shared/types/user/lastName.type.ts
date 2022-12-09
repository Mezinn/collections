export type LastNameType = string & { __type: 'user.lastName' };
export const AsLastNameType = (lastName: string) => lastName as LastNameType;
