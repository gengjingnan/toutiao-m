/**
 * 文章请求模块
 */
import request from '@/utils/request'

// 请求获取文章数据列表

export const getArticles = params => {
  return request({
    method: 'get',
    url: '/app/v1_1/articles',
    params
  })
}
// 获取新闻文章详情
// articleID需要转为字符串传递给后台
export const getArticleDetails = articleID => {
  return request({
    method: 'get',
    url: `/app/v1_0/articles/${articleID}`
  })
}

// 收藏文章
export const collectArticle = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/collections',
    data: {
      target
    }
  })
}
// 取消收藏文章
export const deleteCollectArticle = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/collections/${target}`
  })
}
// ================================================
// 点赞文章
export const likeArticle = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target
    }
  })
}
// 取消点赞文章
export const deleteLikeArticle = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${target}`
  })
}
// 添加评论或评论回复
export const postComment = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data
  })
}
