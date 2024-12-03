export type NodeEnv = 'development' | 'production';

export type OneOrMany<T> = T | T[];

export type ConfigChain<T> = OneOrMany<T | ((config: T) => T | void)>;
