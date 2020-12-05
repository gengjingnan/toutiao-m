// 导入vue
import Vue from 'vue'
// 加载dayjs包
import dayjs from 'dayjs'
// 加载中文语言包
import 'dayjs/locale/zh-cn'
// 加载相对时间的插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 配置使用relativeTime
dayjs.extend(relativeTime)
// 使用中文版本
dayjs.locale('zh-cn') // 全局使用
// console.log(dayjs().to(dayjs('2020-11-11'))) // 2 年以前)
// 定义全局过滤器  相当于一个全局的方法
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
