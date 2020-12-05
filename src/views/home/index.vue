<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        round
        class="search-btn"
        slot="title"
        icon="search"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- 标签页 -->
    <van-tabs v-model="active" animated swipeable class="channel-tab">
      <van-tab
        v-for="channelItem in channelList"
        :key="channelItem.id"
        :title="channelItem.name"
      >
        <!-- 文章列表区域 -->
        <!-- 引入子组件 -->
        <article-list :channel="channelItem"></article-list>
      </van-tab>
      <!-- 展位区域  为了防止汉堡导航遮盖住最后一个标签的内容,使用一个和汉堡导航大小相同的盒子展位 -->
      <div slot="nav-right" class="palceholder"></div>
      <!-- 右侧汉堡导航 -->
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChannelEditShow = true"
      >
        <i slot="icon" class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 编辑频道列表弹框 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <channel-edit
        :my-channels="channelList"
        :active="active"
        @update-active="updateActivehandle"
      ></channel-edit>
    </van-popup>
  </div>
</template>
<script>
// 导入articleList子组件
import ArticleList from './components/article-list'
// 导入ChannelEdit子组件
import ChannelEdit from './components/channel-edit'
// 导入getChannelList数据请求
import { getChannelList } from '@/api/user'
// 导入获取存储数据的模块
import { getItem } from '@/utils/storage'
// 导入vuex中的数据
import { mapState } from 'vuex'
export default {
  name: 'HomeIndex',
  components: {
    // 将articleList设为home的子组件
    ArticleList,
    // 将ChannelEdit设为home的子组件
    ChannelEdit
  },
  props: {},
  data() {
    return {
      // 默认选中频道导航的第一个
      active: 0,
      // 频道数据列表
      channelList: [],
      // 频道弹框是否显示
      isChannelEditShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created() {
    // 获取频道列表显然导航栏
    this.loadChannelList()
  },
  mounted() {},
  methods: {
    // 获取频道列表显然导航栏
    async loadChannelList() {
      try {
        // 获取本地存储频道列表数据
        const localChannelList = getItem('CHANNELS')
        if (!this.user && localChannelList) {
          this.channelList = localChannelList
        } else {
          const { data: res } = await getChannelList()
          // console.log(res)
          this.channelList = res.data.channels
        }
      } catch (err) {
        if (err.response.status === 507) {
          this.$toast('数据库错误')
        } else {
          this.$toast('获取频道信息失败')
        }
      }
    },
    // 根据channel-item子组件的index变化修改active
    // updateActivehandle(obj) {
    //   // console.log(obj.isShow)
    //   this.active = obj.active
    //   this.isChannelEditShow = obj.isShow
    // }
    // isChannelEditShow = true表示不传参数的话默认位true,穿了参数就用参数的值
    updateActivehandle(index, isChannelEditShow = true) {
      // console.log(obj.isShow)
      this.active = index
      this.isChannelEditShow = isChannelEditShow
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  .page-nav-bar {
    background-color: #3296fa;
    /deep/ .van-nav-bar__title {
      max-width: unset;
    }
    .search-btn {
      width: 555px;
      height: 64px;
      background: #5babfb;
      // outline: none;
      border: none;
      color: #fff;
      .van-icon {
        color: #fff;
        font-size: 32px;
      }
    }
  }
  // /deep/
  /deep/.channel-tab {
    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      top: 92px;
      right: 0;
      left: 0;
      z-index: 1;
    }
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px;
      height: 6px;
      background-color: #3296fa;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
  }
  // 占位
  .palceholder {
    width: 66px;
    height: 82px;
    // 不参与flex宽度分配
    flex-shrink: 0;
  }
  // 汉堡按钮
  .hamburger-btn {
    position: fixed;
    right: 0;
    width: 66px;
    height: 82px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    opacity: 0.902;
    // border-left: 1px solid #d0d0d0;
    i.toutiao {
      font-size: 33px;
    }
    &:before {
      content: '';
      position: absolute;
      left: 0;
      background-image: url('~@/assets/gradient-gray-line.png');
      background-size: contain;
      width: 1px;
      height: 100%;
    }
  }
}
</style>
