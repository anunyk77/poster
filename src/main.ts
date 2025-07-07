import { createApp } from 'vue'
import router from './routes'
import store from './store'
import 'normalize.css'
import './styles/index.scss'
import App from './App.vue'
import antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css';

const app = createApp(App)
app.use(router).use(store).use(antd)

app.mount('#app')
