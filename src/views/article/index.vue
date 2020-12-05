<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="articleDetailList.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ articleDetailList.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="articleDetailList.aut_photo"
          />
          <div slot="title" class="user-name">
            {{ articleDetailList.aut_name }}
          </div>
          <div slot="label" class="publish-date">
            {{ articleDetailList.pubdate | relativeTime }}
          </div>
          <!-- 关注用户 -->
          <follow-user
            class="follow-btn"
            :article-detail-list="articleDetailList"
          ></follow-user>
        </van-cell>
        <!-- /用户信息 -->
        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="articleDetailList.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 评论列表 -->
        <comment-list
          :source="articleDetailList.art_id"
          :list="commentList"
          @total-count="total_count = $event.total_count"
          @reply-show="replyHandle"
        ></comment-list>
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="showCommentPopup = true"
            >写评论</van-button
          >
          <van-icon name="comment-o" :badge="total_count" color="#777" />
          <!-- 收藏 -->
          <collect-article
            :is_collected.sync="articleDetailList.is_collected"
            :target="articleDetailList.art_id"
          ></collect-article>

          <!-- 点赞 -->
          <like-article
            v-model="articleDetailList.attitude"
            :target="articleDetailList.art_id"
          ></like-article>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="failureStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticleDetail"
          >点击重试</van-button
        >
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论弹出层 -->
    <van-popup v-model="showCommentPopup" position="bottom"
      ><comment-post
        :target="articleDetailList.art_id"
        @post-success="onPostSuccess"
      ></comment-post
    ></van-popup>
    <!-- 回复弹出层 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <comment-reply
        v-if="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
      ></comment-reply>
    </van-popup>
  </div>
</template>
<script>
// 导入获取文章详情数据的请求
import { getArticleDetails } from '@/api/article'
// 导入图片预览函数
import { ImagePreview } from 'vant'
// 导入follow-user组件
import FollowUser from '@/components/follow-user'
// 导入collect-article组件
import CollectArticle from '@/components/collect-article'
// 导入like-article组件
import LikeArticle from '@/components/like-article'
// 导入comment-list组件
import CommentList from '../article/components/comment-list'
// 导入comment-post组件
import CommentPost from '../article/components/comment-post'
// 导入comment-reply组件
import CommentReply from '../article/components/comment-reply'
export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  // 通过依赖注入向子孙传递数据
  provide: function() {
    return {
      art_id: this.articleID
    }
  },
  props: {
    articleID: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      // 文章列表详情
      articleDetailList: {},
      // 资源是否加载
      loading: true,
      // 资源加载失败
      failureStatus: 0,
      // 存放文章详细信息中所有的图片
      allImages: [],
      // 评论弹出层是否显示
      showCommentPopup: false,
      // 评论列表
      commentList: [],
      // 评论总数
      total_count: 0,
      // 回复弹出层是否展示
      isReplyShow: false,
      // 每一项评论
      currentComment: {}
    }
  },
  computed: {},
  watch: {},
  created() {
    //   加载文章列表详情
    this.loadArticleDetail()
  },
  mounted() {},
  methods: {
    //  加载文章列表详情
    async loadArticleDetail() {
      this.loading = true
      try {
        const { data: res } = await getArticleDetails(this.articleID)
        // // 模拟请求错误的状态
        // if (Math.random() > 0.5) {
        //   JSON.parse('aasss')
        // }
        this.articleDetailList = res.data
        // 获取不到dom,将关闭加载状态提到this.$nextTick之前就可以获取到数据
        // this.$nextTick(() => {
        //   console.log(this.$refs['article-content'])
        // })
        // 可以获取到dom
        setTimeout(() => {
          // console.log(this.$refs['article-content'])
          // 获取文章中所有的图片
          this.getAllImages()
        }, 0)
      } catch (err) {
        // console.dir(err)
        if (err.response && err.response.status === 404) {
          this.failureStatus = 404
        }
      }
      // 加载完成或者加载失败 关闭加载状态  赋值操作后,其DOM更新是在微任务队列
      this.loading = false
    },
    // 获取文章中所有的图片
    getAllImages() {
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      // console.log(imgs)
      imgs.forEach((item, index) => {
        this.allImages.push(item.src)
        item.onclick = () => {
          ImagePreview({
            images: this.allImages,
            startPosition: index
          })
        }
      })
    },
    // 评论发布成功
    onPostSuccess(event) {
      // 关闭评论弹框
      this.showCommentPopup = false
      // 将返回的数据追加到评论列表中
      this.commentList.unshift(event.new_obj)
    },
    // 点击回复按钮触发的事件
    replyHandle(comment) {
      this.isReplyShow = true
      // console.log(comment)
      this.currentComment = comment
    }
  }
}
</script>
<style scoped lang="less">
// 导入markdown的样式文件
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      /deep/.follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
