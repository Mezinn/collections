export type IdType = number & { __type: 'refreshToken.id' };
export const AsIdType = (id: number) => id as IdType;
