import API from '@/services/api'

// 获取用户信息
export function getUserDetailDao(uid: number) {
  return API.get({
    url: '/user/detail',
    data: {
      uid
    }
  })
}

// 签到
export function doDailySigninDao() {
  return API.get({
    url: '/daily_signin',
  })
}

// 登出
export function doLogoutDao() {
  return API.get({
    url: '/logout',
  })
}
