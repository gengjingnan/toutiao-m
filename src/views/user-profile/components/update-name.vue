<template>
  <div class="update-name">
    <!-- 导航 -->
    <van-nav-bar
      title="昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onClickRight"
    />
    <!-- 编辑区域 -->
    <div class="field-wrap">
      <van-field
        v-model.trim="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>
<script>
// 导入编辑用户昵称的接口
import { editUserInfo } from '@/api/user'
export default {
  name: 'UpdateName',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 输入框内容
      message: this.value
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //   点击完成按钮触发事件
    async onClickRight() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        if (this.message.length === 0) {
          this.$toast('昵称不能为空')
          return
        }
        const { data: res } = await editUserInfo({
          name: this.message
        })
        // console.log(data)
        this.$emit('input', res.data.name)
        // 关闭弹层
        this.$emit('close')
        this.$toast.success('更新成功')
      } catch (err) {
        // console.dir(err)
        this.$toast.fail(err.response.data.message)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.field-wrap {
  margin: 20px 20px;
}
</style>
