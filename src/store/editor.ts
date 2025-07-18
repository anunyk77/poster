import type { Module } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import store, { type GlobalDataProps } from './index';
import { AllComponentProps, TextComponentProps } from '../defaultProps'
import { cloneDeep } from 'lodash-es'

export interface EditorProps {
  // 渲染的组件列表
  components: ComponentData[];
  // 当前元素，uuid
  currentElement: string;
  // 拷贝的元素
  copiedComponent: ComponentData;
  // 开始更新时的缓存值
  cachedOldValues: any;
  // 历史记录
  historyArr: HistoryProps[],
  // 历史记录指针
  historyIndex: number,
  // 历史记录最大存储
  maxHistoryNumber: number
}

interface HistoryProps {
  id: string,
  componentId: string,
  type: 'add' | 'delete' | 'modify',
  data: any,
  index?: number
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
    },
    isHidden: false,
    isLocked: false,
    layerName: '图层1',
  },
]

// 保留历史操作记录
const pushHistory = (state: EditorProps, historyRecord: HistoryProps) => {
  // 撤销过，指针不是指向 -1，删除指针后的数据重新推入
  if (state.historyIndex !== -1) {
    state.historyArr = state.historyArr.slice(0, state.historyIndex)
    state.historyIndex = -1
  }
  // 最大值限制
  if (state.historyArr.length < state.maxHistoryNumber) {
    state.historyArr.push(historyRecord)
  } else {
    state.historyArr.shift()
    state.historyArr.push(historyRecord)
  }
}
// 保存“修改”操作的历史记录
const modifyHistory = (state: EditorProps, history: HistoryProps, type: "undo" | 'redo') => {
  const { componentId, data } = history
  const { key, oldValue, newValue } = data
  const currentElement = state.components.find(i => i.id === componentId)
  if (currentElement) {
    if (Array.isArray(key) && Array.isArray(oldValue)) {
      key.forEach((keyName, index) => {
        currentElement.props[keyName] = type === 'undo' ? oldValue[index] : newValue[index];
      })
    } else if (!Array.isArray(key) && !Array.isArray(oldValue)) {
      currentElement.props[key] = type === 'undo' ? oldValue : newValue;
    }
  }
}
// 防抖
const debounceChange = (callback: (...args: any) => void, timeout = 200) => {
  let timer = 0
  return (...args: any) => {
    console.log(timer)
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      timer = 0
      callback(...args)
    }, timeout)
  }
}
const pushModifyHistory = (state: EditorProps, { key, value, id }) => {
  pushHistory(state, {
    id: uuidv4(),
    componentId: (id || state.currentElement),
    type: 'modify',
    data: { oldValue: state.cachedOldValues, newValue: value, key }
  })
  state.cachedOldValues = null
}
const pushHistoryDebounce = debounceChange(pushModifyHistory)

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: '',
    copiedComponent: null,
    cachedOldValues: null,
    historyArr: [], // 历史记录列表
    historyIndex: -1, // 历史操作记录指针
    maxHistoryNumber: 50 // 历史记录最大保存值
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
      state.components.push(newComponent)
      // 添加历史记录
      pushHistory(state, {
        id: uuidv4(),
        componentId: newComponent.id,
        type: 'add',
        data: cloneDeep(newComponent)
      })
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
          // 添加历史记录
          const oldValue = Array.isArray(value) ? key.map(i => updatedComponent.props[i] ?? 0) : (updatedComponent.props[key] ?? 0)
          if (!state.cachedOldValues) {
            state.cachedOldValues = oldValue
          }
          // 添加历史记录
          pushHistoryDebounce(state, { key, value, id })
          // pushHistory(state, {
          //   id: uuidv4(),
          //   componentId: updatedComponent.id,
          //   type: 'modify',
          //   data: {
          //     key: key,
          //     oldValue: oldValue,
          //     newValue: value,
          //   }
          // })
          if (Array.isArray(key) && Array.isArray(value)) {
            key.forEach((keyName, index) => {
              updatedComponent.props[keyName] = value[index];
            })
          } else if (typeof key === 'string' && typeof value === 'string') {
            updatedComponent.props[key] = value;
          }
        }
      }
    },
    // 拷贝对象
    copyComponent(state) {
      const component = state.components.find(i => i.id === state.currentElement)
      state.copiedComponent = cloneDeep(component)
    },
    // 粘贴元素
    pasteCopiedComponent(state) {
      const clone = cloneDeep(state.copiedComponent)
      clone.props.top = parseInt(clone.props.top) + 20 + 'px'
      clone.props.left = parseInt(clone.props.left) + 20 + 'px'
      state.components.push({
        ...clone,
        layerName: clone.layerName + ' 副本',
        id: uuidv4()
      })
      pushHistory(state, {
        id: uuidv4(),
        componentId: clone.id,
        type: 'add',
        data: cloneDeep(clone)
      })
    },
    // 删除图层
    deleteComponent(state) {
      const currentElement = state.components.find(i => i.id === state.currentElement)
      const currentIndex = state.components.findIndex(i => i.id === state.currentElement)
      if (currentElement) {
        state.components = state.components.filter(i => i.id !== state.currentElement)
        // 添加历史记录
        pushHistory(state, {
          id: uuidv4(),
          componentId: state.currentElement,
          type: 'delete',
          data: currentElement,
          index: currentIndex
        })

      }
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
    },

    // 撤回
    undo(state) {
      if (state.historyIndex === -1) {
        state.historyIndex = state.historyArr.length - 1
      } else {
        state.historyIndex--
      }
      const history = state.historyArr[state.historyIndex]
      switch (history.type) {
        case 'add':
          state.components = state.components.filter(i => i.id !== history.componentId)
          break
        case 'delete':
          state.components.splice(history.currentIndex, 0, history.data)
          break
        case 'modify':
          modifyHistory(state, history, 'undo')
          break
        default:
          break
      }
    },
    // 重做
    redo(state) {
      if (state.historyIndex === -1) {
        return
      }
      const history = state.historyArr[state.historyIndex]
      if (!history) return
      switch (history.type) {
        case "add":
          state.components.push(history.data)
          break
        case "delete":
          state.components = state.components.filter(i => i.id !== history.componentId)
          break
        case "modify":
          modifyHistory(state, history, 'redo')
          break
        default:
          break
      }
      state.historyIndex++
    }
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find(i => i.id === state.currentElement)
    },
    getElement: (state) => (id: string) => {
      return state.components.find(i => i.id === (id || state.currentElement))
    },
    // 撤销
    checkUndoDisable: (state) => {
      // 1 no history item
      // 2 move to the first item
      if (state.historyArr.length === 0 || state.historyIndex === 0) {
        return true
      }
      return false
    },
    // 重做
    checkRedoDisable: (state) => {
      // 1 no history item
      // 2 move to the last item
      // 3 never undo before
      if (state.historyArr.length === 0 ||
        state.historyIndex === state.historyArr.length ||
        state.historyIndex === -1) {
        return true
      }
      return false
    }
  }
}

export default editor;