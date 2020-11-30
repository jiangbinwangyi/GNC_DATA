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
    url: '/sys/role/getRoleList',
    method: 'GET',
    params: res
  })
}

export function deleteArticle(roleId, mustDel) {
  return request({
    url: '/sys/role/delRole',
    method: 'DELETE',
    data: qs.stringify({ roleId, mustDel })
  })
}

export function createArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/role/createRole',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/role/editRoleInfo',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function fetchMenuByRoleId(roleId) {
  return request({
    url: '/sys/role/getMenuByRoleId',
    method: 'POST',
    data: qs.stringify({ roleId })
  })
}

export function editMenuByRoleId(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/role/editMenuByRoleId',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function fetchSatelliteByRoleId(roleId) {
  return request({
    url: '/sys/role/getSatelliteByRoleID',
    method: 'POST',
    data: qs.stringify({ roleId })
  })
}

export function editSatelliteByRoleId(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/role/editSatelliteByRoleId',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function editUserByRoleId(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/role/editUserRoleRS',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function fetchUserListByRoleId(roleId) {
  return request({
    url: '/sys/role/getUserListByRoleId',
    method: 'post',
    data: qs.stringify({ roleId })
  })
}

export function fetchGuestListByRoleId(roleId) {
  return request({
    url: '/sys/role/getGuestListByRoleId',
    method: 'post',
    data: qs.stringify({ roleId })
  })
}
