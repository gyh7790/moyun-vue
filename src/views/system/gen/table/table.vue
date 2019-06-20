<template>
<div>
    <Form ref="searchForm" style="padding-left:30px;" :model="searchForm" inline>
        <FormItem label="表名">
            <i-input type="text" v-model="searchForm.tableName" placeholder="tableName">
            </i-input>
        </FormItem>
        <FormItem label="描述">
            <i-input type="text" v-model="searchForm.comments" placeholder="comments">
            </i-input>
        </FormItem>
        <FormItem label="查询">
            <Button type="primary" :loading="loading" icon="ios-search" @click="getTable"></Button>
        </FormItem>
        <FormItem label="新增">
            <Button type="primary" icon="md-add"></Button>
        </FormItem>
    </Form>
    <Table width='auto' border :columns="columns" :data="tableData">
        <!-- 表名 -->
        <template slot-scope="{ row, index }" slot="name">
          <Input type="text" v-model="row.name" v-if="editIndex === index" />
          <span v-else>{{ row.name }}</span>
        </template>
        <!-- 行数 -->
        <template slot-scope="{ row }" slot="tableRows">
          <span >{{ row.tableRows }}</span>
        </template>
        <!-- 描述 -->
        <template slot-scope="{ row, index }" slot="comments">
          <Input type="text" v-model="row.comments" v-if="editIndex === index" />
          <span v-else>{{ row.comments }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <div v-if="row.id && !row.scheme">
            <Button size="small" style="margin-right:5px;" @click="genScheme(row,index)" type="success">生成方案</Button>
          </div>
          <div v-if="row.id && row.scheme">
            <Button size="small" style="margin-right:5px;"  @click="getScheme(row.id)" type="success">查看方案</Button>
          </div>
          <div v-if="!row.id">
            <Button size="small" style="margin-right:5px;" type="warning">未转存</Button>
          </div>
        </template>
    </Table>
    <Pages :page-no="page.pageNo" :total="page.total" :page-size="page.size" @change="pageChangeHandler" @change-page-size="pageSizeChangeHandler"/>

    <Modal v-model="isScheme" width="900" :mask-closable="false">
      <p slot="header">
          <Icon type="ios-information-circle"></Icon>
          <span>生成业务方案</span>
          <span style="color:red;">({{scheme.genCode? '已生成代码' : '未生成代码'}})</span>
      </p>
      <div style="text-align:center">
        <Form ref='scheme' :model="scheme" label-position="top" :rules="rules" inline>
          <FormItem label="方案名称" prop="name">
              <i-input v-model="scheme.name" placeholder="name"></i-input>
          </FormItem>
          <FormItem label="模板分类" prop="category">
              <i-input v-model="scheme.category" placeholder="category"></i-input>
          </FormItem>
          <FormItem label="生成包路径" prop="packageName">
              <i-input v-model="scheme.packageName" placeholder="packageName"></i-input>
          </FormItem>
          <FormItem label="生成模块名" prop="moduleName">
              <i-input v-model="scheme.moduleName" placeholder="moduleName"></i-input>
          </FormItem>
          <FormItem label="生成子模块名">
              <i-input v-model="scheme.subModuleName" placeholder="subModuleName"></i-input>
          </FormItem>
          <FormItem label="生成功能描述" prop="functionName">
              <i-input v-model="scheme.functionName" placeholder="functionName"></i-input>
          </FormItem>
          <FormItem label="生成功能名" prop="functionNameSimple">
              <i-input v-model="scheme.functionNameSimple" placeholder="functionNameSimple"></i-input>
          </FormItem>
          <FormItem label="生成功能作者" prop="functionAuthor">
              <i-input v-model="scheme.functionAuthor" placeholder="functionAuthor"></i-input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="padding-right:50px">
        <Button type="error" @click="cancel">取消</Button>
        <Button type="warning" @click="genCode(false)" v-if="scheme.id">生成代码</Button>
        <Button type="success" @click="saveScheme">{{scheme.id ? '修改' : '保存'}}</Button>
      </div>
    </Modal>
    <Modal
        v-model="isSchemeModal" width="200"
        @on-ok="genCode(true)" style="text-align:center">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>是否替换代码</span>
        </p>
        <div style="text-align:center">
          <i-switch v-model="replaceFile" size="large">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </div>
    </Modal>
</div>
</template>
<script>
import expandRow from './table-expand.vue'
export default {
  data () {
    return {
      loading: false,
      searchForm: {
        tableName: '',
        comments: ''
      },
      page: {
        pageNo: 1,
        total: 0,
        size: 10
      },
      // 校验规则
      rules: {
        name: [{ required: true, message: '必填', trigger: 'blur' }],
        category: [{ required: true, message: '必填', trigger: 'change' }],
        moduleName: [{ required: true, message: '必填', trigger: 'blur' }],
        functionName: [{ required: true, message: '必填', trigger: 'blur' }],
        functionNameSimple: [{ required: true, message: '必填', trigger: 'blur' }],
        functionAuthor: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      replaceFile: true,
      scheme: {
        id: '',
        tableId: '',
        name: '',
        category: '单表',
        packageName: '',
        moduleName: '',
        subModuleName: '',
        functionName: '',
        functionNameSimple: '',
        functionAuthor: 'guoyh',
        genCode: ''
      },
      nowRow: -1,
      isScheme: false,
      isSchemeModal: false,
      // 当前聚焦的输入框的行数
      editIndex: -1,
      paramsColumn: [],
      columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                rows: params.row,
                tableSelet: this.tableData
              },
              on: {
                getID: (val) => {
                  params.row = val
                  this.tableData.map(e => {
                    if (e.name === val.name) {
                      e.id = val.id
                      e.scheme = val.scheme
                    }
                  })
                }
              }
            })
          }
        },
        {
          title: '表名',
          slot: 'name'
        },
        {
          title: '行数',
          slot: 'tableRows'
        },
        {
          title: '描述',
          slot: 'comments'
        },
        {
          title: '状态',
          width: 150,
          align: 'center',
          slot: 'action'
        }
      ],
      tableData: []
    }
  },
  methods: {
    genCode (flag) {
      if (!this.scheme.genCode || flag) {
        this.$ajax.get('/sys/gen/scheme/genCode?id=' + this.scheme.id + '&replaceFile=' + this.replaceFile).then((res) => {
          this.scheme.genCode = true
          this.$Message.success('代码已生成')
          this.tableData[this.nowRow].scheme = true
          this.isScheme = false
          this.nowRow = -1
        })
      } else {
        this.isSchemeModal = true
      }
    },
    getScheme (id) {
      this.$ajax.get('/sys/gen/scheme/getScheme?id=' + id).then((res) => {
        this.scheme = res.genScheme
        this.isScheme = true
      })
    },
    saveScheme () {
      this.$refs.scheme.validate((valid) => {
        if (valid) {
          this.$ajax.post('/sys/gen/scheme/save', {
            genScheme: this.scheme
          }).then((res) => {
            console.log(res)
            if (res.code === 200) {
              this.$Message.success('保存成功')
              this.scheme = res.data
            } else {
              this.$Message.error(res.msg)
            }
          })
        }
      })
    },
    cancel () {
      this.isScheme = false
    },
    // 生成方案
    genScheme (row, index) {
      this.isScheme = true
      this.scheme.tableId = row.id
      this.scheme.functionName = row.comments
      this.scheme.functionNameSimple = row.comments
      this.nowRow = index
    },
    getTable () {
      this.loading = true
      this.$ajax.get('/sys/gen/table/page', {
        params: {
          name: this.searchForm.tableName,
          pageNo: this.page.pageNo,
          pageSize: this.page.size
        }
      }).then((res) => {
        if (res.code === 200) {
          this.tableData = res.page.list
          if (this.tableData.length <= 0) {
            this.$Message.warning('未找到数据')
          }
          this.editIndex = -1

          this.page.pageNo = res.page.pageNo
          this.page.total = res.page.total
          this.page.size = res.page.pageSize
        }
      })
      this.loading = false
    },
    pageChangeHandler (index) {
      this.page.pageNo = index
      this.getTable()
    },
    pageSizeChangeHandler (size) {
      this.page.size = size
      this.getTable()
    },
    searchColumn (row) {
      this.$ajax.get('/sys/gen/column/list?tableName=' + row.name).then((res) => {
        if (res.code === 200) {
          this.paramsColumn = res.data
        }
      })
    },
    handleEdit (row, index) {
      this.editIndex = index
    }
  }
}
</script>
<style lang="scss" scope>
    .ivu-table-tip table{
        width: auto;
    }
    .ivu-table {
        border-radius: 5px;
    }
    td.ivu-table-expanded-cell {
        padding: 10px 15px;
        background: #f8f8f9;
    }
    .ivu-page {
      margin-top:10px;
      margin-left:10px;
      text-align: left;
    }
</style>
