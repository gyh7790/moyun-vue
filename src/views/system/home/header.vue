<template>
  <Header :style="{padding: 0}" class="layout-header-bar">
    <Row :gutter="16">
        <i-col span="2">
          <div><Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24"></Icon></div>
        </i-col>
        <i-col span="10">
          <div>{{nowTabStr}}</div>
        </i-col>
        <i-col span="10">
          <div style="display: inline-block;"></div>
        </i-col>
        <i-col span="2" style="text-align:center;">
          <div>
        <Badge :count="1" overflow-count="99">
            <Avatar shape="square" icon="ios-person" />
        </Badge>
          </div>
        </i-col>
    </Row>
  </Header>
</template>
<script>
export default {
  props: {
    isCollapsed: false,
  },
  data () {
    return {
      ws: null
    }
  },
  computed: {
    nowTabStr () {
      return this.$store.state.nowTabStr
    },
    rotateIcon () {
        return [
            'rotate-icon',
            this.isCollapsed ? '' : 'menu-icon'
        ];
    }
  },
    // mounted () {
  //   this.ws = new WebSocket(`ws://127.0.0.1:8083/webSocket?token=123456789`)

  //   this.ws.onopen = evt => {
  //     console.log('Socket connection open.')
  //   }

  //   this.ws.onmessage = evt => {
  //     this.$Notice.info({
  //       title: '定时任务',
  //       desc: evt.data
  //     })
  //   }

  //   this.ws.onclose = evt => {
  //     console.log('******************')
  //     console.log('关闭连接.......')
  //     console.log('******************')
  //   }
  // },
  methods: {
    connection () {
      this.$ajax.get('/test/as?token=123456789').then((res) => {
        console.log('发送请求')
      })
    },
    collapsedSider () {
      this.$emit('toggle-collapse')
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu-icon{
      transform: rotate(-90deg);
  }
  .rotate-icon{
      transition: all .3s;
  }
  .ivu-badge {
    display: inline-block;
    text-align: center;
    white-space: nowrap;
    position: relative;
    vertical-align: middle;
    width: 32px;
    height: 32px;
    line-height: 32px;
  }
</style>
