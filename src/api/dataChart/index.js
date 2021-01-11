import request from '@/utils/request'
// import qs from 'qs'

export function getSatelliteList() {
  return request({
    url: '/dataAnalysis/ATEbigData/getSatelliteList/',
    method: 'GET'
  })
}

export function getTestprojectInfo(query) {
  const res = JSON.parse(JSON.stringify(query))
  return request({
    // url: '/testPath/testdata/testproject/getTestprojectInfo',
    url: '/dataAnalysis/ATEbigData/getTestprojectInfo/',
    method: 'GET',
    params: res
  })
}

// 新增！！
// 查询数据包，根据型号代号，测试编号查询数据包列表
export function getPackeList(query) {
  const res = JSON.parse(JSON.stringify(query))
  return request({
    url: '/dataAnalysis/ATEbigData/getPackeList/',
    method: 'GET',
    params: res
  })
}

export function getTelemetryList(query) {
  const res = JSON.parse(JSON.stringify(query))
  return request({
    // url: '/testPath/testdata/telemetry/getTelemetryList',
    url: '/dataAnalysis/ATEbigData/getTelemetryList/',
    method: 'GET',
    params: res
  })
}
// 新增！！
// 根据数据包查询遥测工程值
export function getPacketTelemetryList(query) {
  const res = JSON.parse(JSON.stringify(query))
  return request({
    url: '/dataAnalysis/ATEbigData/getPacketTelemetryList/',
    method: 'GET',
    params: res
  })
}

export function getTelemetrySample(data) {
  return request({
    url: '/dataAnalysis/ATEbigData/getTelemetrySample/',
    method: 'post',
    headers: { 'content-type': 'application/json;' },
    data
  })
}

// 时域分析返回数据
export function getTimeDomainResult(data) {
  return request({
    url: '/dataAnalysis/ATEbigData/getTimeDomainResult/',
    method: 'post',
    headers: { 'content-type': 'application/json;' },
    data
  })
}
// 包络分析返回数据
export function getEnvelopeValue(data) {
  return request({
    url: '/dataAnalysis/ATEbigData/getEnvelopeValue/',
    method: 'post',
    headers: { 'content-type': 'application/json;' },
    data
  })
}

// 频域分析返回数据
export function getFFTResult(data) {
  return request({
    url: '/dataAnalysis/ATEbigData/getFFTResult/',
    method: 'post',
    headers: { 'content-type': 'application/json;' },
    data
  })
}

// 新增！！
// 频域分析返回主要频率数据
export function getFFTMainResult(data) {
  return request({
    url: '/dataAnalysis/ATEbigData/getFFTMainResult/',
    method: 'post',
    headers: { 'content-type': 'application/json;' },
    data
  })
}

// 综合比对-差值计算返回数据
export function getDiffValue(data) {
  return request({
    url: '/dataAnalysis/ATEbigData/getDiffValue/',
    method: 'post',
    headers: { 'content-type': 'application/json;' },
    data
  })
}

// 线性拟合返回数据
export function getCurveFitting(data) {
  return request({
    url: '/dataAnalysis/ATEbigData/getCurveFitting/',
    method: 'post',
    headers: { 'content-type': 'application/json;' },
    data
  })
}

// 查询模板保存接口
export function setAnalyzeModel(data) {
  return request({
    url: '/dataAnalysis/ATEtemplate/setAnalyzeModel/',
    method: 'post',
    headers: { 'content-type': 'application/json;' },
    data
  })
}

// 查询模板列表
export function getAnalyzeModelList(data) {
  return request({
    url: '/dataAnalysis/ATEtemplate/getAnalyzeModelList/',
    method: 'post',
    headers: { 'content-type': 'application/json;' },
    params: data,
    data
  })
}

// 根据ID获取查询模板内容
export function getFuzzyAnalyzeModel(query) {
  return request({
    url: '/dataAnalysis/ATEtemplate/getFuzzyAnalyzeModel/',
    method: 'GET',
    params: query
  })
}

// 请求删除查询模板
export function deleteAnalyzeModelList(query) {
  const res = JSON.parse(JSON.stringify(query))
  return request({
    url: '/dataAnalysis/ATEtemplate/deleteAnalyzeModelList/',
    method: 'DELETE',
    params: res
  })
}

