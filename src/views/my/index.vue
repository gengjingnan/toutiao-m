<template>
  <div class="my-container">
    <!-- 已登录头部 -->
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left">
          <van-image class="avatar" round fit="cover" :src="userInfo.photo" />
          <span class="text">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button
            class="edit-btn"
            type="default"
            round
            size="mini"
            to="/user/profile"
            >编辑资料</van-button
          >
        </div>
      </div>
      <div class="data-status">
        <div class="data-item">
          <div class="count">{{ userInfo.art_count }}</div>
          <div class="text">头条</div>
        </div>
        <div class="data-item">
          <div class="count">{{ userInfo.follow_count }}</div>
          <div class="text">关注</div>
        </div>
        <div class="data-item">
          <div class="count">{{ userInfo.fans_count }}</div>
          <div class="text">粉丝</div>
        </div>
        <div class="data-item">
          <div class="count">{{ userInfo.like_count }}</div>
          <div class="text">获赞</div>
        </div>
      </div>
    </div>
    <!-- 未登录头部 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>

    <!-- 收藏 历史 -->
    <van-grid :column-num="2" clickable class="grid-nav">
      <van-grid-item class="grig-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grig-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- 消息通知及小智童鞋 -->
    <van-cell title="消息通知" is-link url="" />
    <van-cell class="mb-9" title="小智童鞋" is-link to="" />
    <!-- 退出 -->
    <van-cell
      v-if="user"
      class="loginOut-cell"
      title="退出登录"
      to=""
      center
      clickable
      @click="onLogOut"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name: 'MyIndex',
  components: {},
  props: {},
  data() {
    return {
      // 用户信息
      userInfo: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created() {
    // 如果用户登陆了则 加载用户信息渲染页面
    if (this.user) {
      this.loadUserInfo()
    }
  },
  mounted() {},
  methods: {
    // 退出登录事件
    onLogOut() {
      this.$dialog
        .confirm({
          title: '确认退出吗?'
        })
        .then(() => {
          // on confirm
          // console.log('确认推出了')
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
          console.log('取消了')
        })
    },
    // 加载用户信息渲染页面
    async loadUserInfo() {
      try {
        // 加载成功将返回的数据追加给userInfo
        const { data: res } = await getUserInfo()
        // console.log(res)
        this.userInfo = res.data
      } catch (err) {
        // 加载失败
        console.dir(err)
        if (err.response.status === 400) {
          this.$toast('请求参数错误')
        } else if (err.response.status === 401) {
          this.$toast(' 用户认证失败')
        } else if (err.response.status === 507) {
          this.$toast('数据库错误')
        } else {
          this.$toast('请求数据失败')
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
.my-container {
  // 未登录的用户首页
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 361px;
    // ~@表示根路径
    background: url('~@/assets/banner.png');
    background-size: cover;
    .login-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      .mobile-img {
        width: 133px;
        height: 133px;
      }
      .text {
        font-size: 24px;
      }
    }
  }
  // 已经登陆的用户首页
  .user-info {
    background: url('~@/assets/banner.png');
    .base-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      height: 231px;
      padding: 76px 32px 23px;
      .left {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .avatar {
          height: 133px;
          width: 133px;
          margin-right: 20px;
          border: 4px solid #ffffff;
        }
        .text {
          font-size: 33px;
          color: #fff;
        }
      }
      .right {
        .edit-btn {
          padding: 15px;
          font-size: 22px;
        }
      }
    }
    .data-status {
      display: flex;
      justify-content: space-between;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 42px;
        }
        .text {
          font-size: 25px;
        }
      }
    }
  }
  // 收藏及历史栏
  .grid-nav {
    font-size: 31px;
    margin-bottom: 10px;
    .grig-item {
      .toutiao-shoucang {
        color: #eb5253;
        font-size: 45px;
      }
      .toutiao-lishi {
        color: #ff9d1d;
        font-size: 45px;
      }
    }
  }
  .mb-9 {
    margin-bottom: 10px;
  }
  .loginOut-cell {
    height: 104px;
    text-align: center;
    font-size: 33px;
    color: #d86262;
  }
}
</style>
