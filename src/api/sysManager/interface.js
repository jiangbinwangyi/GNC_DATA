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
    url: '/sys/interface/getListByGuestId',
    method: 'POST',
    params: res
  })
}

export function deleteArticle(userId) {
  return request({
    url: '/sys/user/delUser',
    method: 'DELETE',
    data: qs.stringify({ userId })
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
