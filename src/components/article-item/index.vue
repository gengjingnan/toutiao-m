<template>
  <!--  :to={
      name: article,
      params: {
        articleID: article.art_id
      }
    } -->
  <!-- :to="`/article/${article.art_id}`" -->
  <div class="article-item">
    <van-cell
      :to="{
        name: 'article',
        params: {
          articleID: article.art_id
        }
      }"
    >
      <!-- 标题 -->
      <div slot="title" class="title van-multi-ellipsis--l2">
        {{ article.title }}
      </div>
      <!-- 标题下方标签信息 -->
      <div slot="label" class="lable-wrap">
        <!-- 标题下方图片 -->
        <div class="cover-wrap" v-if="article.cover.type === 3">
          <van-image
            v-for="(item, index) in article.cover.images"
            class="cover-item-img"
            :key="index"
            fit="cover"
            :src="item"
          />
        </div>
        <div class="lable">
          <span>{{ article.aut_name }}</span>
          <span>{{ article.comm_count }} 条评论</span>
          <!-- 格式化相对时间 -->
          <span>{{ article.pubdate | relativeTime }}</span>
        </div>
      </div>
      <!-- 标题右侧图片 -->
      <van-image
        v-if="article.cover.type === 1"
        slot="default"
        fit="cover"
        class="right-cover"
        width="100"
        height="100"
        :src="article.cover.images[0]"
      />
    </van-cell>
  </div>
</template>
<script>
export default {
  name: 'ArticleItem',
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>
<style lang="less" scoped>
// 标题样式
.title {
  font-size: 32px;
  color: #3a3a3a;
}
// 右侧封面样式
.van-cell__value {
  flex: unset;
  width: 232px;
  height: 146px;
  .right-cover {
    width: 100px;
    height: 100px;
  }
}
// 标题下方标签信息样式
.lable {
  font-size: 23px;
  color: #b4b4b4;
  span {
    margin-right: 27px;
  }
}
.cover-wrap {
  display: flex;
  height: 146px;
  padding: 30px 0;
  .cover-item-img {
    height: 100%;
    width: 100%;
    flex: 1;
    &:not(:last-child) {
      padding-right: 4px;
    }
  }
}
</style>
