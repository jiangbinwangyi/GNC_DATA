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
    url: '/sys/guest/getGuestList',
    method: 'GET',
    params: res
  })
}

export function deleteArticle(guestId, mustDel) {
  return request({
    url: '/sys/guest/delGuest',
    method: 'DELETE',
    data: qs.stringify({ guestId, mustDel })
  })
}

export function createArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/guest/createGuest',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/guest/editGuest',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function editRoleList(data) {
  return request({
    url: '/sys/guest/editUserRoleRSByGuestId',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function fetchRoleGetByGuestId(userId) {
  return request({
    url: '/sys/user/getRoleListByUserId',
    method: 'post',
    data: qs.stringify({ userId })
  })
}
