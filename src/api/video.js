import request from '@/utils/request'
// 新增视频合集
export function addVideoCategory(title, urls, isPassword, ques, anwser) {
  return request({
    url: '/addVideoCate',
    method: 'post',
    data: {
      title,
      isPassword,
      ques,
      anwser,
      urls
    }
  })
}
// 查看合集
export function getVideoCategory() {
  return request({
    url: '/getVideoCate',
    method: 'get'
  })
}
// 查看合集内视频
export function getVideoDetail(id) {
  return request({
    url: '/getVideoDetail',
    method: 'get',
    params: {
      id
    }
  })
}

// 新增视频
export function addVideo(id, src) {
  return request({
    url: '/addVideo',
    method: 'post',
    data: {
      id,
      src
    }
  })
}
// 视频删除
export function delVideo(id, islast) {
  return request({
    url: '/delVideo',
    method: 'post',
    data: {
      id,
      islast
    }
  })
}

