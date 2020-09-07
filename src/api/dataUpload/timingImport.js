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
    url: '/upload/timing/upload/getTaskList',
    method: 'GET',
    params: res
  })
}
// 第一步提交任务
export function createArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  data.guestId = Cookies.get('USERINFO_ID')
  return request({
    url: '/upload/timing/upload/createTask',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 第三步提交
export function wholeImport(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/upload/timing/upload/setDBMappingByTaskId',
    method: 'post',
    headers: { 'content-type': 'application/json;' },
    data
  })
}

// 第四步仅保存提交
export function saveTaskById(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/upload/timing/upload/saveTaskById',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 第四步保存并执行
export function execTaskById(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/upload/timing/upload/execTaskById  ',
    method: 'POST',
    data: qs.stringify(data)
  })
}
