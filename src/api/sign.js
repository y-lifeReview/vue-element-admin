import request from '@/utils/request'
// 获取签名
export function getSignList(query) {
  return request({
    url: '/signlist',
    method: 'get',
    params: query
  })
}
// 修改签名
export function changeSign(id, content) {
  return request({
    url: '/changesign',
    method: 'post',
    data: {
      id,
      content
    }
  })
}
// 新增签名
export function addSignReq(content) {
  return request({
    url: '/addsign',
    method: 'post',
    data: {
      content
    }
  })
}
// 删除签名
export function delSign(id) {
  return request({
    url: '/delsign',
    method: 'post',
    data: {
      id
    }
  })
}
