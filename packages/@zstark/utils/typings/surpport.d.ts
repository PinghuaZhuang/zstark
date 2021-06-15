export declare const inBrowser: boolean;
export declare const supportsPushState: boolean;
export interface Surpport {
    inBrowser: boolean;
    pushState: boolean;
    browser?: Browser;
}
export interface Browser {
    version: {
        trident: boolean;
        presto: boolean;
        webKit: boolean;
        gecko: boolean;
        safari: boolean;
        mobile: boolean;
        ios: boolean;
        android: boolean;
        iPhone: boolean;
        iPad: boolean;
    };
    language: string;
}
declare const surpport: Surpport;
export { surpport };
