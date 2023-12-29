export enum REG_EXP_KEYS {
  ObjectId = 'ObjectId',
}

export const REG_EXP: Record<REG_EXP_KEYS, RegExp> = {
  [REG_EXP_KEYS.ObjectId]: /^[0-9a-fA-F]{24}$/,
};
