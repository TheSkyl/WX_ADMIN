import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  data['grant_type'] = 'password'
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Authorization': 'Basic YzE6c2VjcmV0'
    },
    data: qs.stringify(data)
  })
}

export function getInfo(token) {
  return request({
    url: '/auth/userInfo',
    method: 'get',
    params: { token }
  })
}
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
