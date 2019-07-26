<template>
  <Menu theme="light" style="width: 240px;"
    @on-select="changeMenu"
    >
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
      menuList: []
    }
  },
  beforeCreate: function () {
    // 登入成功, 获取访问菜单
    this.$ajax.get('/sys/menu/nav').then((res) => {
      // console.log(res)
      // this.$store.commit('setNavList', res.list)
      this.menuList = res.list
    })
  },
  methods: {
    changeMenu (name) {
      this.$router.push({ name: name })
    }
  }
}
</script>

<style lang="scss" scoped>
   .ivu-menu {
       height: 100%;
   }
</style>
