<template>
  <div class="editor-container">
    <a-layout>
      <a-layout-sider width="300" style="background: #fff">
        <components-list @onItemClick="addItem" />
      </a-layout-sider>
      <a-layout class="editor-container">
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
            <component :is="component.name" v-bind="component.props" />
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
import { computed, defineComponent, ref, nextTick } from "vue";
import { useStore } from "vuex";
import { GlobalDataProps } from "../store";
import HelloWorld from "../components/HelloWorld.vue";
import LText from "../components/LText.vue";
import ComponentsList from "../components/ComponentsList.vue";
import EditWrapper from "../components/EditWrapper.vue";
import { ComponentData } from "../store/editor";
import PropsTable from "../components/propsTable.vue";
import LayerList from "../components/LayerList.vue";
import EditGroup from "../components/EditGroup.vue";

export default defineComponent({
  components: {
    HelloWorld,
    LText,
    ComponentsList,
    EditWrapper,
    PropsTable,
    LayerList,
    EditGroup,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const components = computed(() => store.state.editor.components);
    const addItem = (props: any) => {
      store.commit("addComponent", props);
    };
    const setActive = (currentId: string) => {
      store.commit("setActive", currentId);
    };
    const currentElement = computed<ComponentData | null>(
      () => store.getters.getCurrentElement
    );
    const handleChange = (data: any) => {
      store.commit("updateComponent", data);
    };
    // 更新定位 left / top
    const updatePosition = ({ left, top, id }) => {
      store.commit("updateComponent", { key: "left", value: left + "px", id });
      store.commit("updateComponent", { key: "top", value: top + "px", id });
    };
    const activeKey = ref("basic");

    return {
      activeKey,
      components,
      currentElement,
      addItem,
      setActive,
      updatePosition,
      handleChange,
    };
  },
});
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
