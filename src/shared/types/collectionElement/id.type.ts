export type IdType = string & { __type: 'collectionElement.id' };
export const AsIdType = (id: string) => id as IdType;
