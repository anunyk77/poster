import { createStore } from "vuex";
import { createApp } from "vue";

const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
});

const app = createApp({});
app.use(store);

export default store;