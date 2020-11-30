import request from '@/utils/request'
import qs from 'qs'
import Cookies from 'js-cookie'

export function login(data) {
  return request({
    url: '/api/login/login.do',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getInfo(userId) {
  return request({
    url: '/sys/user/getUserById',
    method: 'get',
    params: { userId }
  })
}

export function getMenuListByUserId(userId) {
  return request({
    url: '/sys/user/getMenuListByUserId',
    method: 'post',
    data: qs.stringify({ userId })
  })
}

export function editPassword(data) {
  data.userId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/user/changePasswd',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 登出暂时不用
export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
