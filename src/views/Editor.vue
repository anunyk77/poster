<template>
  <div class="editor-container">
    <a-layout>
      <a-layout-sider width="300" style="background: #fff">
        <components-list @onItemClick="addItem" />
      </a-layout-sider>
      <a-layout class="editor-container">
        <ul>
          <li v-for="(item, index) in historyArr">
            <span
              :style="{ 'font-weight': index === historyIndex ? 'bold' : '' }"
            >
              <template v-if="item.type === 'modify'">
                {{ item.type }} - {{ item.data.key }} -
                {{ item.data.oldValue }}-
                {{ item.data.newValue }}
              </template>
              <template v-else>
                {{ item.type }} - {{ item.componentId }}
              </template>
            </span>
          </li>
        </ul>
        <div style="text-align: right">
          <a-space>
            <a-button
              shape="cricle"
              :disabled="undoIsDisabled"
              @click="handleUndo"
            >
              撤回
              <template #icon><UndoOutlined /></template>
            </a-button>
            <a-button
              shape="cricle"
              :disabled="redoIsDisabled"
              @click="handleRedo"
            >
              重做
              <template #icon><RedoOutlined /></template>
            </a-button>
          </a-space>
        </div>
        <div class="editor-warp">
          <edit-wrapper
            @setActive="setActive(component.id)"
            @updatePosition="updatePosition"
            v-for="component in components"
            :id="component.id"
            :active="component.id === (currentElement && currentElement.id)"
            :isHidden="component.isHidden"
            :key="component.id"
            :props="component.props"
          >
            <component
              :is="component.name"
              v-bind="getComponentProps(component.props)"
            />
          </edit-wrapper>
        </div>
      </a-layout>
      <a-layout-sider width="300" style="background-color: #fff">
        <div>
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="basic" tab="基础类型">
              <div v-if="currentElement">
                <edit-group
                  v-if="!currentElement.isLocked"
                  :props="currentElement.props"
                  @change="handleChange"
                />
                <div v-else>
                  <a-empty description="锁定状态不允许修改" />
                </div>
                <!-- <div v-if="!currentElement.isLocked">
                  <props-table
                    :props="currentElement.props"
                    @change="handleChange"
                  />
                </div> -->

                <pre>{{ currentElement && currentElement.props }}</pre>
              </div>
            </a-tab-pane>
            <a-tab-pane key="layer" tab="图层类型">
              <layer-list
                :list="components"
                :selectedId="currentElement && currentElement.id"
                @change="handleChange"
                @select="setActive"
              />
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { RedoOutlined, UndoOutlined } from '@ant-design/icons-vue'
import { computed, defineComponent, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import { omit, pickBy } from 'lodash-es'
import LText from '../components/LText.vue'
import HelloWorld from '../components/HelloWorld.vue'
import ComponentsList from '../components/ComponentsList.vue'
import EditWrapper from '../components/EditWrapper.vue'
import { ComponentData } from '../store/editor'
import PropsTable from '../components/propsTable.vue'
import LayerList from '../components/LayerList.vue'
import EditGroup from '../components/EditGroup.vue'
import initHotKeys from '../plugins/hotKeys'

export default defineComponent({
  components: {
    HelloWorld,
    LText,
    ComponentsList,
    EditWrapper,
    PropsTable,
    LayerList,
    EditGroup,
    RedoOutlined,
    UndoOutlined,
  },
  setup() {
    initHotKeys()
    const store = useStore<GlobalDataProps>()
    const components = computed(() => store.state.editor.components)
    const addItem = (props: any) => {
      store.commit('addComponent', props)
    }
    const setActive = (currentId: string) => {
      store.commit('setActive', currentId)
    }
    const currentElement = computed<ComponentData | null>(
      () => store.getters.getCurrentElement,
    )
    const handleChange = (data: any) => {
      store.commit('updateComponent', data)
    }
    // 更新定位 left / top
    const updatePosition = (data: {
      left: number
      top: number
      width: number
      height: number
      id: string
    }) => {
      const { id } = data
      const updatedData = pickBy(data, (v, k) => k !== 'id')
      // key value 转成 数组形式传递 { key: ['left', 'top'], value: ['10px', '20px'] }
      const keysArr = Object.keys(updatedData)
      const valuesArr = Object.values(updatedData).map((v) => v + 'px')
      store.commit('updateComponent', { key: keysArr, value: valuesArr, id })
    }
    const activeKey = ref('basic')

    const getComponentProps = (props) => {
      return omit(props, ['position', 'top', 'left', 'width', 'height'])
    }

    const historyArr = computed(() => store.state.editor.historyArr)
    const historyIndex = computed(() => store.state.editor.historyIndex)

    const undoIsDisabled = computed<boolean>(
      () => store.getters.checkUndoDisable,
    )
    const redoIsDisabled = computed<boolean>(
      () => store.getters.checkRedoDisable,
    )

    // 撤回
    const handleUndo = () => {
      store.commit('undo')
    }
    // 重做
    const handleRedo = () => {
      store.commit('redo')
    }

    return {
      activeKey,
      components,
      currentElement,
      addItem,
      setActive,
      updatePosition,
      getComponentProps,
      handleChange,
      handleUndo,
      handleRedo,
      historyArr,
      historyIndex,
      undoIsDisabled,
      redoIsDisabled,
    }
  },
})
</script>

<style lang="scss" scoped>
.editor-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.editor-container {
  min-width: 500px;
  background-color: #fff;
}

.editor-warp {
  background-color: #f0f2f5;
  height: 80vh;
  position: relative;
}
</style>
