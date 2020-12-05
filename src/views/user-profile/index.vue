<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      title="个人信息"
      class="page-nav-bar"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 隐藏的输入框 -->
    <input type="file" hidden ref="file" @change="onFileChange" />
    <!--个人信息-->
    <van-cell title="头像" is-link center @click="$refs.file.click()">
      <van-image round fit="cover" :src="userInfo.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="userInfo.name"
      is-link
      @click="isUpdateNameShow = true"
    />
    <van-cell
      title="性别"
      :value="gender"
      is-link
      @click="isUpdateGenderShow = true"
    />
    <van-cell
      title="生日"
      :value="userInfo.birthday"
      is-link
      @click="isUpdateBirthdayShow = true"
    />

    <!-- 编辑昵称弹出层 -->
    <van-popup
      v-model="isUpdateNameShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <update-name
        v-if="isUpdateNameShow"
        v-model="userInfo.name"
        @close="isUpdateNameShow = false"
      ></update-name
    ></van-popup>

    <!-- 编辑性别弹出层 -->
    <van-popup
      v-model="isUpdateGenderShow"
      position="bottom"
      :style="{ height: '50%' }"
      ><update-gender
        v-if="isUpdateGenderShow"
        v-model="userInfo.gender"
        @close="isUpdateGenderShow = false"
      ></update-gender
    ></van-popup>

    <!-- 编辑生日弹出层 -->
    <van-popup
      v-model="isUpdateBirthdayShow"
      position="bottom"
      :style="{ height: '50%' }"
      ><update-birthday
        v-if="isUpdateBirthdayShow"
        v-model="userInfo.birthday"
        @close="isUpdateBirthdayShow = false"
      ></update-birthday
    ></van-popup>

    <!-- 头像预览 -->
    <van-popup
      v-model="isUpdateImageShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <update-photo
        v-if="isUpdateImageShow"
        :img="img"
        @close="isUpdateImageShow = false"
        @update-photo="userInfo.photo = $event"
      ></update-photo>
    </van-popup>
  </div>
</template>
<script>
// 导入获取个人信息的请求接口
import { getUserProfile } from '@/api/user'
// 导入编辑昵称的组件
import UpdateName from './components/update-name.vue'
// 导入编辑性别的组件
import UpdateGender from './components/update-gender.vue'
// 导入编辑性别的组件
import UpdateBirthday from './components/update-birthday.vue'
// 导入编辑性别的组件
import UpdatePhoto from './components/update-photo.vue'
export default {
  name: 'UserProfile',
  components: { UpdateName, UpdateGender, UpdateBirthday, UpdatePhoto },
  props: {},
  data() {
    return {
      // 用户个人信息
      userInfo: {},
      // 控制编辑用户昵称的显示与隐藏
      isUpdateNameShow: false,
      // 控制编辑用户性别的显示与隐藏
      isUpdateGenderShow: false,
      // 控制编辑用户生日的显示与隐藏
      isUpdateBirthdayShow: false,
      // 控制编辑用户生日的显示与隐藏
      isUpdateImageShow: false,
      img: null
    }
  },
  computed: {
    // 渲染性别
    gender() {
      if (this.userInfo.gender === 1) {
        return '女'
      } else {
        return '男'
      }
    }
  },
  watch: {},
  created() {
    this.loadUserProfile()
  },
  mounted() {},
  methods: {
    async loadUserProfile() {
      try {
        const { data: res } = await getUserProfile()
        this.userInfo = res.data
      } catch (err) {
        this.$toast('获取个人信息失败,请稍后重试!')
      }
    },
    onFileChange() {
      // console.dir()
      this.isUpdateImageShow = true
      const file = window.URL.createObjectURL(this.$refs.file.files[0])
      this.img = file
      this.$refs.file.value = ''
    }
  }
}
</script>
<style lang="less" scoped>
.page-nav-bar {
  background-color: blue;
}
.van-image {
  width: 60px;
  height: 60px;
}
.van-popup {
  background-color: #f5f7f9;
}
</style>
