<template>
  <div class="dict">
    <Form ref="searchForm" style="padding-left:30px;" :model="searchForm" inline>
      <FormItem label="类型">
        <i-input type="text" v-model="searchForm.type" placeholder="type"></i-input>
      </FormItem>
      <FormItem label="查询">
        <Button type="primary" icon="ios-search" @click="getDict"></Button>
      </FormItem>
      <FormItem label="新增">
        <Button type="primary" icon="md-add" @click="addRow"></Button>
      </FormItem>
    </Form>

    <Table  border :columns="tablecolumn" :data="tableData">
      <template slot-scope="{ row, index }" slot="value">
        <Input type="text" v-model="row.value" v-if="editIndex === index" />
        <span v-else>{{ row.value }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="label">
        <Input type="text" v-model="row.label" v-if="editIndex === index" />
        <span v-else>{{ row.label }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="type">
        <Input type="text" v-model="row.type" v-if="editIndex === index" />
        <span v-else>{{ row.type }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="description">
        <Input type="text" v-model="row.description" v-if="editIndex === index" />
        <span v-else>{{ row.description }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="sort">
        <Input type="text" v-model="row.sort" v-if="editIndex === index" />
        <span v-else>{{ row.sort }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <div v-if="editIndex === index">
          <Button  type="success" style="margin-right:5px;" size="small">保存</Button>
          <Button  type="warning" style="margin-right:5px;" size="small" @click="editIndex = -1">取消</Button>
        </div>
        <div v-else>
          <Button  type="warning" style="margin-right:5px;" size="small" @click="editIndex = index">编辑</Button>
          <Button  type="success" style="margin-right:5px;" size="small" @click="addRow( row, index)">插入</Button>
          <Button  type="error" style="margin-right:5px;" size="small" @click="deleteDict">删除</Button>
        </div>
      </template>
    </Table>
    <Pages :page-no="page.pageNo" :total="page.total" :page-size="page.size" @change="pageChangeHandler" @change-page-size="pageSizeChangeHandler"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchForm: {
        type: ''
      },
      page: {
        pageNo: 1,
        total: 0,
        size: 10
      },
      editIndex: -1,
      tablecolumn: [
        {
          title: '值',
          slot: 'value',
          align: 'center'
        },
        {
          title: '标签',
          slot: 'label',
          align: 'center'
        },
        {
          title: '类型',
          slot: 'type',
          align: 'center'
        },
        {
          title: '描述',
          slot: 'description',
          align: 'center'
        },
        {
          title: '排序',
          slot: 'sort',
          sortable: true,
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
  methods: {
    getDict () {
      this.$ajax.get('/sys/dict/page', { params: {
        pageNo: this.page.pageNo,
        pageSize: this.page.size
      } }).then((res) => {
        this.tableData = res.page.list
        this.page.pageNo = res.page.pageNo
        this.page.total = res.page.total
        this.page.size = res.page.pageSize
      })
    },
    pageChangeHandler (index) {
      this.page.pageNo = index
      this.getDict()
    },
    pageSizeChangeHandler (size) {
      this.page.size = size
      this.getDict()
    },
    addRow (row, index) {
      let flag = true
      this.tableData.forEach(i => {
        if (!i.id) {
          flag = false
        }
      })
      if (flag) {
        this.tableData.splice(index+1, 0,{})
        this.editIndex = index+1
      }
    },
    deleteDict () {
      this.$Modal.warning({
        title: '删除数据',
        onOk: () => {
          this.$Message.info('Clicked ok')
        }
      })
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
