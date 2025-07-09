<template>
  <div>
    <a-collapse v-model:activeKey="activeKey">
      <a-collapse-panel
        v-for="(item, index) in groupsMap"
        :key="index"
        :header="item.text"
      >
        <props-table :props="item.props" @change="handleChange" />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed, ref } from "vue";
import { AllComponentProps } from "../defaultProps";
import { difference } from "lodash-es";
import PropsTable from "../components/propsTable.vue";

interface GroupProps {
  text: string;
  items: string[];
}
const defaultEditGroups: GroupProps[] = [
  {
    text: "尺寸",
    items: [
      "height",
      "width",
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "paddingBottom",
    ],
  },
  {
    text: "边框",
    items: ["borderStyle", "borderColor", "borderWidth", "borderRadius"],
  },
  {
    text: "阴影与透明度",
    items: ["opacity", "boxShadow"],
  },
  {
    text: "位置",
    items: ["left", "top"],
  },
  {
    text: "事件功能",
    items: ["actionType", "url"],
  },
];
export default defineComponent({
  props: {
    props: {
      type: Object as PropType<AllComponentProps>,
      required: true,
    },
    groups: {
      type: Array as PropType<GroupProps[]>,
      default: defaultEditGroups,
    },
  },
  components: {
    PropsTable,
  },
  emits: ["change"],
  setup(props, ctx) {
    const activeKey = ref([0]);

    const newGroups = computed(() => {
      const allNormalProps = props.groups.reduceRight((pre, cur) => {
        return [...pre, ...cur.items];
      }, [] as string[]);
      const specialProps = difference(Object.keys(props.props), allNormalProps);
      return [
        {
          text: "基本属性",
          items: specialProps,
        },
        ...props.groups,
      ];
    });
    const groupsMap = computed(() => {
      return newGroups.value.map((group) => {
        const propsMap = {} as AllComponentProps;
        group.items.forEach((item) => {
          const key = item as keyof AllComponentProps;
          propsMap[key] = props.props[key];
        });
        return {
          ...group,
          props: propsMap,
        };
      });
    });

    const handleChange = (data) => {
      ctx.emit("change", data);
    };

    return {
      activeKey,
      groupsMap,
      handleChange,
    };
  },
});
</script>
<style lang=""></style>
