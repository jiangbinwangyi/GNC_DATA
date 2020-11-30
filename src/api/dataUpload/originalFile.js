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
    url: '/upload/original/file/getOriginalFileList',
    method: 'GET',
    params: res
  })
}

export function deleteArticle(ofsId) {
  return request({
    url: '/upload/original/file/delOriginalFileById',
    method: 'DELETE',
    data: qs.stringify({ ofsId })
  })
}

export function createArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/upload/original/file/createOriginalFile',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/upload/original/file/editOriginalFile',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function testSource(ofsId) {
  return request({
    url: '/upload/original/file/testOriginalFile',
    method: 'post',
    data: qs.stringify({ ofsId })
  })
}

export function viewSourceTable(ofsId) {
  return request({
    url: '/upload/original/file/viewFileById',
    method: 'post',
    data: qs.stringify({ ofsId })
  })
}
