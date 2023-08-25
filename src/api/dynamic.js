import request from '@/utils/request'
// 获取签名
export function dynamicPub(data, imgs) {
  return request({
    url: '/dynamic/pub',
    method: 'post',
    data: {
      text: data,
      imgs
    }
  })
}
