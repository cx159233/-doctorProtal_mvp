import qs from 'qs'
import CryptoJS from 'crypto-js'
const getUtf8Bytes = str =>
  new Uint8Array(
    [...unescape(encodeURIComponent(str))].map(c => c.charCodeAt(0))
  )

const access_key = process.env.VUE_APP_HMAC_ACCESS_KEY || 'enayw5qdna'
const secret_key_bytes = getUtf8Bytes(process.env.VUE_APP_HMAC_SECRET_KEY || 'bv62d6yjjgjdqi3a')

/**
 * 生成签名头信息的字符串
 * 根据环境变量中设定的签名头信息，将对应的头信息值从headers对象中提取出来，并拼接成字符串
 *
 * @param {Object} headers - 包含所有头信息的键值对对象
 * @returns {string} - 返回签名头信息的字符串，格式为'头名:头值\n'
 */
const getSignedHeadersString = (headers) => {
  const signedHeaders = process.env.VUE_APP_HMAC_SIGNED_HEADERS
  if (!signedHeaders) return ''
  const signedHeadersList = signedHeaders.split(';')
  return signedHeadersList.map(item => {
    return item + ':' + headers[item] + '\n'
  }).join('')
}
async function importKeyAndSign(secret_key_bytes, dataToSign) {
  // 将 secret_key_bytes 转换为 CryptoJS 字节数组
  const secretKey = CryptoJS.lib.WordArray.create(secret_key_bytes)

  // 使用 HMAC-SHA256 进行签名
  const hmacSignature = CryptoJS.HmacSHA256(dataToSign, secretKey)
  return CryptoJS.enc.Base64.stringify(hmacSignature)
}
const combineURLs = (baseURL, relativeURL) => {
  // 将baseURL最后的斜杠和relativeURL最前面的斜杠去掉
  // return relativeURL ? `${baseURL.replace(/\/+$/, '')}/${relativeURL.replace(/^\/+/, '')}` : baseURL
  return '/'
}

// 按照asic码排序
const sortByAscii = (obj) => {
  return Object.keys(obj).sort().reduce((acc, key) => {
    acc[key] = obj[key]
    return acc
  }, {})
}

// 生成uuid
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
    return v.toString(16)
  })
}

// /patient/phone/history?cardno=123，解析字符串中的参数返回对象，格式
/**
 * 解析url中的参数，返回对象
 * @param {*} url string
 * @returns object
 */
const parseQueryString = (url) => {
  const result = {}
  // 分割URL和查询字符串
  const [, queryString] = url.split('?')

  if (queryString) {
    // 分割每个参数对
    const pairs = queryString.split('&')
    pairs.forEach(pair => {
      // 分割键值对
      const [key, value] = pair.split('=')
      // 解码并添加到结果对象
      result[decodeURIComponent(key)] = decodeURIComponent(value)
    })
  }

  return result
}

// 判断是否是空对象
// const isEmptyObject = (obj) => {
//   return Object.keys(obj).length === 0
// }

// 获取dataToSign
const getBodyToSign = (method, data) => {
  if (method === 'get') {
    return ''
  }
  return data ? JSON.stringify(data) : '{}'
}

const hmacAuth = async (config) => {
  const {
    method,
    baseURL,
    headers,
    url,
    data,
    params
  } = config
  // 组合params和url的参数
  const combineUrlAndParams = {
    ...parseQueryString(url),
    ...(params ? params : {})
  }
  // console.log('combineUrlAndParams', combineUrlAndParams)
  const canonical_query_string = combineUrlAndParams ? qs.stringify(sortByAscii(combineUrlAndParams)) : ''
  // console.log(canonical_query_string)

  const path = combineURLs(baseURL, url) // 假设 url 是完整路径
  const dateGmt = (new Date()).toGMTString() + ' ' +generateUUID()
  const signed_headers_string = getSignedHeadersString(headers)
  const signingString = `${method.toUpperCase()}\n${path}\n${canonical_query_string}\n${access_key}\n${dateGmt}\n${signed_headers_string}`
  const signatureBase64 = await importKeyAndSign(secret_key_bytes, signingString)
  // const bodyRowBase64 = await importKeyAndSign(secret_key_bytes, data ? JSON.stringify(data) : '')
  const bodyRowBase64 = await importKeyAndSign(secret_key_bytes, getBodyToSign(method, data))

  config.headers['X-HMAC-SIGNATURE'] = signatureBase64
  config.headers['X-HMAC-ACCESS-KEY'] = access_key
  config.headers['CUSTOM-DATE'] = dateGmt
  config.headers['X-HMAC-ALGORITHM'] = 'hmac-sha256'
  config.headers['X-HMAC-DIGEST'] = bodyRowBase64
}

export default hmacAuth