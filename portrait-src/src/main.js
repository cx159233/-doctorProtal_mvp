import { createApp } from 'vue'
import Dashboard from './Dashboard.vue'
import { setupRem } from '../utils/rem'

setupRem()
createApp(Dashboard).mount('#app')
