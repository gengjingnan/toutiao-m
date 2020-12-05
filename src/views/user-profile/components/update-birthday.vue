<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>
<script>
// 导入编辑用户信息的接口
import { editUserInfo } from '@/api/user'
// 加载dayjs包
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
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
        const birthday = dayjs(this.currentDate).format('YYYY-MM-DD')
        await editUserInfo({
          birthday: birthday
        })
        // console.log(res)
        this.$emit('input', birthday)
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
<style lang="less" scoped></style>
