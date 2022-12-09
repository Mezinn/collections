export type PassphraseType = string & { __type: 'user.passphrase' };
export const AsPassphraseType = (value: string) => value as PassphraseType;
