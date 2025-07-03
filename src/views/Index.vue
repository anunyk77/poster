<template>
  <a-layout-header class="header"> 头部信息 </a-layout-header>
  <a-layout-content class="container">
    <router-view />
  </a-layout-content>
  <a-layout-footer class="footer"> 底部信息 </a-layout-footer>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.header {
  height: 80px;
  background-color: #494872;
}
.container{
  min-height: calc(100vh - 140px);
}
.footer {
  height: 60px;
  background-color: #3ba9a4;
}
</style>
