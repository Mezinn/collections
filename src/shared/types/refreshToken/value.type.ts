export type ValueType = string & { __type: 'refreshToken.value' };
export const AsValueType = (value: string) => value as ValueType;
