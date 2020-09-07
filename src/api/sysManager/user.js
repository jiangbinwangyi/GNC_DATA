import request from '@/utils/request'
import qs from 'qs'
import Cookies from 'js-cookie'

export function fetchList(query) {
  let res = {}
  if (query) {
    res = JSON.parse(JSON.stringify(query))
    res.page = query.page - 1
  }
  return request({
    url: '/sys/user/getUserList',
    method: 'GET',
    params: res
  })
}

export function deleteArticle(userId, mustDel) {
  return request({
    url: '/sys/user/delUser',
    method: 'DELETE',
    data: qs.stringify({ userId, mustDel })
  })
}

export function createArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/user/saveUser',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/user/editUser',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function resetPasswd(userId) {
  return request({
    url: '/sys/user/resetPasswd',
    method: 'post',
    data: qs.stringify({ userId })
  })
}

export function editRoleList(data) {
  return request({
    url: '/sys/user/editUserRoleRSByUserId',
    method: 'post',
    data: qs.stringify(data)
  })
}
