import Vue from 'vue'

// 字典 - 选项
Vue.component('JavaTypeSelect', () => import('@/components/JavaTypeSelect'))
// 分页-组件
Vue.component('Pages', () => import('@/components/page/pages.vue'))

// tree - 基础
Vue.component('zTree', () => import('@/components/tree/index.vue'))
