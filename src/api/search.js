/**
 * 搜索请求
 */
// 导入axios实例
import request from '../utils/request'
// 获取联想建议（自动补全）
export const getSearchSuggestions = q => {
  return request({
    method: 'get',
    url: '/app/v1_0/suggestion',
    params: { q }
  })
}
// 获取搜索结果
export const getSearchResults = params => {
  return request({
    method: 'get',
    url: '/app/v1_0/search',
    params
  })
}
