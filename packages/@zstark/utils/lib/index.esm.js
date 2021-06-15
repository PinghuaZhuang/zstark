/*!
 * @zstark/utils 0.1.2
 */
/// <reference path="../typings/index.d.ts" />

import Cookies from 'js-cookie';

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
            gecko: userAgent.indexOf('Gecko') > -1 && userAgent.indexOf('KHTML') === -1,
            mobile: !!userAgent.match(/AppleWebKit.*Mobile.*/),
            ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1,
            iPhone: userAgent.indexOf('iPhone') > -1,
            iPad: userAgent.indexOf('iPad') > -1,
            safari: userAgent.indexOf('Safari') === -1
        },
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };
}

const NAUTH_TOKEN = `nauth-token`;
/**
 * 获取url的query参数
 */
function param2Obj(url) {
    const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ');
    if (!search) {
        return {};
    }
    const obj = {};
    const searchArr = search.split('&');
    searchArr.forEach(v => {
        const index = v.indexOf('=');
        if (index !== -1) {
            const name = v.substring(0, index);
            const val = v.substring(index + 1, v.length);
            obj[name] = decodeURIComponent(val);
        }
    });
    return obj;
}
/**
 * 获取环境变量
 */
function getEnv() {
    return ((/^(127.0.0.1)|(192.168)|(localhost)|(localdev)/.test(window.location.hostname))
        ? 'localdev'
        : 'production');
}
// 目前环境只有 localdev 和 production
// @nestark/auth 没有引用这里. 实现是一样的.
function getKeyWithEnv(key, env = getEnv(), template = '{k}-{env}') {
    // 只有localdev有后缀
    return (env !== 'production' && env.length)
        ? (template
            .replace(/{k}/g, key)
            .replace(/{env}/g, env))
        : key;
}
/**
 * 获取token
 */
function getToken(env) {
    return Cookies.get(getKeyWithEnv(NAUTH_TOKEN, env || getEnv()));
}
/**
 * 创建缓存对象
 * @param { Number } length 缓存长度
 */
function createCache(length) {
    const keys = [];
    const cacheLength = length || 50;
    function cache(key, value) {
        if (typeof key === 'function') {
            const cb = key;
            // @ts-ignore
            return keys.map(k => cb(k.replace(/\s$/, ''), cache[k + ' ']));
        }
        if (keys.push(key + ' ') > cacheLength) {
            delete cache[keys.shift()];
        }
        return (value == null ? cache[key + ' '] : (cache[key + ' '] = value));
    }
    return cache;
}
/**
 * 获取 UUID
 */
function getUUID() {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

/**
 * 全屏( 绑定了 F11 键 )
 * @example 整个页面: requestFullScreen( document.documentElement );
 * @example 某个元素: requestFullScreen( document.querySelect( '' ) )
 * @param { Dom } element 需要全屏的对象
 */
function requestFullScreen(element) {
    element = element || document.documentElement;
    const requestMethod = 
    // @ts-ignore
    element.requestFullScreen ||
        // @ts-ignore
        element.webkitRequestFullScreen ||
        // @ts-ignore
        element.mozRequestFullScreen ||
        // @ts-ignore
        element.msRequestFullScreen;
    if (requestMethod) {
        requestMethod.call(element);
        // @ts-ignore
    }
    else if (typeof window.ActiveXObject !== 'undefined') {
        // @ts-ignore
        const wscript = new ActiveXObject('WScript.Shell');
        if (wscript !== null) {
            wscript.SendKeys('{F11}');
        }
    }
}
/**
 * 退出全屏( 绑定了 F11 键 )
 */
function exitFullScreen() {
    // 判断各种浏览器，找到正确的方法
    const exitMethod = document.exitFullscreen || // W3C
        // @ts-ignore
        document.mozCancelFullScreen || // Chrome等
        // @ts-ignore
        document.webkitExitFullscreen || // FireFox
        // @ts-ignore
        document.webkitExitFullscreen; // IE11
    if (exitMethod) {
        exitMethod.call(document);
        // @ts-ignore
    }
    else if (typeof window.ActiveXObject !== 'undefined') {
        // @ts-ignore
        const wscript = new ActiveXObject('WScript.Shell');
        if (wscript !== null) {
            wscript.SendKeys('{F11}');
        }
    }
}

/**
 * 滚动到目标DOM位置上
 * @param { HTMLElement } container 滚动的容器
 * @param { HTMLElement } selected 滚动到的目标DOM
 */
const scrollIntoView = function (container, selected) {
    // if ( Vue.prototype.$isServer ) return;
    if (!selected) {
        container.scrollTop = 0;
        return;
    }
    const offsetParents = [];
    let pointer = selected.offsetParent;
    while (pointer && container !== pointer && container.contains(pointer)) {
        offsetParents.push(pointer);
        pointer = pointer.offsetParent;
    }
    const top = selected.offsetTop +
        offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0);
    const bottom = top + selected.offsetHeight;
    const viewRectTop = container.scrollTop;
    const viewRectBottom = viewRectTop + container.clientHeight;
    if (top < viewRectTop) {
        container.scrollTop = top;
    }
    else if (bottom > viewRectBottom) {
        container.scrollTop = bottom - container.clientHeight;
    }
};
/**
 * 拷贝文本到剪切板
 * @param { String } text 要拷贝的文本
 */
function copyToClipboard(text) {
    if (text == null || text === '')
        return;
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.focus();
    Object.assign(textArea.style, {
        position: 'fixed',
        top: '-10000px',
        left: '-10000px',
        'z-index': -1,
        width: '100px',
    });
    document.body.append(textArea);
    try {
        textArea.select();
        const ret = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (!ret) {
            console.log(`>>> 拷贝文本未选中文本.`);
        }
    }
    catch (error) {
        console.error('<<< 改浏览器不支持 execCommand(\'copy\') 方法.');
    }
}
/**
 * A标签下载下载
 * @description 跨域后重命名无效
 * @param { String } href 下载路径
 * @param { String } name 下载后重命名
 */
function download(href, name = `download.xlsx`) {
    const eleLink = document.createElement('a');
    eleLink.download = name;
    eleLink.href = href;
    eleLink.click();
    return eleLink;
}

/**
 * 获取字符字节长度
 * @param { String } str 目标字符串
 */
function byteLengthEn(str) {
    if (typeof str !== 'string')
        return 0;
    let b = 0;
    for (let i = str.length - 1; i >= 0; i--) {
        if (str.charCodeAt(i) > 255) {
            b += 2;
        }
        else {
            b++;
        }
    }
    return b;
}

export { surpport, param2Obj, getEnv, getKeyWithEnv, getToken, createCache, getUUID, requestFullScreen, exitFullScreen, scrollIntoView, copyToClipboard, download, byteLengthEn };
