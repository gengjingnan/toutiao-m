<template>
  <div class="collect-article">
    <van-button
      :class="{ collected: is_collected }"
      :icon="is_collected ? 'star' : 'star-o'"
      @click="changeCollected"
      :loading="loading"
    />
  </div>
</template>
<script>
// 导入收藏文章及取消文章收藏的请求
import { deleteCollectArticle, collectArticle } from '@/api/article'
export default {
  name: '',
  components: {},
  props: {
    is_collected: {
      type: Boolean,
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
    async changeCollected() {
      // console.log(11)
      this.loading = true
      try {
        if (this.is_collected) {
          // 已经收藏,取消收藏
          await deleteCollectArticle(this.target)
        } else {
          // 没有收藏,添加收藏
          await collectArticle(this.target)
        }
        this.$emit('update:is_collected', !this.is_collected)
      } catch (err) {
        console.dir(err)
        this.$toast('收藏文章失败,请稍后重试!')
      }
      this.loading = false
    }
  }
}
</script>
<style lang="less" scoped>
.collected {
  .van-button__icon {
    color: #ffa500;
  }
}
</style>
