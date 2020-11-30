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
    url: '/upload/original/database/getOriginalDatabaseList',
    method: 'GET',
    params: res
  })
}

export function deleteArticle(odiId) {
  return request({
    url: '/upload/original/database/delOriginalDatabaseById',
    method: 'POST',
    data: qs.stringify({ odiId })
  })
}

export function createArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/upload/original/database/createOriginalDatabase',
    method: 'post',
    timeout: 20 * 1000, // 这个接口比较特殊，只有当数据库
    data: qs.stringify(data)
  })
}

export function updateArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/upload/original/database/editOriginalDatabase',
    method: 'post',
    timeout: 20 * 1000, // 这个接口比较特殊，只有当数据库
    data: qs.stringify(data)
  })
}

export function testSource(odiId) {
  return request({
    url: '/upload/original/database/testOriginalDatabase',
    method: 'post',
    timeout: 20 * 1000, // 这个接口比较特殊，只有当数据库
    data: qs.stringify({ odiId })
  })
}

export function viewSourceTable(odiId) {
  return request({
    url: '/upload/original/database/getOriginalDatabaseTable',
    method: 'get',
    params: { odiId }
  })
}
