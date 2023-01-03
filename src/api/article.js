import request from '@/utils/request'

export function getArtList(query) {
  return request({
    url: '/articleList',
    method: 'get',
    params: query
  })
}

export function articlePub(data) {
  return request({
    url: '/article/pub',
    method: 'post',
    data
  })
}
export function draftInfo(id) {
  return request({
    url: '/draft/info',
    method: 'get',
    params: {
      id
    }
  })
}
// 草稿更新
export function draftUpdate(data) {
  return request({
    url: '/article/save',
    method: 'post',
    data
  })
}
// 文章删除
export function deleteArticle(id) {
  return request({
    url: '/article/delete',
    method: 'post',
    data: {
      id
    }
  })
}

//

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}
export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: {
      pv
    }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
