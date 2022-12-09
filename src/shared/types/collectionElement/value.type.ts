export type ValueType = string & { __type: 'collectionElement.value' };
export const AsValueType = (value: string) => value as ValueType;
