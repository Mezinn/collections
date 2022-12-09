export type IsConfirmedType = boolean & { __type: 'user.isConfirmed' };
export const AsIsConfirmedType = (isConfirmed: boolean) =>
  isConfirmed as IsConfirmedType;
