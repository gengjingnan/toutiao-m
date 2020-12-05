<template>
  <div class="update-photo">
    <img :src="img" alt="" ref="img" />
    <div class="toobar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confim" @click="onConfim">完成</div>
    </div>
  </div>
</template>
<script>
// 导入cropperjs的样式文件
import 'cropperjs/dist/cropper.css'
// 导入cropperjs的js文件
import Cropper from 'cropperjs'
// 导入编辑用户头像的请求接口
import { editUserPhoto } from '@/api/user'
export default {
  name: 'UpdatePhoto',
  components: {},
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data() {
    return {
      cropper: null
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    //   在该生命周期获取Dom
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      //   autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false
    })
  },
  methods: {
    onConfim() {
      this.cropper.getCroppedCanvas().toBlob(async blob => {
        const formData = new FormData()
        // Pass the image file name as the third parameter if necessary.
        formData.append('photo', blob /*, 'example.png' */)
        this.$toast.loading({
          message: '保存中...',
          forbidClick: true,
          duration: 0
        })
        try {
          //  如果接口要求Content-Type为multipart/form-data格式,所以参数必须传formData对象
          //  如果接口要求Content-Type为application/json格式,所以参数普通的js对象
          const { data: res } = await editUserPhoto(formData)
          //   console.log(data)
          this.$emit('update-photo', res.data.photo)
          //   关闭弹出层
          this.$emit('close')
          this.$toast.success('更新成功')
        } catch (error) {
          console.dir(error)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.update-photo {
  background-color: #000;
  height: 100%;
  color: #fff;
  img {
    display: block;
    width: 100%;
  }
  .toobar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confim {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
