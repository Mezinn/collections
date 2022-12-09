export type IdType = string & { __type: 'collection.id' };
export const AsIdType = (id: string) => id as IdType;
