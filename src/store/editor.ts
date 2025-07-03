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
}

export const testComponents: ComponentData[] = [
  { id: uuidv4(), name: 'l-text', props: { text: 'Hello World', fontSize: '20px', color: 'red' } },
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
        props
      }
      state.components.push(newComponent)
    },
    setActive(state, currentId: string) {
      state.currentElement = currentId
    }
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find(i => i.id === state.currentElement)
    }
  }
}

export default editor;