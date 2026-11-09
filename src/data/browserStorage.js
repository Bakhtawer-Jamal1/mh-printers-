export function readBrowserSetting(key) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeBrowserSetting(key, value) {
  try {
    window.localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}
