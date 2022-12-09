export type FirstNameType = string & { __type: 'user.firstName' };
export const AsFirstNameType = (fistName: string) => fistName as FirstNameType;
