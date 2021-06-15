/*!
 * @zstark/utils 0.1.2
 */
/// <reference path="../typings/surpport.d.ts" />

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const inBrowser = typeof window !== 'undefined';
const supportsPushState = inBrowser &&
    (function () {
        const ua = window.navigator.userAgent;
        if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
            ua.indexOf('Mobile Safari') !== -1 &&
            ua.indexOf('Chrome') === -1 &&
            ua.indexOf('Windows Phone') === -1) {
            return false;
        }
        return window.history && typeof window.history.pushState === 'function';
    })();
const surpport = {
    inBrowser,
    pushState: supportsPushState,
};
if (inBrowser) {
    const { userAgent } = navigator;
    surpport.browser = {
        version: {
            trident: userAgent.indexOf('Trident') > -1,
            presto: userAgent.indexOf('Presto') > -1,
            webKit: userAgent.indexOf('AppleWebKit') > -1,
            gecko: userAgent.indexOf('Gecko') > -1 && userAgent.indexOf('KHTML') == -1,
            mobile: !!userAgent.match(/AppleWebKit.*Mobile.*/),
            ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1,
            iPhone: userAgent.indexOf('iPhone') > -1,
            iPad: userAgent.indexOf('iPad') > -1,
            safari: userAgent.indexOf('Safari') == -1
        },
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };
}

exports.inBrowser = inBrowser;
exports.supportsPushState = supportsPushState;
exports.surpport = surpport;
