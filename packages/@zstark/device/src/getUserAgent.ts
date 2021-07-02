export default function getUserAgent() {
  return window.navigator ? window.navigator.userAgent : ''
}
