import request from '@/utils/request'
// 获取签名
export function asideInfo() {
  return request({
    url: '/aside/info',
    method: 'get'
  })
}
export function asideShow(is_show, id) {
  return request({
    url: '/aside/show',
    method: 'post',
    data: {
      id,
      is_show
    }
  })
}
export function asideAdd(data) {
  return request({
    url: '/aside/add',
    method: 'post',
    data
  })
}
export function asideChange(data) {
  return request({
    url: '/aside/change',
    method: 'post',
    data
  })
}
