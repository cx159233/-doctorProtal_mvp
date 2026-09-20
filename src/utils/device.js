import enquireJs from 'enquire.js'

export const DEVICE_TYPE = {
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE: 'mobile'
}

const matchDevice = function (cb, device) {
  return () => cb && cb(device)
}

export const deviceEnquire = function(cb) {
  const matchDesktop = { // 匹配台式
    match: matchDevice(cb, DEVICE_TYPE.DESKTOP)
  }

  const matchtabLet = { // 匹配平板
    match: matchDevice(cb, DEVICE_TYPE.TABLET)
  }

  const matchMobile = {
    match: matchDevice(cb, DEVICE_TYPE.MOBILE)
  }
  // screen and (max-width: 1087.99px)
  enquireJs
  .register('screen and (max-width: 576px)', matchMobile)
  .register('screen and (min-width: 576px) and (max-width: 1199px)', matchtabLet)
  .register('screen and (min-width: 1200px)', matchDesktop)
}

