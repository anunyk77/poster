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
            v-for="component in components"
            :id="component.id"
            :active="component.id === (currentComponent && currentComponent.id)"
            :key="component.id"
          >
            <component :is="component.name" v-bind="component.props" />
          </edit-wrapper>
        </div>
      </a-layout>
      <a-layout-sider width="300" style="background-color: #fff">
        <div>
          <props-table
            v-if="currentComponent && currentComponent.props"
            :props="currentComponent.props"
            @change="handleChange"
          />
          <pre>{{ currentComponent && currentComponent.props }}</pre>
        </div>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { GlobalDataProps } from "../store";
import HelloWorld from "../components/HelloWorld.vue";
import LText from "../components/LText.vue";
import ComponentsList from "../components/ComponentsList.vue";
import EditWrapper from "../components/EditWrapper.vue";
import { ComponentData } from "../store/editor";
import PropsTable from "../components/propsTable.vue";

export default defineComponent({
  components: {
    HelloWorld,
    LText,
    ComponentsList,
    EditWrapper,
    PropsTable,
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
    const currentComponent = computed<ComponentData | null>(
      () => store.getters.getCurrentElement
    );
    const handleChange = (data: any) => {
      store.commit("updateComponent", data);
    };
    return {
      components,
      currentComponent,
      addItem,
      setActive,
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
