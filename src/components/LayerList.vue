<template>
  <draggable
    class="layer-list"
    :list="list"
    handle=".handle"
    ghost-class="ghost"
    :itemKey="(item) => item.id"
  >
    <template #item="{ element }">
      <li
        class="layer-item"
        :class="{ active: element.id === selectedId }"
        @click="handleClick(element.id)"
      >
        <a-space :size="15">
          <a-tooltip :title="element.isHidden ? '显示' : '隐藏'">
            <a-button
              shape="circle"
              @click="hangleChange(element.id, 'isHidden', !element.isHidden)"
            >
              <template v-if="element.isHidden" #icon><EyeOutlined /></template>
              <template v-else #icon><EyeInvisibleOutlined /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip :title="element.isLocked ? '解锁' : '锁定'">
            <a-button
              shape="circle"
              @click="hangleChange(element.id, 'isLocked', !element.isLocked)"
            >
              <template v-if="element.isLocked" #icon
                ><LockOutlined
              /></template>
              <template v-else #icon><UnlockOutlined /></template>
            </a-button>
          </a-tooltip>

          <InlineEdit
            style="width: 120px"
            :value="element.layerName"
            @change="(value) => hangleChange(element.id, 'layerName', value)"
          />
          <!-- a-tooltip 会显示浮层 导致移动时进入浮层，拖拽不灵敏 -->
          <!-- <a-tooltip title="标签移动" placement="right"> -->
          <a-button shape="circle" class="handle">
            <DragOutlined />
          </a-button>
          <!-- </a-tooltip> -->
        </a-space>
      </li>
    </template>
  </draggable>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import draggable from "vuedraggable";
import { ComponentData } from "../store/editor";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  UnlockOutlined,
  DragOutlined,
} from "@ant-design/icons-vue";
import InlineEdit from "./InlineEdit.vue";

export default defineComponent({
  props: {
    list: {
      type: Array as PropType<ComponentData[]>,
      default: () => [],
    },
    selectedId: {
      type: String,
      required: true,
    },
  },
  components: {
    EyeOutlined,
    EyeInvisibleOutlined,
    LockOutlined,
    UnlockOutlined,
    DragOutlined,
    InlineEdit,
    draggable,
  },
  setup(props, ctx) {
    const handleClick = (id: string) => {
      ctx.emit("select", id);
    };
    const hangleChange = (id: string, key: string, value: boolean) => {
      const data = {
        id,
        key,
        value,
        isRoot: true,
      };
      ctx.emit("change", data);
    };
    return {
      handleClick,
      hangleChange,
    };
  },
});
</script>
<style lang="scss" scoped>
.layer-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.layer-item {
  cursor: pointer;
  margin: 0;
  padding: 0 20px;
  display: flex;
  align-items: center;
  height: 50px;
  list-style-type: none;
  border: 1px solid transparent;

  &:hover {
    background-color: #e6f7ff;
  }

  &.active {
    border: 1px solid #1890ff;
  }
}

.ghost {
  opacity: 0.5;
}
</style>
