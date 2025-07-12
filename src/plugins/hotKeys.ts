import { useStore } from "vuex";
import useHotKey from "../hooks/useHotKey";
import { GlobalDataProps } from '../store/index'
import { HotkeysEvent, KeyHandler } from "hotkeys-js";

export default function initHotKeys() {
  // 高阶函数 函数做返回值，阻止默认行为
  const wrap = (callback: KeyHandler) => {
    const wrapperFn = (e: KeyboardEvent, event: HotkeysEvent) => {
      e.preventDefault()
      callback(e, event)
    }
    return wrapperFn
  }
  const store = useStore<GlobalDataProps>()
  useHotKey('ctrl+c,command+c', wrap(() => {
    store.commit('copyComponent')
  }))
  useHotKey('ctrl+v,command+v', wrap(() => {
    store.commit('pasteCopiedComponent')
  }))
  useHotKey('delete', wrap(() => {
    store.commit('deleteComponent')
  }))
  useHotKey('esc', wrap(() => {
    store.commit('setActive', '')
  }))
  useHotKey('up', wrap(() => {
    store.commit('moveComponent', { direction: 'up', amount: 1 })
  }))
  useHotKey('down', wrap(() => {
    store.commit('moveComponent', { direction: 'down', amount: 1 })
  }))
  useHotKey('left', wrap(() => {
    store.commit('moveComponent', { direction: 'left', amount: 1 })
  }))
  useHotKey('right', wrap(() => {
    store.commit('moveComponent', { direction: 'right', amount: 1 })
  }))
}