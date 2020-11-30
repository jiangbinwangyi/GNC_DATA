import request from '@/utils/request'
import qs from 'qs'
import Cookies from 'js-cookie'
// 获取任务列表
export function fetchList(query) {
  let res = {}
  if (query) {
    res = JSON.parse(JSON.stringify(query))
    res.page = query.page - 1
  }
  return request({
    url: '/upload/single/upload/getTaskList',
    method: 'GET',
    params: res
  })
}
// 第一步提交任务
export function createArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/upload/single/upload/createTask',
    method: 'post',
    headers: { 'content-type': 'application/json;' },
    data
  })
}
// 第三步提交
export function wholeImport(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/upload/whole/upload/setDBMappingByTaskId',
    method: 'post',
    headers: { 'content-type': 'application/json;' },
    data
  })
}
// 第二步校验源信息是否存在
export function validateSource(data) {
  return request({
    url: '/upload/whole/upload/validateSource',
    method: 'post',
    headers: { 'content-type': 'application/json;' },
    data
  })
}
// 第四步获取详细表信息
export function getTableMappingByTaskId(query) {
  const res = JSON.parse(JSON.stringify(query))
  return request({
    url: '/upload/whole/upload/getTableMappingByTaskId',
    method: 'GET',
    params: res
  })
}
// 第四步获取对应数据表详细字段
export function getTableColumn(query) {
  const res = JSON.parse(JSON.stringify(query))
  return request({
    url: '/upload/whole/upload/getTableColumn',
    method: 'GET',
    params: res
  })
}

// 第四步仅保存提交
export function saveTaskById(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/upload/whole/upload/saveTaskById',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 第四步保存并执行
export function execTaskById(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/upload/whole/upload/execTaskById  ',
    method: 'POST',
    data: qs.stringify(data)
  })
}
