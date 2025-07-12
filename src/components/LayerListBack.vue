<template>
  <ul class="layer-list" @drop="onDrag" @dragover="onDragOver">
    <li
      class="layer-item"
      :class="{
        active: item.id === selectedId,
        ghost: item.id === dragData.currentDragging,
      }"
      v-for="(item, index) in list"
      :key="index"
      @click="handleClick(item.id)"
      @dragenter="onDragEnter($event, index)"
      @dragstart="onDragStart($event, item.id, index)"
      :data-index="index"
      draggable="true"
    >
      <a-space :size="15">
        {{ item.layerName }}
        <a-tooltip :title="item.isHidden ? '显示' : '隐藏'">
          <a-button
            shape="circle"
            @click="hangleChange(item.id, 'isHidden', !item.isHidden)"
          >
            <template v-if="item.isHidden" #icon><EyeOutlined /></template>
            <template v-else #icon><EyeInvisibleOutlined /></template>
          </a-button>
        </a-tooltip>
        <a-tooltip :title="item.isLocked ? '解锁' : '锁定'">
          <a-button
            shape="circle"
            @click="hangleChange(item.id, 'isLocked', !item.isLocked)"
          >
            <template v-if="item.isLocked" #icon><LockOutlined /></template>
            <template v-else #icon><UnlockOutlined /></template>
          </a-button>
        </a-tooltip>
        <InlineEdit
          :value="item.layerName"
          @change="(value) => hangleChange(item.id, 'layerName', value)"
        />
      </a-space>
    </li>
  </ul>
</template>
<script lang="ts">
import { defineComponent, PropType, reactive, ref, watch } from 'vue'
import { arrayMoveMutable } from 'array-move'
import { ComponentData } from '../store/editor'
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons-vue'
import InlineEdit from './InlineEdit.vue'
import { getParentElement } from '../hooks/helper'

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
    InlineEdit,
  },
  setup(props, ctx) {
    const handleClick = (id: string) => {
      ctx.emit('select', id)
    }
    const hangleChange = (id: string, key: string, value: boolean) => {
      const data = {
        id,
        key,
        value,
        isRoot: true,
      }
      ctx.emit('change', data)
    }

    const dragData = reactive({
      currentDragging: '',
      currnetIndex: -1,
    })
    const onDragStart = (e: Event, id: string, index) => {
      dragData.currentDragging = id
      dragData.currnetIndex = index
    }
    // 移入时触发
    const onDragEnter = (e: DragEvent, index: number) => {
      if (dragData.currnetIndex !== index) {
        console.log(dragData.currnetIndex, index)
        /**
         * 直接在组件内修改了属性，不是单向数据流，
         * 可以在组件内创建新数组，
         */
        arrayMoveMutable(props.list, dragData.currnetIndex, index)

        dragData.currnetIndex = index
      }
    }
    // 松开时触发元素的移动
    const onDrag = (e: Event) => {
      // const currentEle = getParentElement(
      //   e.target as HTMLElement,
      //   "layer-item"
      // );
      // if (currentEle && currentEle.dataset.index) {
      //   const moveIndex = parseInt(currentEle.dataset.index);
      //   arrayMoveMutable(props.list, dragData.currnetIndex, moveIndex);
      //   // 原生方法不使用工具
      //   // const { arr, fromIndex, toIndex } = {
      //   //   arr: props.list,
      //   //   fromIndex: dragData.currnetIndex,
      //   //   toIndex: moveIndex,
      //   // };
      //   // const item = arr[fromIndex];
      //   // props.list.splice(fromIndex, 1);
      //   // props.list.splice(toIndex, 0, item);
      // }
      dragData.currentDragging = ''
    }
    const onDragOver = (e) => {
      e.preventDefault()
    }

    return {
      handleClick,
      onDragEnter,
      hangleChange,
      dragData,
      onDragStart,
      onDragOver,
      onDrag,
    }
  },
})
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
