import request from '@/utils/request'
import qs from 'qs'
import Cookies from 'js-cookie'

export function fetchList() {
  return request({
    url: '/sys/dictionary/getDictionaryList',
    method: 'GET',
    params: {}
  })
}

export function deleteArticle(dictionaryId) {
  return request({
    url: '/sys/dictionary/delDictionary',
    method: 'DELETE',
    data: qs.stringify({ dictionaryId })
  })
}

export function createArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/dictionary/createDictionary',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateArticle(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/dictionary/editDictionary',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getArticleByCode(data) {
  return request({
    url: '/sys/dictionary/getDataByDictionaryId',
    method: 'get',
    data: qs.stringify(data)
  })
}

export function deleteArticleChild(dictionaryId) {
  return request({
    url: '/sys/dictionary/delDictionaryData',
    method: 'DELETE',
    data: qs.stringify({ dictionaryId })
  })
}

export function createArticleChild(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/dictionary/createDictionaryData',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateArticleChild(data) {
  data.operateId = Cookies.get('USERINFO_ID')
  return request({
    url: '/sys/dictionary/editDictionaryData',
    method: 'post',
    data: qs.stringify(data)
  })
}
