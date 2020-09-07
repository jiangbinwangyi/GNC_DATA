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
    url: '/sys/department/getDepartmentList',
    method: 'GET',
    params: res
  })
}

export function deleteArticle(departmentId) {
  return request({
    url: '/sys/department/delDpeartment',
    method: 'DELETE',
    data: qs.stringify({ departmentId })
  })
}

export function createArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/department/createDpeartment',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/department/editDpeartment',
    method: 'post',
    data: qs.stringify(data)
  })
}
