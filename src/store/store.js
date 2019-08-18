import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    testDate: [],
    navList: [],
    nowTabStr: '首页'
  },
  getters: {
    getNavList () {
      return window.sessionStorage.getItem('MOYUN_MENU')
    }
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
    setNowTabStr (state, value) {
      state.nowTabStr = value
    },
    reloadNavList (state) {
      state.navList = localStorage.navList ? JSON.parse(localStorage.navList) : []
    }
  },
  actions: {
  }
})
