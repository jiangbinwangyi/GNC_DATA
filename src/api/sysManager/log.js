import request from '@/utils/request'

export function fetchList(query) {
  let res = {}
  if (query) {
    res = JSON.parse(JSON.stringify(query))
    res.page = query.page - 1
  }
  return request({
    url: '/sys/log/getLogList',
    method: 'GET',
    params: res
  })
}
