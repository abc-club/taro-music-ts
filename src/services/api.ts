import Taro from '@tarojs/taro'
import qs from 'qs'
import {
  BASE_URL,
  HTTP_ERROR
} from '../config/index'

/**
 * 检查http状态值
 * @param response
 * @returns {*}
 */
function checkHttpStatus(response: API.Response, resolve, reject) {
  if (response.statusCode >= 200 && response.statusCode < 300) {
    resolve(response.data)
  } else {
    const message = HTTP_ERROR[response.statusCode] || `ERROR CODE: ${response.statusCode}`
    response.data.errorCode = response.statusCode
    response.data.error = message
    reject(response.data)
  }
}

function setCookie(response: API.Response) {
  if (response.cookies && response.cookies.length > 0) {
    let cookies = ''
    response.cookies.forEach((cookie, index) => {
      // windows的微信开发者工具返回的是cookie格式是有name和value的,在mac上是只是字符串的
      if (cookie.name && cookie.value) {
        cookies += index === response.cookies.length - 1 ? `${cookie.name}=${cookie.value};expires=${cookie.expires};path=${cookie.path}` : `${cookie.name}=${cookie.value};`
      } else {
        cookies += `${cookie};`
      }
    });
    Taro.setStorageSync('cookies', cookies)
  }
  if (response.header && response.header['Set-Cookie']) {
    Taro.setStorageSync('cookies', response.header['Set-Cookie'])
  }
  return response
}

export default {
  request(options: any, method?: string) {
    const { url } = options

    return new Promise((resolve, reject) => {
      Taro.request({
        ...options,
        method: method || 'GET',
        url: `${BASE_URL}${url}`,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          cookie: Taro.getStorageSync('cookies'),
          ...options.header
        },
      }).then(setCookie)
        .then((res) => {
          checkHttpStatus(res, resolve, reject)
        })
    })
  },
  get(options: any) {
    return this.request({
      ...options
    })
  },
  post(options: any) {
    return this.request({
      ...options,
      data: qs.stringify(options.data)
    }, 'POST')
  },
  put(options: any) {
    return this.request({
      ...options,
      data: qs.stringify(options.data)
    }, 'PUT')
  },
  delete(options: any) {
    return this.request({
      ...options,
      data: qs.stringify(options.data)
    }, 'DELETE')
  }
}
