/**
 * 评论请求模块
 */
// 导入axios实例
import request from '../utils/request'
// 获取评论列表
export const getCommentsList = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params
  })
}
// 对评论或评论回复点赞
export const likeCommentsItem = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target // 点赞评论的id
    }
  })
}
// 取消对评论或评论回复点赞
export const deleteLikeCommentsItem = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${target}`
  })
}
