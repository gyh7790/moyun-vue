<template>
  <Menu theme="light" style="width: 240px;"
    @on-select="changeMenu">
    <template v-for="item in menuList">
         <!-- 第一级, 含有子元素 -->
        <Submenu :name="item.name" v-if="item.children.length > 0" :key="item.target" >
            <template slot="title">
                <Icon :type="item.icon" />
                {{item.name}}
            </template>
            <template v-for="item in item.children">
                <!-- 第二级, 含有子元素 -->
                <Submenu :name="item.name"  v-if="item.children.length > 0" :key="item.target" >
                    <template slot="title">
                        <Icon :type="item.icon" />
                        {{item.name}}
                    </template>
                    <template v-for="item in item.children">
                        <!-- 第三级, 含有子元素 -->
                        <Submenu :name="item.name" v-if="item.children.length > 0" :key="item.target">
                            <template slot="title">
                                <Icon :type="item.icon" />
                                {{item.name}}
                            </template>
                            <template v-for="item in item.children">
                                <!-- 第四级, 不含子元素 -->
                                <MenuItem v-if="item.children.length === 0" :name="item.target" :key="item.target">
                                    <Icon :type="item.icon" />
                                    {{item.name}}
                                </MenuItem>
                            </template>
                        </Submenu>
                        <!-- 第三级, 不含子元素 -->
                        <MenuItem v-if="item.children.length === 0" :name="item.target" :key="item.target">
                            <Icon :type="item.icon" />
                            {{item.name}}
                        </MenuItem>
                    </template>

                </Submenu>
                <!-- 第二级, 不含子元素 -->
                <MenuItem v-if="item.children.length === 0" :name="item.target" :key="item.target">
                    <Icon :type="item.icon" />
                    {{item.name}}
                </MenuItem>
            </template>
        </Submenu>
        <!-- 第一级, 不含子元素 -->
        <MenuItem v-if="item.children.length === 0" :name="item.target" :key="item.target">
            <Icon :type="item.icon" />
            {{item.name}}
        </MenuItem>
    </template>
  </Menu>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      listFormat: []
    }
  },
  mounted () {
    this.getMenuList()
  },
  methods: {
    changeMenu (name) {
      console.log(name)
      this.getListFormat(name)
      this.$router.push({ name: name })
    },
    getMenuList () {
      this.menuList = JSON.parse(this.$store.getters.getNavList)
      if (!this.menuList) {
        this.$ajax.get('/sys/menu/nav').then((res) => {
          this.menuList = res.list
          window.sessionStorage.setItem('MOYUN_MENU', JSON.stringify(res.list))
        })
      }
    },
    getListFormat (name) {
      let str = []
      let recursion = (menu) => {
        menu.forEach(e=>{
          if (e.children.length > 0) {
            recursion(e.children)
          } else if (e.target === name) {
            str.push(e.name)
          }
          if (str.length > 0 && e.children.length > 0) {
            str.push(e.name)
          }
        })
      }
      recursion(this.menuList)
      str.reverse()
      this.$store.commit('setNowTabStr', str.join('/'));
      console.log(str.join('/'))
    }
  }
}
</script>

<style lang="scss" scoped>
   .ivu-menu {
       height: 100%;
   }
</style>
