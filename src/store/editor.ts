import type { Module } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import store, { type GlobalDataProps } from './index';
import { AllComponentProps, TextComponentProps } from '../defaultProps'
import { cloneDeep } from 'lodash-es'
import { message } from 'ant-design-vue';

export interface EditorProps {
  // 渲染的组件列表
  components: ComponentData[];
  // 当前元素，uuid
  currentElement: string;
  // 拷贝的元素
  copiedComponent: ComponentData;
}
export interface ComponentData {
  // 元素的属性
  props: Partial<AllComponentProps>
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
    props: {
      text: 'Hello World',
      fontSize: '20px',
      color: '#000000',
      width: '130px',
      height: '140px',
      backgroundColor: '',
      position: 'absolute',
      left: '30px',
      top: '30px',
      // right: '0',
    },
    isHidden: false,
    isLocked: false,
    layerName: '图层1',
  },
  // { id: uuidv4(), name: 'l-text', props: { text: 'Hello World2', fontSize: '10px', fontWeight: '900' } },
  // { id: uuidv4(), name: 'l-text', props: { text: 'Hello World3', fontSize: '15px', actionType: 'url', url: 'www.baidu.com' } },
]

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: '',
    copiedComponent: null,
  },
  mutations: {
    // 添加元素
    addComponent(state, props: Partial<TextComponentProps>) {
      const newComponent: ComponentData = {
        id: uuidv4(),
        name: 'l-text',
        props,
        isHidden: false,
        isLocked: false,
        layerName: `图层${state.components.length + 1}`,
      }
      // const newComponent: AllComponentProps | ComponentData = {
      //   id: uuidv4(),
      //   name: 'l-text',
      //   isHidden: false,
      //   isLocked: false,
      //   layerName: `图层${state.components.length + 1}`,
      //   props: {
      //     ...props,
      //     actionType: '',
      //     url: '',
      //     // size
      //     height: '50',
      //     width: '50',
      //     paddingLeft: '0',
      //     paddingRight: '0',
      //     paddingTop: '0',
      //     paddingBottom: '0',
      //     // border type
      //     borderStyle: 'none',
      //     borderColor: '',
      //     borderWidth: '0',
      //     borderRadius: '0',
      //     // shadow and opacity
      //     boxShadow: '0 0 0 #000000',
      //     opacity: '1',
      //     // position and x,y
      //     position: 'absolute',
      //     left: '0',
      //     top: '0',
      //     right: '0',
      //     text: '包含全部内容',
      //     fontSize: '14px',
      //     fontFamily: '',
      //     fontWeight: 'normal',
      //     fontStyle: '',
      //     textDecoration: 'none',
      //     lineHeight: '1',
      //     textAlign: 'left',
      //     color: '#000000',
      //     backgroundColor: '#cccccc',
      //     src: 'test.url',
      //   }
      // }
      state.components.push(newComponent)
    },
    // 选择元素
    setActive(state, currentId: string) {
      state.currentElement = currentId
    },
    // 更新元素
    updateComponent(state, { id, key, value, isRoot }) {
      const updatedComponent = state.components.find(i => i.id === (id || state.currentElement));
      if (updatedComponent) {
        if (isRoot) {
          updatedComponent[key as keyof ComponentData] = value
        } else {
          updatedComponent.props[key] = value;
        }
      }
    },
    // 拷贝对象
    copyComponent(state) {
      const component = state.components.find(i => i.id === state.currentElement)
      state.copiedComponent = cloneDeep(component)
    },
    // 复制元素
    pasteCopiedComponent(state) {
      const clone = cloneDeep(state.copiedComponent)
      clone.props.top = parseInt(clone.props.top) + 20 + 'px'
      clone.props.left = parseInt(clone.props.left) + 20 + 'px'
      state.components.push({
        ...clone,
        layerName: clone.layerName + ' 副本',
        id: uuidv4()
      })
    },
    // 删除图层
    deleteComponent(state) {
      state.components = state.components.filter(i => i.id !== state.currentElement)
    },
    // 移动元素
    moveComponent(state, { direction, amount }) {
      const currentElement = store.getters.getElement()
      if (currentElement) {
        const oldTop = parseInt(currentElement.props.top || '0')
        const oldLeft = parseInt(currentElement.props.left || '0')
        let newValue = ''
        switch (direction) {
          case 'up':
            newValue = oldTop - amount + 'px'
            store.commit('updateComponent', { id: state.currentElement, key: 'top', value: newValue })
            break
          case 'down':
            newValue = oldTop + amount + 'px'
            store.commit('updateComponent', { id: state.currentElement, key: 'top', value: newValue })
            break
          case 'left':
            newValue = oldLeft - amount + 'px'
            store.commit('updateComponent', { id: state.currentElement, key: 'left', value: newValue })
            break
          case 'right':
            newValue = oldLeft + amount + 'px'
            store.commit('updateComponent', { id: state.currentElement, key: 'left', value: newValue })
            break
          default:
            break
        }
      }
    }
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find(i => i.id === state.currentElement)
    },
    getElement: (state) => (id: string) => {
      return state.components.find(i => i.id === (id || state.currentElement))

    }
  }
}

export default editor;