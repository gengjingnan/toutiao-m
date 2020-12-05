<template>
  <div class="follow-user">
    <van-button
      v-if="articleDetailList.is_followed"
      class="follow-btn"
      round
      :loading="loadingFollowed"
      size="small"
      @click="followed"
      >已关注</van-button
    >
    <van-button
      v-else
      class="follow-btn"
      type="info"
      color="#3296fa"
      round
      :loading="loadingFollowed"
      size="small"
      icon="plus"
      @click="followed"
      >关注</van-button
    >
  </div>
</template>
<script>
// 导入关注及取消关注的数据请求
import { deleteFollowed, addFollowed } from '@/api/user'
export default {
  name: 'FollowUser',
  components: {},
  props: {
    articleDetailList: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 关注按钮加载
      loadingFollowed: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 关注用户
    async followed() {
      try {
        // console.log(this.articleDetailList.aut_id)
        this.loadingFollowed = true // 展示按钮的加载状态
        if (this.articleDetailList.is_followed) {
          // 取消关注
          await deleteFollowed(this.articleDetailList.aut_id)
        } else {
          // 去关注
          await addFollowed(this.articleDetailList.aut_id)
        }
        this.articleDetailList.is_followed = !this.articleDetailList.is_followed
      } catch (err) {
        // console.dir(err)
        if (err.response && err.response.status === 400) {
          this.$toast('您不可以关注自己哦')
        }
        this.$toast(err.response.message)
      }
      this.loadingFollowed = false // 关闭按钮的加载状态
    }
  }
}
</script>
<style lang="less" scoped></style>
