export type TitleType = string & { __type: 'collection.title' };
export const AsTitleType = (title: string) => title as TitleType;
