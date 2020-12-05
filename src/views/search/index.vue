<template>
  <div class="search-container">
    <form action="/">
      <van-search
        v-model="searchValue"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
      <!-- 搜索结果 -->
      <search-result
        v-if="isResultShow"
        :search-key="searchValue"
      ></search-result>
      <!-- 搜索建议 -->
      <search-suggestion
        v-else-if="searchValue"
        :search-value="searchValue"
        @search="onSearch"
      ></search-suggestion>
      <!-- 搜索历史 -->
      <search-history
        v-else
        :search-history="SearchHistoryList"
        @search="onSearch"
        @clear-search-history="SearchHistoryList = []"
      ></search-history>
    </form>
  </div>
</template>
<script>
// 导入子路由
import SearchHistory from './components/search-history.vue'
import SearchResult from './components/search-result.vue'
import SearchSuggestion from './components/search-suggestion.vue'
// 导入本地存储数据的模块
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  },
  props: {},
  data() {
    return {
      // 搜索框内容
      searchValue: '',
      // 搜索结果的显示与隐藏
      isResultShow: false,
      // 存储搜索历史的数据列表
      // 如果本地存储中有数据,则拿去本地存储中的数据,本地存储没有对应数据则初始为空数组
      SearchHistoryList: getItem('TOUTIAO-SEARCH_HISTORY') || []
    }
  },
  computed: {},
  watch: {
    // 监视存储搜索历史的数据列表的变化
    SearchHistoryList() {
      // console.log(11)
      setItem('TOUTIAO-SEARCH_HISTORY', this.SearchHistoryList)
    }
  },
  created() {},
  mounted() {},
  methods: {
    onSearch(val) {
      // console.log(val)
      // 当点击搜索建议的某一项的时候输入框显示点击的内容
      this.searchValue = val
      // 每次搜索后将搜索的值存储在搜索历史的数组最前面,并且数组元素不能重复
      // 判断本次搜索的值在数组中是否已经存在
      const index = this.SearchHistoryList.indexOf(val)
      // console.log(index)
      // 如果存在,则将原来的删除,将最新的追加到数组的最前面
      if (index !== -1) {
        this.SearchHistoryList.splice(index, 1)
      }
      this.SearchHistoryList.unshift(val)
      this.isResultShow = true
    },
    onCancel() {
      console.log('取消')
    }
  }
}
</script>
<style lang="less" scoped>
.search-container {
  padding-top: 108px;
}
.van-search__action {
  color: #fff;
}
.van-search {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  right: 0;
}
</style>
