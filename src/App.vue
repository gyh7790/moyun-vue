<template>
  <!-- 测试 提交 -->
  <div id="main" class="main_app">
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>

<style lang="scss">
*{
  margin: 0px;
  padding: 0px;
}
html,body{
  width: 100%;
  height: 100%;
}
#main {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
.ivu-table-wrapper{
  overflow: initial;
}
</style>
