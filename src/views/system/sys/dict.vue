<template>
  <div class="dict">
    <Form ref="searchForm" style="padding-left:30px;" :model="searchForm" inline>
      <FormItem label="标签">
        <i-input type="text" v-model="searchForm.label" placeholder="标签"></i-input>
      </FormItem>
      <FormItem label="类型">
        <i-input type="text" v-model="searchForm.type" placeholder="类型"></i-input>
      </FormItem>
      <FormItem label="描述">
        <i-input type="text" v-model="searchForm.description" placeholder="描述"></i-input>
      </FormItem>
      <FormItem label="查询">
        <Button type="primary" icon="ios-search" @click="getDict"></Button>
      </FormItem>
      <FormItem label="新增">
        <Button type="primary" icon="md-add" @click="addRow({},-1)"></Button>
      </FormItem>
    </Form>

    <Table border :columns="tablecolumn" :data="tableData">
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
        <Input type="number" v-model="row.sort" v-if="editIndex === index" />
        <span v-else>{{ row.sort }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <div v-if="editIndex === index">
          <Button  type="success" style="margin-right:5px;" size="small" :loading="loading" @click="saveDict(row, index)">保存</Button>
          <Button  type="warning" style="margin-right:5px;" size="small" @click="onCancel(row, index)">取消</Button>
        </div>
        <div v-else>
          <Button  type="warning" style="margin-right:5px;" size="small" @click="editIndex = index">编辑</Button>
          <Button  type="success" style="margin-right:5px;" size="small" @click="addRow( row, index)">插入</Button>
          <Button  type="error" style="margin-right:5px;" size="small" @click="deleteDict( row, index)">删除</Button>
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
        type: '',
        label: '',
        description: ''
      },
      page: {
        pageNo: 1,
        total: 0,
        size: 10
      },
      loading: false,
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
        label: this.searchForm.label,
        description: this.searchForm.description,
        type: this.searchForm.type,
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
    saveDict (row, index) {
      this.loading = true
      this.$ajax.post('/sys/dict/save', row).then((res) => {
        this.$Message.success(res.msg)
        this.editIndex = -1
        this.loading = false
      }).catch((res) => { this.loading = false })
    },
    addRow (row, index) {
      let flag = true
      this.tableData.forEach(i => {
        if (!i.id) {
          flag = false
        }
      })
      if (flag) {
        this.tableData.splice(index + 1, 0, { sort: row.sort + 1 })
        this.editIndex = index + 1
      }
    },
    onCancel (row, index) {
      this.editIndex = -1
      if (!row.id) {
        this.tableData.splice(index, 1)
      }
    },
    deleteDict (row, index) {
      this.$Modal.confirm({
        title: '删除数据',
        content: '<p>是否要删除"' + row.description + '"</p>',
        onOk: () => {
          this.$ajax.delete('/sys/dict/' + row.id).then((res) => {
            this.tableData.splice(index, 1)
            this.page.total = this.tableData.length
            this.$Message.success(res.msg)
          })
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
