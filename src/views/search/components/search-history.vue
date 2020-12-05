<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-history')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHistory"
      :key="index"
      @click="onSearchItemClick(index, item)"
    >
      <van-icon name="close" v-show="isDeleteShow" />
    </van-cell>
  </div>
</template>
<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistory: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // 每一项的删除按钮是否显示
      isDeleteShow: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // props接受到的数据,如果是普通数据类型,如字符串,数字等,绝对不能在接受数据的组件中进行修改,修改了父组件中检测不到;    如果是复杂数据类型,则可以进行追加和删除操作,但是不能进行赋值操作,类似于const声明的数据
    onSearchItemClick(index, item) {
      // 如果处于编辑状态则删除当前数组元素,否则跳转到对应的搜索结果界面
      if (this.isDeleteShow) {
        this.searchHistory.splice(index, 1)
      } else {
        this.$emit('search', item)
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
