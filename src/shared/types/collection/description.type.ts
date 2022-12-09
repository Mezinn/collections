export type DescriptionType = string & { __type: 'collection.description' };
export const AsDescriptionType = (description: string) =>
  description as DescriptionType;
