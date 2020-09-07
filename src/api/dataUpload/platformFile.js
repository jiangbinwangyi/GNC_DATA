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
    url: '/upload/platform/file/getFileSourceList',
    method: 'GET',
    params: res
  })
}

export function deleteArticle(pfsId) {
  return request({
    url: '/upload/platform/file/delFileSourceById',
    method: 'DELETE',
    data: qs.stringify({ pfsId })
  })
}

export function createArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/upload/platform/file/createFileSource',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/upload/platform/file/editFileSource',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function testSource(pfsId) {
  return request({
    url: '/upload/platform/file/testFileSourceById',
    method: 'post',
    data: qs.stringify({ pfsId })
  })
}
