<template>
  <div class="like-article">
    <van-button
      :class="{ liked: value === 1 }"
      :icon="value === 1 ? 'good-job' : 'good-job-o'"
      @click="changeLiked"
      :loading="loading"
    />
  </div>
</template>
<script>
// 导入点赞及取消点赞的请求
import { likeArticle, deleteLikeArticle } from '@/api/article'
export default {
  name: 'LikeArticle',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    },
    target: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async changeLiked() {
      this.loading = true
      try {
        let status = 0
        if (this.value === 1) {
          // 已经点赞,取消点赞
          await deleteLikeArticle(this.target)
          this.$toast.success('已取消点赞')
          status = 0
        } else {
          // 未点赞,添加点赞
          await likeArticle(this.target)
          this.$toast.success('点赞成功')
          status = 1
        }
        // 修改articleDetailList中attitude的值
        this.$emit('input', status)
      } catch (err) {}
      this.loading = false
    }
  }
}
</script>
<style lang="less" scoped>
.liked {
  .van-button__icon {
    color: #e5645f;
  }
}
</style>
