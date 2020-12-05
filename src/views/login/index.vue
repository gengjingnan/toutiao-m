<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar
      left-arrow
      class="page-nav-bar"
      title="登录"
      @click-left="$router.back()"
    />
    <!-- 表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        type="number"
        maxlength="11"
        :rules="userFormRules.mobile"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        maxlength="6"
        type="number"
        :rules="userFormRules.code"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <van-count-down
            v-if="isCountTimeShow"
            :time="1000 * 60"
            format=" ss s"
            @finish="isCountTimeShow = false"
          />
          <van-button
            v-else
            class="login-field-button"
            size="small"
            round
            native-type="button"
            @click="onSendsms"
            >获取验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-button-wap">
        <van-button class="login-button" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { login, sendSms } from '@/api/user'
export default {
  // 组件的别名
  name: 'LoginIndex',
  data() {
    return {
      // 表单数据
      user: {
        // 电话号码
        mobile: '',
        // 验证码
        code: ''
      },
      // 登录表单验证规则
      userFormRules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /1[3|5|7|8|9]\d{9}$/, message: '请输入正确的手机号' }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          { pattern: /\d{6}$/, message: '请输入正确的验证码' }
        ]
      },
      // 倒计时是否显示
      isCountTimeShow: false
    }
  },
  methods: {
    async onSubmit() {
      // 获取表单数据
      const user = this.user
      // 表单验证
      // 提交表单请求登录
      // 在组件中必须通过this.$toast来调用Toast组件
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续展示 toast
      })
      // try {正常书写的代码 如果不报错不执行catch,如果错误,直接跳转到catch} catch (error) {}
      try {
        const { data: res } = await login(user)
        // console.log(res)
        this.$toast.success('登录成功')
        this.$store.commit('setUser', res.data)
        // 登陆成功,返回首页
        this.$router.back()
      } catch (err) {
        // console.log(err)
        if (err.response.status === 400) {
          this.$toast.fail('手机或验证码错误')
          // console.log(11)
        } else {
          this.$toast.fail('登录失败,请稍后重试')
        }
      }
      // 根据请求响应结果处理后续操作
    },
    async onSendsms() {
      // 验证手机号码
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return this.$toast('验证失败', err)
      }
      // 倒计时
      this.isCountTimeShow = true
      // 发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('验证码获取成功')
      } catch (err) {
        // 发送失败,关闭定时器
        this.isCountTimeShow = false
        if (err.response.status === 404) {
          this.$toast('手机号不正确')
        } else if (err.response.status === 429) {
          this.$toast('发送太频繁了,请稍后重试')
        } else {
          this.$toast(err.response.msg)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.toutiao {
  font-size: 37px;
}
.login-button {
  background-color: #6db4fb;
  border: 0;
}
.login-button-wap {
  padding: 53px 33px;
}
.login-field-button {
  //   width: 156px;
  background-color: #ededed;
  color: #666666;
  height: 46px;
  font-size: 22px;
  line-height: 100%;
}
</style>
