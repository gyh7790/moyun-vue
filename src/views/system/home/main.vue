<template>
    <div class="layout">
        <Layout>
            <Sider v-show="isCollapsed" ref="side" hide-trigger width="auto" collapsible :collapsed-width="78">
                <div class="side-logo">
                  <a href="/main/mainpath" class="wrapper-header-nav-logo router-link-active">
                    <img height="50px" src="https://file.iviewui.com/dist/e1cf12c07bf6458992569e67927d767e.png">
                  </a>
                </div>
                <div style="height:100%;overflow-y:auto;">
                <Aside :isCollapsed="isCollapsed"></Aside>
                </div>
            </Sider>
            <Layout>
                <Header :isCollapsed="isCollapsed" @toggle-collapse="collapsedSider"/>
                <Content :style="{margin: '5px',padding: '5px 8px', background: '#fff', minHeight: 'aoto'}">
                   <router-view></router-view>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
import Aside from './aside.vue'
import Header from './header.vue'

export default {
  components: {
    Aside,
    Header
  },
  data () {
    return {
      isCollapsed: true
    }
  },
  methods: {
    collapsedSider () {
      this.isCollapsed = !this.isCollapsed
    }
  }
}
</script>

<style scoped>
    .layout{
        height: 100%;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .ivu-layout{
        height: 100%;
        overflow-y: hidden;
    }
    .ivu-layout-content {
      overflow-y:auto;
      margin: 8px;
      padding: 0px 8px;
    }
    .layout-header-bar{
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #f5f7f9;
        border-radius: 3px;
        margin: 15px auto;
    }
    
    .side-logo {
      height: 65px;
      background: white;
      text-align: center;
      line-height: 100px;
    }
    .wrapper-header-nav-logo {
        height: 50px;
    }
</style>
