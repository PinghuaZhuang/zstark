/**
 * 全屏( 绑定了 F11 键 )
 * @example 整个页面: requestFullScreen( document.documentElement );
 * @example 某个元素: requestFullScreen( document.querySelect( '' ) )
 * @param { Dom } element 需要全屏的对象
 */
export declare function requestFullScreen(element?: HTMLElement): void;
/**
 * 退出全屏( 绑定了 F11 键 )
 */
export declare function exitFullScreen(): void;
