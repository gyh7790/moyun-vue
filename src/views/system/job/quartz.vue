<template>
<div class="quartz">
    <Form ref="searchForm" style="padding-left:30px;" :model="searchForm" inline>
        <FormItem label="名称">
            <i-input type="text" v-model="searchForm.name" placeholder="name">
            </i-input>
        </FormItem>
        <FormItem label="查询">
            <Button type="primary" icon="ios-search" @click="getSchedule"></Button>
        </FormItem>
        <FormItem label="新增">
            <Button type="primary" icon="md-add" @click="addRow"></Button>
        </FormItem>
    </Form>
    <Table  border :columns="columns" :data="tablesData">
      <template slot-scope="{ row, index }" slot="jobName">
        <Input type="text" v-model="row.jobName" v-if="editIndex === index" />
        <span v-else>{{ row.jobName }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="beanName">
        <Input type="text" v-model="row.beanName" v-if="editIndex === index" />
        <span v-else>{{ row.beanName }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="methodName">
        <Input type="text" v-model="row.methodName" v-if="editIndex === index" />
        <span v-else>{{ row.methodName }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="params">
        <Input type="text" v-model="row.params" v-if="editIndex === index" />
        <span v-else>{{ row.params }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="cron">
        <Input type="text" v-model="row.cronExpression" v-if="editIndex === index" />
        <span v-else>{{ row.cronExpression }}</span>
      </template>
      <template slot-scope="{ row }" slot="status">
        <Tag v-if="row.status === 1" color="warning">暂停</Tag>
        <Tag v-else color="success">正常</Tag>
      </template>
      <template slot-scope="{ row, index }" slot="remarks">
        <Input type="text" v-model="row.remarks" v-if="editIndex === index" />
        <span v-else>{{ row.remarks }}</span>
      </template>
      <template slot-scope="{ row,index }" slot="action">
        <div v-if="editIndex === index">
          <Button type="success" style="margin-right:5px;" size="small" :loading="saveloading" @click="saveSchedule(row)">保存</Button>
          <Button type="warning" style="margin-right:5px;" size="small" @click="editIndex = -1">取消</Button>
        </div>
        <div v-if="editIndex !== index">
          <Button  type="warning" style="margin-right:5px;" size="small" @click="editIndex = index">编辑</Button>
          <Button v-if="row.status" type="success" style="margin-right:5px;" size="small" @click="resume(row,index)" >启动</Button>
          <Button v-else type="warning" style="margin-right:5px;" size="small" @click="pause(row,index)">暂停</Button>
          <Button  type="error" style="margin-right:5px;" size="small"  @click="deleteSchedule(row,index)">删除</Button>
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
        name: ''
      },
      page: {
        pageNo: 1,
        total: 0,
        size: 10
      },
      saveloading: false,
      columns: [
        {
          title: '任务名称',
          slot: 'jobName',
          align: 'center'
        },
        {
          title: 'bean名称',
          slot: 'beanName',
          align: 'center'
        },
        {
          title: '方法',
          slot: 'methodName',
          align: 'center'
        },
        {
          title: '参数',
          slot: 'params',
          align: 'center'
        },
        {
          title: 'cron',
          slot: 'cron',
          align: 'center',
          width: 170
        },
        {
          title: '描述',
          slot: 'remarks',
          align: 'center'
        },
        {
          title: '状态',
          slot: 'status',
          width: 90,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      tablesData: [],
      editIndex: -1
    }
  },
  methods: {
    getSchedule () {
      this.$ajax.get('/job/scheduleJob/page', { params: {
        name: this.searchForm.name,
        pageNo: this.page.pageNo,
        pageSize: this.page.size
      } }).then((res) => {
        this.tablesData = res.page.list
        this.page.pageNo = res.page.pageNo
        this.page.size = res.page.pageSize
        this.page.total = res.page.total
      })
    },
    addRow () {
      if (!JSON.stringify(this.tablesData).includes('{}')) {
        this.tablesData.push({})
        this.editIndex = this.tablesData.length - 1
      }
    },
    saveSchedule (row) {
      this.saveloading = true
      this.$ajax.post('/job/scheduleJob/save', {
        id: row.id,
        jobId: row.jobId,
        jobName: row.jobName,
        beanName: row.beanName,
        methodName: row.methodName,
        params: row.params,
        cronExpression: row.cronExpression,
        status: row.status || 0,
        remarks: row.remarks
      }).then((res) => {
        row.id = res.id
        row.status = res.status
        this.editIndex = -1
        this.$Message.success(res.msg)
        this.saveloading = false
      })
    },
    pause (row, index) {
      this.$ajax.get('/job/scheduleJob/' + row.id + '/pause').then((res) => {
        row.status = 1
        this.$Message.success(res.msg)
      })
    },
    resume (row, index) {
      this.$ajax.get('/job/scheduleJob/' + row.id + '/resume').then((res) => {
        row.status = 0
        this.$Message.success(res.msg)
      })
    },
    deleteSchedule (row, index) {
      this.$Modal.confirm({
        title: '删除数据',
        content: '<p>是否要删除"' + row.jobName + '"</p>',
        onOk: () => {
          this.$ajax.delete('/job/scheduleJob/' + row.id).then((res) => {
            this.tablesData.splice(index, 1)
            this.$Message.success(res.msg)
          })
        }
      })
    },
    pageChangeHandler (index) {
      this.page.pageNo = index
      this.getSchedule()
    },
    pageSizeChangeHandler (size) {
      this.page.size = size
      this.getSchedule()
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
