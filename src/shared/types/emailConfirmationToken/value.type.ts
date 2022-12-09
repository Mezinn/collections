export type ValueType = string & { __type: 'emailConfirmationToken.value' };
export const AsValueType = (value: string) => value as ValueType;
