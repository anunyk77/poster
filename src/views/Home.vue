<template>
  <div>
    欢迎使用
    <div>
      <a-space wrap>
        <a-button @click="toEditor" type="primary">跳转到编辑端</a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  setup() {
    const router = useRouter();
    const toEditor = () => {
      // 跳转到编辑端
      router.push('/editor');
    };
    return {
      toEditor
    };
  },
};
</script>

<style lang="scss" scoped></style>
