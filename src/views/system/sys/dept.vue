<template>
<div class="demo-split" style="padding:5px;">
  <Form ref="searchForm" label-position="top" inline>
    <FormItem label="新增"><Button type="primary" @click="modal = true" icon="md-add"></Button></FormItem>
  </Form>
  <Split v-model="split">
    <div slot="left" style="padding:5px;" class="demo-split-pane">
      <Card dis-hover style="height:100%;">
        <p slot="title">部门</p>
        <Button :loading="loadRefresh" icon="ios-refresh" @click="getDept"  size="small" shape="circle" slot="extra"></Button>
        <zTree :treeData="deptList" :ztClick="getPartDept"></zTree>
      </Card>
    </div>
    <div slot="right" style="padding:10px;" class="demo-split-pane">
    </div>
  </Split>
</div>
</template>

<script>
export default {
  data () {
    return {
      split: 0.15,
      tableData: [],
      deptList: [],
      modal: false,
      updateName: '',
      loadRefresh: false,
      tableColumns: [
        { title: '名称', key: 'name' },
        { title: '图标', key: 'icon', align: 'center' },
        { title: '链接', key: 'href', align: 'center' },
        { title: '目标', key: 'target', align: 'center' },
        { title: '排序', key: 'sort', align: 'center' },
        { title: '可见', key: 'isShow', align: 'center' },
        { title: '权限标识', key: 'permission', align: 'center' }
      ],
      modelForm: {
        parentId: 1,
        parentIds: '1',
        name: '',
        sort: 0,
        target: '',
        icon: '',
        show: true
      },
      formValidate: {
        name: [{ required: true, message: 'The name cannot be empty', trigger: 'blur' }],
        target: [{ required: true, message: 'The name cannot be empty', trigger: 'blur' }]
      },
      editIndex: -1
    }
  },
  mounted () {
    this.$ajax.get('/sys/menu/navList').then((res) => {
      this.tableData = res.list
    }),
    this.$ajax.get('/sys/dept/list').then((res) => {
      this.deptList = res.list.map(e => ({
          id: e.id,
          pId: e.parentId,
          name: e.name
      }))
    })
  },
  methods: {
    getDept () {
      this.loadRefresh = true
      this.$ajax.get('/sys/dept/list').then((res) => {
        this.deptList = res.list.map(e => ({
            id: e.id,
            pId: e.parentId,
            name: e.name
        }))
        this.loadRefresh = false
      })
    },
    getPartDept (event, treeId, treeNode) {
      console.log('123456798')
    }
  }
}
</script>

<style scoped>
.ivu-split-horizontal,.ivu-split-wrapper {
  position: absolute;
  border:1px solid #e7e7e7;
}
</style>
