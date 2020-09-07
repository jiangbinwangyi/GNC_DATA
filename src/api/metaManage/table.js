import request from '@/utils/request'
import qs from 'qs'
import Cookies from 'js-cookie'

export function fetchList(query) {
  const res = JSON.parse(JSON.stringify(query))
  if (query.page) {
    res.page = query.page - 1
  }
  return request({
    url: '/meta/table/getTableList',
    method: 'GET',
    params: res
  })
}

export function deleteArticle(userId) {
  return request({
    url: '/sys/satellite/delStatellite',
    method: 'DELETE',
    data: qs.stringify({ userId })
  })
}

export function createArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/satellite/createSatellite',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/satellite/editSatellite',
    method: 'post',
    data: qs.stringify(data)
  })
}
