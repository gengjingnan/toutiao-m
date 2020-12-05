/**
 * 频道列表
 */
import require from '@/utils/request'
// 获取全部频道列表
export const getAllChannelList = () => {
  return require({
    method: 'get',
    url: '/app/v1_0/channels'
  })
}
// 批量修改用户频道列表
export const editUserChannels = (id, seq) => {
  return require({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data: {
      channels: [
        {
          id,
          seq
        }
      ]
    }
  })
}
// 删除指定用户频道
export const deleteUserChannels = id => {
  return require({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${id}`
  })
}
