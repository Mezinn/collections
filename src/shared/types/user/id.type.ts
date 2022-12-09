export type IdType = string & { __type: 'user.id' };
export const AsIdType = (id: string) => id as IdType;
