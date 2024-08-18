export type ReplaceFieldType<T, K extends keyof T, NewType> = {
  [P in keyof T]: P extends K ? NewType : T[P];
};
