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
    url: '/sys/menu/getMenuList',
    method: 'GET',
    params: res
  })
}

export function deleteArticle(menuId) {
  return request({
    url: '/sys/menu/delMenu',
    method: 'DELETE',
    data: qs.stringify({ menuId })
  })
}

export function createArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/menu/createMenu',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/menu/editMenu',
    method: 'post',
    data: qs.stringify(data)
  })
}
