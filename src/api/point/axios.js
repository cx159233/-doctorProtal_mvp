import axios from 'axios'
const API_ROOT = window.CONFIG&&window.CONFIG.apiRoot

// 创建axios实例
const instance = axios.create({
  baseURL: API_ROOT,
  timeout: 3000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
})
// 响应错误
const err = (error) => {
    console.log(error)
    return
}

// 请求拦截
instance.interceptors.request.use(config => {
  // 后面需删除   账户管理需移出去
  // 在发送请求之前做些什么
  if (!config.data) config.data = {}
  return config
}, err)
 
// 相应拦截
instance.interceptors.response.use(res => {
  const { code, message } = res.data
  if (code === 401 || code === 403) { // 401 或者 403处理
    console.log(message)
    return
  }
  // 处理其他不等于200的状态码
  if (code !== 200) {
    console.log(message)
    return
  }
  return res.data || res
}, err)

export {
  instance as axios
}