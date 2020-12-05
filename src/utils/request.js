//  封装 axios 请求模块
import axios from 'axios'
// 导入store组件
import store from '@/store'
// 导入JSONBig
import JSONBig from 'json-bigint'

// axios的实例对象
const request = axios.create({
  // 配置接口的基准路径
  baseURL: 'http://ttapi.research.itcast.cn',
  // `transformResponse` allows changes to the response data to be made before
  // it is passed to then/catch
  // 自定义后端返回的原始数据
  transformResponse: [
    function(data) {
      // console.log(data)
      try {
        return JSONBig.parse(data)
      } catch (err) {
        return data
      }
    }
  ]
})
// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(
  function(config) {
    const { user } = store.state
    // Do something before request is sent
    // 请求发起会经过这里
    // 配置请求头
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function(error) {
    // Do something with request error
    // 请求出错了会经过这里(请求还未发出)
    return Promise.reject(error)
  }
)
// 响应拦截器
request.interceptors.response.use(
  // 响应正常,返回原结果
  function(res) {
    return res
  },
  // 响应失败,判断响应类型后更新本地token
  async function(err) {
    console.dir(err)
    if (err.response.status === 401) {
      // 该条件成立说明token过期 调用接口刷新用户token
      // 从仓库中获取本地的refresh_token
      const refreshToken = store.state.user.refresh_token
      // 发送请求更新token
      const { data: res } = await axios({
        method: 'PUT',
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        headers: {
          Authorization: 'Bearer ' + refreshToken
        }
      })
      // 请求成功
      // 将仓库中的token修改
      const newToken = res.data.token
      store.commit('setUser', {
        token: newToken,
        refresh_token: refreshToken
      })
      // 重新调用失败的接口
      return request(err.config)
    }
  }
)
export default request
