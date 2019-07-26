<template>
  <div>
    <Poptip trigger="hover" title="已有接口" content="content">
      <Button size="small" @click="modalShow = true">未配置</Button>
      <div slot="content" style="max-height: 200px;">
          这里显示已经选择的URL
      </div>
    </Poptip>
     <Modal title="请配置URL" v-model="modalShow" width="400">
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      modalShow: false
    }
  }
}
</script>