import type { Module } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import { type GlobalDataProps } from './index';
import { TextComponentProps } from '../defaultProps'
export interface EditorProps {
  // 渲染的组件列表
  components: ComponentData[];
  // 当前元素，uuid
  currentElement: string;
}
export interface ComponentData {
  // 元素的属性
  props: { [key: string]: any }
  // uuid
  id: string
  // 业务组件名称 l-text
  name: string
  // 图层是否隐藏
  isHidden?: boolean;
  // 图层是否锁定
  isLocked?: boolean;
  // 图层名称
  layerName?: string
}

export const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: 'l-text',
    props: { text: 'Hello World', fontSize: '20px', color: 'red' },
    isHidden: false,
    isLocked: false,
    layerName: '图层1'
  },
  // { id: uuidv4(), name: 'l-text', props: { text: 'Hello World2', fontSize: '10px', fontWeight: '900' } },
  // { id: uuidv4(), name: 'l-text', props: { text: 'Hello World3', fontSize: '15px', actionType: 'url', url: 'www.baidu.com' } },
]

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: '',
  },
  mutations: {
    addComponent(state, props: Partial<TextComponentProps>) {
      const newComponent: ComponentData = {
        id: uuidv4(),
        name: 'l-text',
        props,
        isHidden: false,
        isLocked: false,
        layerName: `图层${state.components.length + 1}`
      }
      state.components.push(newComponent)
    },
    setActive(state, currentId: string) {
      state.currentElement = currentId
    },
    updateComponent(state, { id, key, value, isRoot }) {
      const updatedComponent = state.components.find(i => i.id === (id || state.currentElement));
      if (updatedComponent) {
        if (isRoot) {
          updatedComponent[key as keyof ComponentData] = value
        } else {
          updatedComponent.props[key] = value;
        }
      }
    }
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find(i => i.id === state.currentElement)
    }
  }
}

export default editor;