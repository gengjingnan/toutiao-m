<template>
  <div class="comment-item">
    <van-cell>
      <van-image
        slot="icon"
        round
        width="30"
        height="30"
        style="margin-right: 10px;"
        :src="comment.aut_photo"
      />
      <span style="color: #466b9d;" slot="title">{{ comment.aut_name }}</span>
      <div slot="label">
        <p style="color: #363636;">{{ comment.content }}</p>
        <p>
          <span style="margin-right: 10px;">{{
            comment.pubdate | relativeTime
          }}</span>
          <van-button
            size="mini"
            type="default"
            @click="$emit('reply-show', comment)"
            >回复{{ comment.reply_count }}</van-button
          >
        </p>
      </div>
      <van-icon
        slot="right-icon"
        :name="comment.is_liking ? 'good-job' : 'good-job-o'"
        :color="comment.is_liking ? '#e5645f' : ''"
        @click="onLike(comment)"
      >
        {{ comment.like_count || '赞' }}
      </van-icon>
    </van-cell>
  </div>
</template>
<script>
// 导入评论列表的请求
import { likeCommentsItem, deleteLikeCommentsItem } from '@/api/comment'
export default {
  name: 'CommentItem',
  components: {},
  props: {
    // 每一项评论
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLike(item) {
      try {
        if (item.is_liking) {
          //  取消对评论点赞
          await deleteLikeCommentsItem(item.com_id)
          // 点赞数量-1
          item.like_count--
        } else {
          //  添加对评论点赞
          await likeCommentsItem(item.com_id)
          // 点赞数量+1
          item.like_count++
        }
        item.is_liking = !item.is_liking
      } catch (err) {
        this.$toast('点赞失败,请稍后重试!')
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
