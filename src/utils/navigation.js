const OS_TYPE = {
    unix:{
      name:'unix',
      version:''
    },
    android:{
      name: 'android',
      version:''
    },
    linux:{
      name:'linux',
      version:''
    },
    win2000:{
      name:'windows',
      version:'2000'
    },
    winxp:{
      name:'windows',
      version: 'xp'
    },
    win2003:{
      name:'windows',
      version: '2003'
    },
    winvista:{
      name:'windows',
      version:'vista'
    },
    win7:{
      name:'windows',
      version: 7
    },
    win8:{
      name:'windows',
      version: 8
    },
    win10:{
      name:'windows',
      version: 10
    },
    win11:{
      name:'windows',
      version: 11
    },
    unknow:{
      name:'',
      version:''
    }
  }
   
  const BROWSER_TYPE = {
    'ie8':{
      browser: 'IE',
      version: '8', 
    },
    'ie9':{
      browser: 'IE',
      version: '9', 
    },
    'ie10':{
      browser: 'IE',
      version: '10', 
    },
    'ie11':{
      browser: 'IE',
      version: '11', 
    },
    'ie':{
      browser:'IE',
      version:''
    },
    'edge': 'edge',
    'qq': 'QQ',
    '360': '360',
    '2345': '2345',
    'huawei': 'Huawei',
    'firefox': 'Firefox',
    'opera': 'Opera',
    'safari': 'Safari',
    'chrome': 'Chrome',
    
  }
  export const getBrowserAndOsInfo = {
    init: function () {
      return {
        browser : this.getBrowser().browser || '', //获取浏览器名
        browserVersion : this.getBrowser().version || '', //获取浏览器版本
        OS : this.getOS().name || '', //系统版本号
        OSVersion: this.getOS().version || '',
        net: this.getNetInfo(),
      }
    },
    getOS: function () {
      //判断所处操作系统
      var sUserAgent = navigator.userAgent.toLowerCase()
      var isWin = sUserAgent.indexOf('windows') > -1
      var isMac = sUserAgent.indexOf('mac') > -1
      if (isMac) {
        const matchRes = sUserAgent.match(/(mac os[\s|\w|\.]+)/g)
        const matchResArr = matchRes[0] ? matchRes[0].split(' ') : []
        const versionStr = matchResArr.pop()
        const version = versionStr.replace(/_/g,'.')
        const name = matchResArr.join(' ')
        return {
          name: name,
          version: version
        }
      }
      var isUnix = (sUserAgent.indexOf('unix') > -1)
      if (isUnix){
        return OS_TYPE['unix']
      } 
      var isLinux = sUserAgent.indexOf('Linux') > -1
      var bIsAndroid = /android/i.test(sUserAgent)
      if (isLinux) {
        if (bIsAndroid){
          return OS_TYPE['android']
        } else{
          return OS_TYPE['linux']
        }
      }
      
      if (isWin) {
        var isWin2K = sUserAgent.indexOf('windows nt 5.0') > -1 || sUserAgent.indexOf('windows 2000') > -1
        if (isWin2K) {
          return OS_TYPE['win2000']
        } 
        var isWinXP =
          sUserAgent.indexOf('windows nt 5.1') > -1 || sUserAgent.indexOf('windows xp') > -1
        sUserAgent.indexOf('windows xp') > -1
        if (isWinXP){
          return OS_TYPE['winxp']
        }
        var isWin2003 =
          sUserAgent.indexOf('windows nt 5.2') > -1 || sUserAgent.indexOf('windows 2003') > -1
        if (isWin2003){
          return OS_TYPE['win2003']
        }
        var isWinVista =
          sUserAgent.indexOf('windows nt 6.0') > -1 || sUserAgent.indexOf('windows vista') > -1
        if (isWinVista){
          return OS_TYPE['winvista']
        }
        var isWin7 =
          sUserAgent.indexOf('windows nt 6.1') > -1 || sUserAgent.indexOf('windows 7') > -1
        if (isWin7) {
          return OS_TYPE['win7']
        }
        var isWin8 =
          sUserAgent.indexOf('windows nt 6.2') > -1 || sUserAgent.indexOf('windows 8') > -1
        if (isWin8){
          return OS_TYPE['win8']
        }
        var isWin10 =
          sUserAgent.indexOf('windows nt 10.0') > -1 || sUserAgent.indexOf('windows 10') > -1
        if (isWin10){
          return OS_TYPE['win10']
        }
        var isWin11 =
          sUserAgent.indexOf('windows nt 11.0') > -1 || sUserAgent.indexOf('windows 11') > -1
        if (isWin11){
          return OS_TYPE['win11']
        }
      }
      return OS_TYPE['unknow']
    },
    getDigits: function () {
      //判断当前操作系统的版本号
      var sUserAgent = navigator.userAgent.toLowerCase()
      var is64 = sUserAgent.indexOf('win64') > -1 || sUserAgent.indexOf('wow64') > -1
      if (is64) {
        return '64位'
      } else {
        return '32位'
      }
    },
    getBrowser: function () {
      // 获取浏览器名
      const rMsie = /(msie\s|trident\/7)([\w\.]+)/ //ie
      const rTrident = /(trident)\/([\w.]+)/ //  ie
      const rEdge = /(edg)\/([\w.]+)/ //edge
      const rQQ =  /(qqbrowser)\/([\w.]+)///QQ
      const r360 = /(qihu)\s([\w.]+)/// 360安全浏览器
      const r2345 = /(2345explorer)\/([\w.]+)/// 2345浏览器
      const rHuawei = /(hbpc)\/([\w.]+)/// 华为浏览器
   
      const rFirefox = /(firefox)\/([\w.]+)/ //火狐
      const rOpera = /(opera).+version\/([\w.]+)/ //旧Opera
      const rNewOpera = /(opr)\/(.+)/ //新Opera 基于谷歌
      const rChrome = /(chrome)\/([\w.]+)/ //谷歌 有safari标识
      const rSafari = /version\/([\w.]+).*(safari)/// safari
       
      const ua = navigator.userAgent.toLowerCase()
   
      let matchBS,matchBS2
   
      //IE 低版
      matchBS = rMsie.exec(ua)
      if (matchBS != null) {
        matchBS2 = rTrident.exec(ua)
        if (matchBS2 != null) {
          switch (matchBS2[2]) {
            case '4.0':
              return BROWSER_TYPE['ie7']
              break
            case '5.0':
              return BROWSER_TYPE['ie8']
              break
            case '6.0':
              return  BROWSER_TYPE['ie9']
              break
            case '7.0':
              return  BROWSER_TYPE['ie10']
              break
            default:
              return BROWSER_TYPE['ie']
              break
          }
        } else {
          return {
            browser: BROWSER_TYPE['ie']['browser'],
            version: matchBS[2] || '',
          }
        }
      }
      //IE最新版
      matchBS = rEdge.exec(ua)
      if (matchBS != null && !window.attachEvent) {
        return {
          browser: BROWSER_TYPE['edge'],
          version: matchBS[2] || '',
        }
      }
      // QQ 浏览器
      matchBS = rQQ.exec(ua)
      if(matchBS !== null && !window.attachEvent){
        return {
          browser: BROWSER_TYPE['qq'],
          version: matchBS[2] || '0'
        }
      } 
   
      //360 浏览器
      matchBS = r360.exec(ua)
      if(matchBS !== null && !window.attachEvent){
        return {
          browser: BROWSER_TYPE['360'],
          version: matchBS[2] || '0'
        }
      }
   
      //2345浏览器
      matchBS = r2345.exec(ua)
      if(matchBS !== null && !window.attachEvent){
        return {
          browser: BROWSER_TYPE['2345'],
          version: matchBS[2] || '0'
        }
      }
      
      //华为浏览器
      matchBS = rHuawei.exec(ua)
      if(matchBS !== null && !window.attachEvent){
        return {
          browser: BROWSER_TYPE['huawei'],
          version: matchBS[2] || '0'
        }
      }
   
   
      //火狐浏览器
      matchBS = rFirefox.exec(ua)
      if (matchBS != null && !window.attachEvent) {
        return {
          browser: BROWSER_TYPE['firefox'],
          version: matchBS[2] || '0',
        }
      }
      //Oper浏览器
      matchBS = rOpera.exec(ua)
      if (matchBS != null && !window.attachEvent) {
        return {
          browser: BROWSER_TYPE['opera'],
          version:  matchBS[2] || '0',
        }
      }
   
      //Safari（苹果）浏览器
      matchBS = rSafari.exec(ua)
      if (matchBS != null && !window.attachEvent && !window.chrome && !window.opera) {
        return {
          browser: BROWSER_TYPE['safari'],
          version: matchBS[1] || '0',
        }
      }
      //谷歌浏览器
      matchBS = rChrome.exec(ua)
      if (matchBS != null && !window.attachEvent) {
        matchBS2 = rNewOpera.exec(ua)
        if (matchBS2 == null) {
          return {
            browser: BROWSER_TYPE['chrome'],
            version: matchBS[2] || '0',
          }
        } else {
          return {
            browser: BROWSER_TYPE['opera'],
            version: matchBS2[2] || '0',
          }
        }
      }
    },
    getNetInfo: function(){
      if(navigator.connection){
        return navigator.connection.type ? navigator.connection.type : ''  
      }else{
        return ''
      }
    },
    
  }  