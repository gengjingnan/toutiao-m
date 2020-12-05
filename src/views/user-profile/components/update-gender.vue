<template>
  <div class="update-gender">
    <van-picker
      title="性别"
      show-toolbar
      :columns="columns"
      :default-index="gender"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      @change="onChange"
    />
  </div>
</template>
<script>
// 导入编辑用户信息的接口
import { editUserInfo } from '@/api/user'
export default {
  name: 'UpdateGender',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      columns: ['男', '女'],
      //   性别对应索引
      gender: this.value
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        await editUserInfo({
          gender: this.gender
        })
        // console.log(res)
        this.$emit('input', this.gender)
        // 关闭弹层
        this.$emit('close')
        this.$toast.success('更新成功')
      } catch (err) {
        // console.dir(err)
        this.$toast.fail(err.response.data.message)
      }
    },
    onChange(picker, value, index) {
      //   console.log(index)
      this.gender = index
    }
  }
}
</script>
<style lang="less" scoped></style>
