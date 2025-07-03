<template>
  <div>
    <div
      v-for="(item, index) in defaultTextTemplates"
      :key="index"
      class="component-warp"
      @click="onItemClick(item)"
    >
      <LText v-bind="item" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import LText from "./LText.vue";
import defaultTextTemplates from "../defaultTemplate";
export default defineComponent({
  components: {
    LText,
  },
  emits: ["on-item-click"],
  setup(props, context) {
    const onItemClick = (data: any) => {
      context.emit("on-item-click", data);
    };
    return {
      defaultTextTemplates,
      onItemClick,
    };
  },
});
</script>

<style lang="scss" scoped></style>
