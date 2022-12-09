export type ValueType = string & { __type: 'resetPasswordToken.value' };
export const AsValueType = (value: string) => value as ValueType;
