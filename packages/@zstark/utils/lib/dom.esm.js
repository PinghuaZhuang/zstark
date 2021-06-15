/*!
 * @zstark/utils 0.1.2
 */
/// <reference path="../typings/dom.d.ts" />

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

export { scrollIntoView, copyToClipboard, download };
