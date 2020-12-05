<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="refreshing"
      :success-text="isRefreshingSuccess"
      success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(item, index) in articleList"
          :key="index"
          :title="item.title"
          :article="item"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'articleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  // props: ['channel'],
  data() {
    return {
      // 文章数据列表
      articleList: [],
      // 控制数据加载状态
      loading: false,
      // 控制数据加载结束状态
      finished: false,
      // 请求失败
      error: false,
      // 下拉刷新
      refreshing: false,
      // 时间戳
      timestamp: null,
      // 刷新成功
      isRefreshingSuccess: '刷新成功'
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 加载文章列表
    async onLoad() {
      // 异步更新数据
      try {
        const { data: res } = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 0 // 进入页面第一次请求时要包含置顶文章
        })
        const { results } = res.data
        // console.log(res)
        this.articleList.push(...results)
        // 判断是否全部加载完成
        if (results.length) {
          // 更新时间戳
          this.timestamp = res.data.pre_timestamp
        } else {
          this.finished = true
        }
        // 加载状态结束
        this.loading = false
        // // 模拟请求错误的状态
        // if (Math.random() > 0.5) {
        //   JSON.parse('aasss')
        // }
      } catch (err) {
        this.loading = false
        this.error = true
      }
    },
    // 刷新文章列表
    async onRefresh() {
      // 异步更新数据
      try {
        const { data: res } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(), // 时间戳
          with_top: 0 // 进入页面第一次请求时要包含置顶文章
        })
        const { results } = res.data
        // console.log(res)
        // 将数据追加到列表的顶部
        this.articleList.unshift(...results)
        // this.articleLis = results
        this.isRefreshingSuccess = `更新成功,更新了${results.length}条数据`
        this.refreshing = false
        // 模拟请求错误的状态
        // if (Math.random() > 0.5) {
        //   JSON.parse('aasss')
        // }
      } catch (err) {
        this.isRefreshingSuccess = '更新失败,请稍后重试'
        this.refreshing = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .article-list {
  // height: 79vh;
  height: calc(100vh -174px);
  overflow-y: auto;
}
</style>
