import request from '@/utils/request'
// import qs from 'qs'
// import Cookies from 'js-cookie'

export function fetchList(query) {
  let res = {}
  if (query) {
    res = JSON.parse(JSON.stringify(query))
    res.page = query.page - 1
  }
  return request({
    url: '/sys/classification/getAllCD',
    method: 'GET',
    params: res
  })
}

export function getMenuByCDId(cdId) {
  return request({
    url: '/sys/classification/getMenuByCDID',
    method: 'GET',
    params: { cdId }
  })
}
