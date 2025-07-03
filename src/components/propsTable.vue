<template>
  <div class="props-table">
    <div v-for="(value, key) in finalProps" :key="key" class="prop-item">
      <span class="label" v-if="value.text">{{ value.text }}</span>
      <div class="component-wrap">
        <component
          :is="value.component"
          :value="value.value"
          v-bind="value.extraProps"
        ></component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from "vue";
import { reduce } from "lodash-es";
import { TextComponentProps } from "../defaultProps";
import { mapPropsToForms, PropsToForms } from "../propsMap";
export default defineComponent({
  name: "props-table",
  props: {
    props: {
      type: Object as PropType<TextComponentProps>,
      required: true,
    },
  },
  setup(props) {
    const finalProps = computed<Required<PropsToForms>>(() => {
      return reduce(props.props,(result, value, key) => {
          const newKey = key as keyof TextComponentProps;
          const item = mapPropsToForms[newKey];
          if (item) {
            item.value = value;
            result[newKey] = item;
          }
          return result;
        },{});
    });
    return {
      finalProps,
    };
  },
});
</script>

<style lang="scss" scoped>
.prop-item {
  display: flex;
}
.component-wrap {
  flex: 1;
}
.label {
  width: 60px;
}
</style>
