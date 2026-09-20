# Hmac 加签代码使用说明

[toc]

## 配置说明

> 配置文件需要在 dotent(.env)配置文件中添加几个参数,**<u>如果不配置.env 文件也可以运行，这时使用的是默认值</u>**

```shell
# secret key
VUE_APP_HMAC_SECRET_KEY = "bv62d6yjjgjdqi3a"
# access key
VUE_APP_HMAC_ACCESS_KEY = "enayw5qdna"
# 需要自定义额外识别的headers头信息，多个以”;“分割，正常使用不需要这个字段
# VUE_APP_HMAC_SIGNED_HEADERS = "User-Agent;x-custom-a"

```

## 代码修改

1. 项目使用了两个第三方包需要先安装，`npm install qs crypto-js` 或者`yarn add qs crypto-js`
2. 把代码包复制到项目中，然后在 axios 的配置代码文件中，import 该代码 `import hmacSign from '@/utils/hmacSign`
3. 在请求拦截器中配置如下代码，因为 UTF-16 转 UTF-8 是异步操作，需要使用`async/await`。
   ```javascript
    // 请求拦截
    axiosInstance.interceptors.request.use(async config => {
        ...
        await hmacAuth(config)
        ...
        return config
    }, err)
   ```
