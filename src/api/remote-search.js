import request from '@/utils/request'

export function searchUser(name) {
  return request({
    url: '/search/author',
    method: 'get',
    params: { name }
  })
}
export function searchCate() {
  return request({
    url: '/search/category',
    method: 'get'
  })
}
export function transactionList(query) {
  return request({
    url: '/vue-element-admin/transaction/list',
    method: 'get',
    params: query
  })
}
