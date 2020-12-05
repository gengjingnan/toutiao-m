<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(suggest, index) in searchSuggestions"
      :key="index"
      icon="search"
      @click="$emit('search', suggest)"
    >
      <div slot="title" v-html="highlight(suggest)"></div>
    </van-cell>
  </div>
</template>
<script>
// 导入搜索联想建议请求
import { getSearchSuggestions } from '@/api/search'
// 按需导入防抖函数
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchValue: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 联想搜索建议列表
      searchSuggestions: []
    }
  },
  computed: {},
  watch: {
    // 监听输入框数据的变化
    searchValue: {
      // 处理搜索时的防抖,控制执行时间为停止输入后200毫秒,如果期间再次触发该事件,则重新计时
      handler: debounce(function() {
        // 获取搜索请求的数据
        this.loadSearchSuggestions()
      }, 200),
      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  created() {},
  mounted() {},
  methods: {
    async loadSearchSuggestions() {
      try {
        // 获取搜索请求的数据
        const { data: res } = await getSearchSuggestions(this.searchValue)
        // console.log(res)
        this.searchSuggestions = res.data.options
      } catch (err) {
        this.$toast('获取联想建议失败')
      }
    },
    // 控制搜索联想建议关键字高亮
    highlight(suggest) {
      const reg = new RegExp(this.searchValue, 'gi')
      return suggest.replace(
        reg,
        `<span style="color:#3296fa">${this.searchValue}</span>`
      )
    }
  }
}
</script>
<style lang="less" scoped></style>
