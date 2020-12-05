<template>
  <div class="channel-edit">
    <!-- 频道标题 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        class="edit-btn"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <!--我的频道--- 频道列表 -->
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(item, index) in myChannels"
        :key="index"
        @click="clickMyChannel(item, index)"
      >
        <van-icon
          v-show="isEdit && !fixedChannels.includes(index)"
          slot="icon"
          name="clear"
          class="icon"
        ></van-icon>
        <span slot="text" class="text" :class="{ active: active === index }">{{
          item.name
        }}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <!-- 频道标题 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <!--频道推荐--- 频道列表 -->
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="item in RecommendedChannelList"
        :key="item.id"
        icon="plus"
        :text="item.name"
        @click="addChannel(item)"
      />
    </van-grid>
  </div>
</template>
<script>
// 导入getAllChannelList请求模块
import {
  getAllChannelList,
  editUserChannels,
  deleteUserChannels
} from '@/api/channels'
// 导入vuex中state模块
import { mapState } from 'vuex'
// 导入本地存储中的存储数据的模块
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      // 所有频道列表
      allChannelList: [],
      // 是否显示编辑按钮
      isEdit: false,
      // 默认不能被编辑的频道
      fixedChannels: [0]
    }
  },
  computed: {
    // 调用vuex中state中的数据
    ...mapState(['user']),
    // 渲染频道推荐列表
    RecommendedChannelList() {
      // 方式一
      // return this.allChannelList.filter(channel => {
      //   return !this.myChannels.find(item => {
      //     return channel.id === item.id
      //   })
      // })
      // 方式二
      return this.allChannelList.filter(channel => {
        return !this.myChannels.some(item => {
          return channel.id === item.id
        })
      })
    }
  },
  watch: {},
  created() {
    this.loadAllChannel()
  },
  mounted() {},
  methods: {
    // 获取全部频道列表
    async loadAllChannel() {
      try {
        const { data: res } = await getAllChannelList()
        this.allChannelList = res.data.channels
      } catch (error) {
        this.$toast('获取全部频道列表失败')
      }
    },
    // 添加频道
    async addChannel(channel) {
      this.myChannels.push(channel)
      // 查看是否登录
      try {
        if (this.user) {
          // 已经登陆,将数据存储到线上
          await editUserChannels(channel.id, this.myChannels.length)
        } else {
          // 没有登录,将数据存储到本地
          setItem('CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('添加频道失败')
      }
    },
    // 点击我的频道实现切换或者删除操作
    async clickMyChannel(channel, index) {
      // console.log(channel, index)
      if (this.isEdit) {
        // 如果是固定列表中的频道,则不能删除
        if (this.fixedChannels.includes(channel.id)) {
          return
        }
        // 如果需要删除的频道的索引小于active,则让active-1
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }
        // 如果处于编辑状态,点击则删除
        this.myChannels.splice(index, 1)
        try {
          // 判断用户是否登录
          if (this.user) {
            // 如果已经登陆,将数据存储到线上
            await deleteUserChannels(channel.id)
          } else {
            // 如果没有登录,将数据存储到本地
            setItem('CHANNELS', this.myChannels)
          }
        } catch (err) {
          this.$toast('删除频道失败')
        }
      } else {
        // 否则切换到对应的频道页面
        this.$emit('update-active', index, false)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
}
.title-text {
  font-size: 32px;
  color: #333;
}
.edit-btn {
  width: 104px;
  height: 48px;
  font-size: 26px;
  color: #f85859;
  border: 1px solid #f85859;
}
.grid-item {
  width: 160px;
  height: 86px;
  /deep/ .van-grid-item__content {
    white-space: nowrap;
    background-color: #f4f5f6;
    .van-grid-item__text,
    .text {
      margin-top: 0;
      font-size: 24px;
      color: #222;
    }
    .active {
      color: red;
    }
    .van-grid-item__icon-wrapper {
      position: unset;
    }
  }
}
/deep/ .my-grid {
  .grid-item {
    .van-icon {
      position: absolute;
      right: -10px;
      top: -10px;
      font-size: 30px;
      color: #cacaca;
      z-index: 2;
    }
  }
}

/deep/ .recommend-grid {
  .grid-item {
    .van-grid-item__content {
      flex-direction: row;
      .van-icon-plus {
        font-size: 28px;
        margin-right: 6px;
      }
    }
  }
}
</style>
