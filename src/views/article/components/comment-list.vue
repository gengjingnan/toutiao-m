<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <comment-item
        v-for="(item, index) in list"
        :key="index"
        :comment="item"
        @reply-show="$emit('reply-show', $event)"
      ></comment-item>
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <!-- <van-cell-group class="publish-wrap">
      <van-field clearable placeholder="请输入评论内容">
        <van-button slot="button" size="mini" type="info">发布</van-button>
      </van-field>
    </van-cell-group> -->
    <!-- /发布评论 -->
  </div>
</template>

<script>
// 导入评论列表的请求
import { getCommentsList } from '@/api/comment'
// 导入comment-item子组件
import CommentItem from '../components/comment-item'
export default {
  name: 'CommentList',
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    type: {
      type: String,
      validator(value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    },
    // 评论列表
    list: {
      type: Array,
      default: () => []
    }
  },
  components: {
    CommentItem
  },
  data() {
    return {
      // list: [], // 评论列表
      loading: false, // 上拉加载更多的
      finished: false, // 是否加载结束
      offset: null, // 评论数据的偏移量
      limit: 10, // 每页显示的数量
      error: false // 控制加载失败的显示与隐藏
    }
  },
  created() {
    this.onLoad()
  },
  watch: {},
  methods: {
    // 加载评论列表
    async onLoad() {
      this.loading = true
      try {
        const { data: res } = await getCommentsList({
          type: this.type,
          source: this.source.toString(), // 文章id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数
        })
        // console.log(res)
        const { results } = res.data
        this.list.push(...results)
        // 父组件显示评论总数
        this.$emit('total-count', res.data)
        // 加载状态结束
        this.loading = false
        // 数据全部加载完成
        if (results.length) {
          // 有数据就更新获取下一页的数据页码
          this.offset = res.data.last_id
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
