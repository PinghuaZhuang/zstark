/**
 * 获取字符字节长度
 * @param { String } str 目标字符串
 */
 export function byteLengthEn(str: string): number {
  if (typeof str !== 'string') return 0
  let b = 0
  for (let i = str.length - 1; i >= 0; i--) {
    if (str.charCodeAt(i) > 255) {
      b += 2
    } else {
      b++
    }
  }
  return b
}
