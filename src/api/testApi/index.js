import request from '@/utils/request'
// import qs from 'qs'
// import Cookies from 'js-cookie'

export function getModel() {
  return request({
    url: '/test/getModel',
    method: 'GET',
    params: {}
  })
}

export function getTestByModel() {
  return request({
    url: '/test/getTestByModel',
    method: 'GET',
    params: {}
  })
}

export function getData() {
  return request({
    url: '/test/getDate',
    method: 'GET',
    params: {}
  })
}
