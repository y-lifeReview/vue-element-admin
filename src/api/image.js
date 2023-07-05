import request from '@/utils/request'
// 新增相册分类
export function addImageCategory(title, imgs) {
  return request({
    url: '/addImageCate',
    method: 'post',
    data: {
      title,
      imgs
    }
  })
}
// 获取全部相册
export function getImageCategory() {
  return request({
    url: '/getImageCate',
    method: 'get'
  })
}
// 获取相册图片
export function getImageDetail(id) {
  return request({
    url: '/getImageDetail',
    method: 'get',
    params: {
      id
    }
  })
}
// 图片删除
export function delImage(id, islast) {
  return request({
    url: '/delImage',
    method: 'post',
    data: {
      id,
      islast
    }
  })
}
// 新增图片
export function addImage(id, src) {
  return request({
    url: '/addImage',
    method: 'post',
    data: {
      id,
      src
    }
  })
}
