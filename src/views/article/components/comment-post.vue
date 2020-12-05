<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button
      class="post-btn"
      @click="postComment"
      :disabled="!message.length"
      >发布</van-button
    >
  </div>
</template>

<script>
// 导入添加评论或评论回复的数据请求
import { postComment } from '@/api/article'
export default {
  name: 'CommentPost',
  components: {},
  props: {
    target: {
      type: [Number, String, Object],
      required: true
    }
  },
  inject: {
    art_id: {
      type: [Number, String, Object],
      default: null
    }
  },
  data() {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async postComment() {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续展示 toast
      })
      try {
        const { data } = await postComment({
          target: this.target.toString(), // 文章id
          content: this.message, // 评论内容
          art_id: this.art_id ? this.art_id.toString() : this.art_id // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        })
        // console.log(data)
        // 清空输入框内容
        this.message = ''
        this.$emit('post-success', data.data)
        this.$toast('发布成功')
      } catch (error) {
        this.$toast('发布失败,请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
