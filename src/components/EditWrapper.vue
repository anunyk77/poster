<template>
  <div
    class="edit-wrapper"
    ref="editWrapperRef"
    :style="styles"
    :class="{ active: active, isHidden: isHidden }"
    @click="onItemClick"
    @mousedown="startMove"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, nextTick } from "vue";
import { pick } from "lodash-es";

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
    isHidden: {
      type: Boolean,
      default: true,
    },
    props: {
      type: Object,
    },
  },
  emits: ["set-active", "update-position"],
  setup(props, context) {
    const onItemClick = () => {
      context.emit("set-active", props.id);
    };
    const styles = computed(() => {
      return pick(props.props, ["position", "top", "left", "width", "height"]);
    });

    const editWrapperRef = ref<HTMLElement | null>(null);

    let isMoving = false;

    // 按下鼠标事件
    const startMove = (e: MouseEvent) => {
      // 鼠标原始位置
      const ox = e.clientX;
      const oy = e.clientY;
      // 鼠标实时位置
      let cx = 0;
      let cy = 0;
      // 目标元素新的left、top值
      let newLeft = 0;
      let newTop = 0;
      // 获取到目标元素
      const currentElement = editWrapperRef.value;
      // 记录元素原始 offset（相对父元素left、top）
      let curElLeft = currentElement?.offsetLeft ?? 0;
      let curElTop = currentElement?.offsetTop ?? 0;
      // 移动鼠标事件
      const handleMove = (e: MouseEvent) => {
        isMoving = true;
        cx = e.clientX;
        cy = e.clientY;
        // 新定位 = 原始位置 + 鼠标偏移量
        // 鼠标偏移量 = 鼠标实时位置 - 鼠标原始位置
        newLeft = curElLeft + cx - ox;
        newTop = curElTop + cy - oy;
        if (currentElement) {
          currentElement.style.left = newLeft + "px";
          currentElement.style.top = newTop + "px";
        }
        // // 移动的时候发消息修改值 或者 在抬起鼠标时修改值
        // context.emit("update-position", {
        //   left: newLeft,
        //   top: newTop,
        //   id: props.id,
        // });
      };
      // 抬起鼠标事件
      const handleUp = (e: MouseEvent) => {
        if (isMoving) {
          context.emit("update-position", {
            left: newLeft,
            top: newTop,
            id: props.id,
          });
        }
        isMoving = false;
        nextTick(() => {
          document.removeEventListener("mousemove", handleMove);
          document.removeEventListener("mouseup", handleUp);
        });
      };
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
    };
    return {
      onItemClick,
      editWrapperRef,
      startMove,
      styles,
    };
  },
});
</script>
<style lang="scss" scoped>
.edit-wrapper {
  box-sizing: content-box;
  border: 1px solid transparent;
  &:hover {
    border: 1px dashed #73b0ed;
  }
  &.active {
    border: 1px solid #73b0ed;
  }
  &.isHidden {
    display: none;
  }
}

.edit-wrapper > * {
  position: static !important;
}
</style>
