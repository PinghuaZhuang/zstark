/**
 * 滚动到目标DOM位置上
 * @param { HTMLElement } container 滚动的容器
 * @param { HTMLElement } selected 滚动到的目标DOM
 */
export declare const scrollIntoView: (container: HTMLElement, selected: HTMLElement) => void;
/**
 * 拷贝文本到剪切板
 * @param { String } text 要拷贝的文本
 */
export declare function copyToClipboard(text: string): void;
/**
 * A标签下载下载
 * @description 跨域后重命名无效
 * @param { String } href 下载路径
 * @param { String } name 下载后重命名
 */
export declare function download(href: string, name?: string): HTMLAnchorElement;
