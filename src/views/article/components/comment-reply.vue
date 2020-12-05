<template>
  <div class="comment-reply">
    <van-nav-bar :title="total_reply">
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <!-- 当前评论项 -->
    <div class="scroll-wrap">
      <comment-item :comment="comment"></comment-item>

      <!-- 全部回复列表 -->
      <van-cell title="全部回复" />
      <comment-list
        :list="commentList"
        :source="comment.com_id"
        type="c"
      ></comment-list>
    </div>
    <!-- 评论按钮 -->
    <div class="post-wrap">
      <van-button
        class="post-btn"
        size="small"
        round
        @click="showReplyPopup = true"
        >写评论</van-button
      >
    </div>
    <!-- 发布评论 -->
    <van-popup v-model="showReplyPopup" position="bottom">
      <comment-post
        :target="comment.com_id"
        @post-success="postSuccesshandle"
      ></comment-post>
    </van-popup>
  </div>
</template>
<script>
// 导入comment-item子组件 渲染当前评论项
import CommentItem from '../components/comment-item'
// 导入comment-list组件 渲染搜索回复列表
import CommentList from '../components/comment-list'
// 导入comment-post组件
import CommentPost from '../components/comment-post'
export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showReplyPopup: false,
      commentList: []
    }
  },
  computed: {
    total_reply() {
      if (this.comment.reply_count) {
        return `共${this.comment.reply_count}条回复`
      } else {
        return '暂无回复'
      }
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    postSuccesshandle(comment) {
      // 更新回复的数据
      this.comment.reply_count++
      // 关闭弹层
      this.showReplyPopup = false
      // 更新数据列表
      this.commentList.unshift(comment.new_obj)
    }
  }
}
</script>
<style lang="less" scoped>
.scroll-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 92px;
  bottom: 88px;
  overflow-y: auto;
}
// 底部评论区域
.post-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88px;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
</style>
