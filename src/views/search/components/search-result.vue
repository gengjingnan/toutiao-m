<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <van-cell
        v-for="item in resultsList"
        :key="item.aut_id"
        :title="item.title"
      />
    </van-list>
  </div>
</template>
<script>
// 导入获取搜索结果的请求模块
import { getSearchResults } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchKey: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      resultsList: [],
      // 是否加载加载
      loading: false,
      // 加载完成
      finished: false,
      // 加载失败
      error: false,
      // 页数
      page: 1,
      // 每页数量
      per_page: 20
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      try {
        // 发送请求获取数据
        const { data: res } = await getSearchResults({
          page: this.page,
          per_page: this.per_page,
          q: this.searchKey
        })
        const { results } = res.data
        // console.log(data)
        // 将数据添加到数组列表中
        this.resultsList.push(...results)
        // 加载状态结束
        this.loading = false
        // 数据全部加载完成
        if (results.length) {
          // 如果未加载完成,则在后一页继续加载,斗则加载完成
          this.page++
        } else {
          this.finished = true
        }
        // 模拟请求错误的状态
        if (Math.random() > 0.5) {
          JSON.parse('aasss')
        }
      } catch (err) {
        this.error = true
        // 加载状态结束
        this.loading = false
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
