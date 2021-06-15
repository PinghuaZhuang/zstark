export declare type Env = 'production' | 'localdev';
/**
 * 获取url的query参数
 */
export declare function param2Obj(url: string): object;
/**
 * 获取环境变量
 */
export declare function getEnv(): Env;
export declare function getKeyWithEnv(key: string, env?: string, template?: string): string;
/**
 * 获取token
 */
export declare function getToken(env?: Env): string | undefined;
/**
 * 创建缓存对象
 * @param { Number } length 缓存长度
 */
export declare function createCache<T>(length: string): (key: string | ((k: string, v: T) => unknown), value: T) => string | T | unknown[];
/**
 * 获取 UUID
 */
export declare function getUUID(): string;
