<template>
  <div>
    欢迎使用
    <div>
      <a-button @click="toEditor" type="primary">跳转到编辑端</a-button>
      <router-link to="/login">
        <a-button type="primary" ghost>跳转登录</a-button>
      </router-link>
      <div v-for="item in 10" :key="item" style="height: 80px;">{{ item }}</div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const toEditor = () => {
      // 跳转到编辑端
      router.push("/editor");
    };
    return {
      toEditor,
    };
  },
};
</script>

<style lang="scss" scoped></style>
