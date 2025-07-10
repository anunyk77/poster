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
    <div class="resizers">
      <!-- <template v-if="active"> -->
      <div
        class="resize-item resize-top"
        @mousedown.stop="startResize('top', $event)"
      ></div>
      <div
        class="resize-item resize-top-right"
        @mousedown.stop="startResize('top-right', $event)"
      ></div>
      <div
        class="resize-item resize-right"
        @mousedown.stop="startResize('right', $event)"
      ></div>
      <div
        class="resize-item resize-bottom-right"
        @mousedown.stop="startResize('bottom-right', $event)"
      ></div>
      <div
        class="resize-item resize-bottom"
        @mousedown.stop="startResize('bottom', $event)"
      ></div>
      <div
        class="resize-item resize-bottom-left"
        @mousedown.stop="startResize('bottom-left', $event)"
      ></div>
      <div
        class="resize-item resize-left"
        @mousedown.stop="startResize('left', $event)"
      ></div>
      <div
        class="resize-item resize-top-left"
        @mousedown.stop="startResize('top-left', $event)"
      ></div>
      <!-- </template> -->
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, nextTick } from "vue";
import { pick } from "lodash-es";
import { partial } from "lodash-es";

interface size {
  width?: number;
  top?: number;
  left?: number;
  height?: number;
}
type resizeDirection =
  | "top"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left"
  | "top-left";

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

    // 移动的元素 按下鼠标事件
    const startMove = (e: MouseEvent) => {
      onItemClick();
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

    const startResize = (direction: resizeDirection, e: MouseEvent) => {
      const currentElement = editWrapperRef.value as HTMLElement;
      const { height, width } = currentElement.getBoundingClientRect();
      const top = currentElement.offsetTop;
      const left = currentElement.offsetLeft;
      // 鼠标原始位置
      const ox = e.clientX;
      const oy = e.clientY;
      // 鼠标实时位置
      let cx = 0;
      let cy = 0;
      // 鼠标偏移量
      let disX = 0;
      let disY = 0;
      const mousemove = (e: MouseEvent) => {
        cx = e.clientX;
        cy = e.clientY;
        disX = cx - ox;
        disY = cy - oy;

        const size = caculateSize(
          direction,
          { disX, disY },
          { height, width, top, left }
        ) as size;
        const { style } = currentElement;
        if (size.width) style.width = size.width + "px";
        if (size.top) style.top = size.top + "px";
        if (size.left) style.left = size.left + "px";
        if (size.height) style.height = size.height + "px";
      };
      const mouseup = () => {
        const size = caculateSize(
          direction,
          { disX, disY },
          { height, width, top, left }
        );
        context.emit("update-position", { ...size, id: props.id });
        nextTick(() => {
          document.removeEventListener("mousemove", mousemove);
          document.removeEventListener("mouseup", mouseup);
        });
      };
      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    };

    // 计算元素新的定位属性
    const caculateSize = (direction: resizeDirection, disInfo, positions) => {
      const { disX, disY } = disInfo;
      const { left, top, width, height } = positions;

      const getTop = () => {
        let newTop = top + disY;
        let newHeight = height - disY;
        return {
          top: newTop,
          height: newHeight,
        };
      };
      const getLeft = () => {
        let newLeft = left + disX;
        let newWidth = width - disX;
        return {
          width: newWidth,
          left: newLeft,
        };
      };
      const getBottom = () => {
        const newHeight = height + disY;
        return {
          height: newHeight,
        };
      };
      const getRight = () => {
        const newWidth = width + disX;
        return {
          width: newWidth,
        };
      };
      switch (direction) {
        case "top":
          return {
            ...getTop(),
          };
        case "top-right":
          return {
            ...getTop(),
            ...getRight(),
          };
        case "right":
          return {
            ...getRight(),
          };
        case "bottom-right":
          return {
            ...getBottom(),
            ...getRight(),
          };
        case "bottom":
          return {
            ...getBottom(),
          };
        case "bottom-left":
          return {
            ...getBottom(),
            ...getLeft(),
          };
        case "left":
          return {
            ...getLeft(),
          };
        case "top-left":
          return {
            ...getTop(),
            ...getLeft(),
          };
        default:
          break;
      }
    };
    return {
      onItemClick,
      editWrapperRef,
      startMove,
      startResize,
      styles,
    };
  },
});
</script>
<style lang="scss" scoped>
.edit-wrapper {
  user-select: none;
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
  position: absolute;
  width: 100%;
  height: 100%;
}

.edit-wrapper .resizers {
  display: none;
}
.edit-wrapper.active .resizers {
  display: block;
}

.resize-item {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1px solid #73b0ed;
  z-index: 2;

  &.resize-top {
    cursor: ns-resize;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
  }
  &.resize-right {
    cursor: ew-resize;
    right: -5px;
    top: 50%;
    transform: translateY(-50%);
  }
  &.resize-bottom {
    cursor: ns-resize;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
  }
  &.resize-left {
    cursor: ew-resize;
    left: -5px;
    top: 50%;
    transform: translateY(-50%);
  }
  &.resize-top-right {
    cursor: nesw-resize;
    right: -5px;
    top: -5px;
  }
  &.resize-bottom-right {
    cursor: nwse-resize;
    right: -5px;
    bottom: -5px;
  }
  &.resize-top-left {
    cursor: nwse-resize;
    left: -5px;
    top: -5px;
  }
  &.resize-bottom-left {
    cursor: nesw-resize;
    bottom: -5px;
    left: -5px;
  }
}
</style>
