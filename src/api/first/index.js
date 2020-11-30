import request from '@/utils/request'
// import qs from 'qs'
// import Cookies from 'js-cookie'

export function websocket(data) {
  return request({
    url: '/first/connWebsocket',
    method: 'post'
  })
}
