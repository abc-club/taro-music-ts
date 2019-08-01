import API from '@/services/api'

// 获取推荐歌单
export function LoginDao(phone: string, password: string) {
  return API.get({
    url: '/login/cellphone',
    data: {
      phone,
      password
    }
  })
}
