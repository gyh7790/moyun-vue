<template>
  <Header :style="{padding: 0}" class="layout-header-bar">
    <Row :gutter="16">
        <i-col span="3">
          <div>col-6</div>
        </i-col>
        <i-col span="10">
          <div>{{nowTabStr}}</div>
        </i-col>
        <i-col span="10">
          <div>col-6</div>
        </i-col>
        <i-col span="1">
          <div><Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg"/></div>
        </i-col>
    </Row>
  </Header>
</template>
<script>
export default {
  data () {
    return {
      ws: null
    }
  },
  mounted () {
    this.ws = new WebSocket(`ws://localhost:8083/webSocket?token=123456789`)

    this.ws.onopen = evt => {
      console.log('Socket connection open.')
    }

    this.ws.onmessage = evt => {
      this.$Notice.info({
        title: '定时任务',
        desc: evt.data
      })
    }

    this.ws.onclose = evt => {
      console.log('******************')
      console.log('关闭连接.......')
      console.log('******************')
    }
  },
  computed: {
    nowTabStr () {
      return this.$store.state.nowTabStr
    }
  },
  methods: {
    connection () {
      this.$ajax.get('/test/as?token=123456789').then((res) => {
        console.log('发送请求')
      })
    }
  }
}
</script>
