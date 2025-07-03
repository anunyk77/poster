import { createStore } from "vuex";
import { createApp } from "vue";
import editor, { type EditorProps } from "./editor";

export interface GlobalDataProps {
  user: any;
  // user: UserProps;
  // templates: TemplateProps,
  editor: EditorProps
}

const store = createStore({
  modules: {
    editor
  }
});

const app = createApp({});
app.use(store);

export default store;