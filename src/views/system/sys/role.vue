<template>
  <div>
    <Form ref="searchForm" label-position="top" inline>
      <FormItem label="新增"><Button type="primary" icon="md-add"></Button></FormItem>
    </Form>

    <Table  border :columns="tablecolumn" :data="tableData">
      <template slot-scope="{ row }" slot="dept">
        <span >{{ row.dept.name }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="action">
          <Button  type="warning" style="margin-right:5px;" size="small" @click="editIndex = index">编辑</Button>
          <Button  type="success" style="margin-right:5px;" size="small" @click="modal = true" >分配</Button>
          <Button  type="error" style="margin-right:5px;" size="small" >删除</Button>
      </template>
    </Table>

    <Modal v-model="modal" width="900" style="max-height:200px;"  :mask-closable="false">
      <p slot="header" >
        <span>分配角色</span>
      </p>
      <div>
        <Row gutter="24" style="background:#eee;padding:5px">
          <i-col span="8">
            <Card>
              <p slot="title">部门</p>
              <a href="#" slot="extra">
                Change
              </a>
              <p>Content of card</p>
              <p>Content of card</p>
              <p>Content of card</p>
              <p>Content of card</p>
              <p>Content of card</p>
              <p>Content of card</p>
              <p>Content of card</p>
              <p>Content of card</p>
              <p>Content of card</p>
              <p>Content of card</p>
            </Card>
          </i-col>
          <i-col span="8">
            <Card >
              <p slot="title">待分配人员</p>
              <p>Content of card</p>
              <p>Content of card</p>
              <p>Content of card</p>
            </Card>
          </i-col>
          <i-col span="8">
            <Card>
              <p slot="title">已分配人员</p>
              <p>Content of card</p>
              <p>Content of card</p>
              <p>Content of card</p>
            </Card>
          </i-col>
        </Row>
      </div>
      <div slot="footer">
          <Button type="error" size="small" >Delete</Button>
      </div>
    </Modal>
    

  </div>
</template>
<script>
export default {
  data () {
    return {
      editIndex: -1,
      loading: false,
      modal: false,
      tablecolumn: [
        {
          title: '角色名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '归属部门',
          slot: 'dept',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      tableData: []
    }
  },
  mounted: function () {
    this.$ajax.get('/sys/role/listAll').then((res) => {
      this.tableData = res.list
    })
  },
  methods: {
    getRole () {
    }
  }
}
</script>
<style lang="scss" scope>
.ivu-table-tip table{
      width: auto;
  }
.ivu-page {
  margin-top:10px;
  margin-left:10px;
  text-align: left;
}
</style>
