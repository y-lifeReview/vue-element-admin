import request from '@/utils/request'

export function getVisitorCount(query) {
  return request({
    url: '/visitorCount',
    method: 'get',
    params: query
  })
}
export function getVisitorLine(query) {
  return request({
    url: '/visLineData',
    method: 'get',
    params: query
  })
}
export function getCateInfo(query) {
  return request({
    url: '/cateInfo',
    method: 'get',
    params: query
  })
}
export function getIpLast(query) {
  return request({
    url: '/ipLast',
    method: 'get',
    params: query
  })
}
