export type IdType = number & { __type: 'resetPasswordToken.id' };
export const AsIdType = (id: number) => id as IdType;
