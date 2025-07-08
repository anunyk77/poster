<template>
  <div ref="warpper" @click.stop="handleClick">
    <input ref="inputRef" v-if="isEditing" type="text" v-model="innerValue" />
    <span v-else>{{ innerValue }}</span>
  </div>
</template>
<script lang="ts">
import { defineComponent, watch, ref, nextTick } from "vue";
import useKeyPress from "../hooks/useKeyPress.ts";
import useClickOutside from "../hooks/useClickOutside.ts";

export default defineComponent({
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  emits: ["change"],
  setup(props, ctx) {
    const innerValue = ref(props.value);
    watch(
      () => props.value,
      (newValue) => {
        innerValue.value = newValue;
      }
    );

    const isEditing = ref(false);
    let cacheOldValue = "";

    const warpper = ref<null | HTMLElement>(null);
    const inputRef = ref<null | HTMLInputElement>(null);
    const isOutSide = useClickOutside(warpper);
    watch(isOutSide, (newValue) => {
      if (newValue && isEditing.value) {
        isEditing.value = false;
        ctx.emit("change", innerValue.value);
      }
      isOutSide.value = false;
    });



    watch(isEditing, async (isEditing) => {
      if (isEditing) {
        cacheOldValue = innerValue.value;
        await nextTick();
        if (inputRef.value) {
          inputRef.value.focus();
        }
      }
    });
    const handleClick = () => (isEditing.value = true);

    useKeyPress("Enter", () => {
      if (isEditing.value) {
        isEditing.value = false;
        ctx.emit("change", innerValue.value);
      }
    });
    useKeyPress("Escape", () => {
      if (isEditing.value) {
        isEditing.value = false;
        innerValue.value = cacheOldValue;
      }
    });

    return {
      isEditing,
      innerValue,
      isOutSide,
      handleClick,
      warpper,
      inputRef,
    };
  },
});
</script>
<style lang=""></style>
