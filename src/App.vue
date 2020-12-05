<template>
  <div id="app">
    <!-- 路由出口 -->
    <!-- 缓存layout，不缓存其他的 -->
    <!-- include： 包含哪些组件需要被缓存 -->
    <!-- exclude： 哪些组件不需要被缓存 -->
    <keep-alive include="LayoutIndex">
      <router-view />
    </keep-alive>
  </div>
</template>
<script>
export default {
  // 组件的别名
  name: 'App',
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="less"></style>
