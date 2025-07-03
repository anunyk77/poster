<template lang="">
  <div
    class="edit-wrapper"
    :class="{ active: active }"
    @click="onItemClick(id)"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    id: {
      type: String,
      require: true,
    },
    active: {
      type: Boolean,
      defual: false,
    },
  },
  emits: ["set-active"],
  setup(props, context) {
    const onItemClick = (id: string) => {
      context.emit("set-active", id);
    };
    return {
      onItemClick,
    };
  },
});
</script>
<style lang="scss" scoped>
.edit-wrapper {
  border: 1px solid transparent;
  &:hover {
    border: 1px dashed #73b0ed;
  }
  &.active {
    border: 1px solid #73b0ed;
  }
}
</style>
