import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    testDate: [],
    navList: [],
    nowTabStr: '欢迎使用'
  },
  getters: {

  },
  mutations: {
    // 左侧菜单列表
    setTestList (state, list) {
      state.testDate = list
      localStorage.testDate = JSON.stringify(state.testDate)
    },
    reloadTestList (state) {
      state.testDate = localStorage.testDate ? JSON.parse(localStorage.testDate) : []
    },
    // 左侧菜单列表
    setNavList (state, list) {
      state.navList = list
      localStorage.navList = JSON.stringify(state.navList)
    },
    reloadNavList (state) {
      state.navList = localStorage.navList ? JSON.parse(localStorage.navList) : []
    }
  },
  actions: {
  }
})
