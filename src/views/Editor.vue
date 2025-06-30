<template>
  <div class="editor-container">
    <a-layout>
      <a-layout-sider width="300" style="background: #08c872">
        <div>左边</div>
      </a-layout-sider>
      <a-layout> 
        组件列表  1233
      </a-layout>
      <a-layout-sider width="300" style="background: #9208c8">
        <div>右边</div>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.editor-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
