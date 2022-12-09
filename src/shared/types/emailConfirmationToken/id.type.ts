export type IdType = number & { __type: 'emailConfirmationToken.id' };
export const AsIdType = (id: number) => id as IdType;
