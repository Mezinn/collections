export type IsPrivateType = boolean & { __type: 'collection.isPrivate' };
export const AsIsPrivate = (isPrivate: boolean) => isPrivate as IsPrivateType;
