<template>
    <div class="layout">
        <Layout>
            <Sider ref="side1" hide-trigger width="auto" collapsible :collapsed-width="78" v-model="isCollapsed">
                <div style="height:60px;"></div>
                <Aside></Aside>
            </Sider>
            <Layout>
                <Header/>
                <Content :style="{margin: '5px',padding: '5px', background: '#fff', minHeight: 'aoto'}">
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
      isCollapsed: false
    }
  },
  computed: {
    rotateIcon () {
      return [
        'menu-icon',
        this.isCollapsed ? 'rotate-icon' : ''
      ]
    },
    menuitemClasses () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }
  },
  methods: {
    collapsedSider () {
      this.$refs.side1.toggleCollapse()
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
    .ivu-layout-sider{
        background: #61768a;
    }
</style>
