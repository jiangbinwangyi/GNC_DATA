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
    url: '/upload/platform/database/getDatabaseList',
    method: 'GET',
    params: res
  })
}

export function deleteArticle(pdiId) {
  return request({
    url: '/upload/platform/database/delDatabase',
    method: 'DELETE',
    data: qs.stringify({ pdiId })
  })
}

export function createArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/upload/platform/database/createDatabase',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/upload/platform/database/editDatabase',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function testSource(pdiId) {
  return request({
    url: '/upload/platform/database/testDatabase',
    method: 'post',
    data: qs.stringify({ pdiId })
  })
}

export function viewSourceTable(pdiId) {
  return request({
    url: '/upload/platform/database/getTableByDatabase',
    method: 'post',
    data: qs.stringify({ pdiId })
  })
}
