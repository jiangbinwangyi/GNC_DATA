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
    url: '/sys/navbar/getNavbarList',
    method: 'GET',
    params: res
  })
}

export function deleteArticle(navbarId) {
  return request({
    url: '/sys/navbar/delNavbar',
    method: 'POST',
    data: qs.stringify({ navbarId })
  })
}

export function createArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/navbar/addNavbar',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/navbar/editNavbar',
    method: 'post',
    data: qs.stringify(data)
  })
}
