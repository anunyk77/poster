<template>
  <div class="props-table">
    <div v-for="(value, key) in finalProps" :key="key" class="prop-item">
      <span class="label" v-if="value.text">{{ value.text }}</span>
      <div class="component-wrap">
        <component
          :is="value.component"
          :[value.valueProp]="value.value" 
          v-bind="value.extraProps"
          v-on="value.events"
        >
          <template v-if="value.options">
            <component
              :is="value.subComponent"
              v-for="(option, index) in value.options"
              :key="index"
              :value="option.value"
            >
              <!-- {{ option.text }} -->
              <render-vnode :vNode="option.text" />
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, VNode } from "vue";
import { reduce } from "lodash-es";
import { TextComponentProps } from "../defaultProps";
import { mapPropsToForms, PropsToForms } from "../propsMap";
import RenderVnode from "./RenderVnode";
import ColorPicker from "../components/ColorPicker.vue";
import IconSwitch from "../components/IconSwitch.vue";

// Define
interface FormProps {
  component: string;
  subComponent?: string;
  value?: string;
  extraProps?: { [key: string]: any };
  text?: string;
  options?: { text: string | VNode; value: any }[];
  valueProp: string;
  eventName: string;
  events: { [key: string]: (e: any) => void };
}

export default defineComponent({
  name: "props-table",
  props: {
    props: {
      type: Object as PropType<TextComponentProps>,
      required: true,
    },
  },
  components: {
    RenderVnode,
    ColorPicker,
    IconSwitch
  },
  emits: ["change"],
  setup(props, context) {
    // <Required<PropsToForms>>
    const finalProps = computed<{ [key: string]: FormProps }>(() => {
      return reduce(
        props.props,
        (result, value, key) => {
          const newKey = key as keyof TextComponentProps;
          const item = mapPropsToForms[newKey];
          if (item) {
            const {
              valueProp = "value",
              eventName = "change",
              initalTransform,
              afterTransform,
            } = item;
            const newItem: FormProps = {
              ...item,
              value: initalTransform ? initalTransform(value) : value,
              valueProp,
              eventName,
              events: {
                [eventName]: (e: any) => {
                  context.emit("change", {
                    key,
                    value: afterTransform ? afterTransform(e) : e,
                  });
                },
              },
            };
            result[newKey] = newItem;
          }
          return result;
        },
        {}
      );
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
  align-items: center;
}

.component-wrap {
  flex: 1;
}

.label {
  width: 60px;
}
</style>
