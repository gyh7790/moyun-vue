<template>
  <div>
    <Form ref="searchForm" style="padding-left:30px;" :model="searchForm" inline>
      <FormItem label="姓名">
        <i-input type="text" v-model="searchForm.name" placeholder="name">
        </i-input>
      </FormItem>
      <FormItem label="用户名称">
        <i-input type="text" v-model="searchForm.loginName" placeholder="loginName">
        </i-input>
      </FormItem>
      <FormItem label="查询">
        <Button type="primary" icon="ios-search" @click="getUser"></Button>
      </FormItem>
      <FormItem label="新增">
        <Button type="primary" icon="md-add" @click="modelFlag = true"></Button>
      </FormItem>
    </Form>
    <Table border :columns="tableColumns" :data="tableData">
      <template slot-scope="{ row }" slot="photo">
        <Avatar :src="row.photo"/>
      </template>
      <template slot-scope="{ row }" slot="loginName">
        <span>{{ row.loginName }}</span>
      </template>
      <template  slot-scope="{ row }" slot="action" class="action">
        <Button type="warning" size="small" @click="onEdit(row)">编辑</Button>
        <Button type="error" size="small">删除</Button>
      </template>
    </Table>
    <Pages :page-no="page.pageNo" :total="page.total" :page-size="page.size"
      @change="pageChangeHandler" @change-page-size="pageSizeChangeHandler"/>

    <Modal v-model="modelFlag" width="700" :mask-closable="false">
      <p slot="header">
        <Icon type="ios-information-circle"></Icon>
        <span>添加用户</span>
      </p>
      <div style="text-align:center">
        <Form ref="formValidate" :model="modelForm" label-position="top" inline>
          <Row type="flex" justify="center" align="middle">
            <i-col span="8">
              <img class="photo" src="https://i.loli.net/2017/08/21/599a521472424.jpg" alt="Smiley face">
            </i-col>
            <i-col span="16">
              <Row>
                <i-col span="12">
                  <FormItem label="登录名" prop="loginName">
                    <i-input v-model="modelForm.loginName"></i-input>
                  </FormItem>
                </i-col>
                <i-col span="12">
                  <FormItem label="角色" prop="name">
                    <i-input v-model="modelForm.name"></i-input>
                  </FormItem>
                </i-col>
              </Row>
              <Row>
                <i-col span="12">
                  <FormItem label="姓名" prop="name">
                    <i-input v-model="modelForm.name"></i-input>
                  </FormItem>
                </i-col>
                <i-col span="12">
                  <FormItem label="性别" prop="sex">
                    <RadioGroup v-model="modelForm.sex">
                      <Radio label="0">女</Radio>
                      <Radio label="1">男</Radio>
                    </RadioGroup>
                  </FormItem>
                </i-col>
              </Row>
            </i-col>
          </Row>
          <Row>
            <i-col span="8">
              <FormItem label="电话" prop="phone">
                <i-input v-model="modelForm.phone"></i-input>
              </FormItem>
            </i-col>
            <i-col span="16">
              <Row>
                <i-col span="12">
                  <FormItem label="手机" prop="mobile">
                    <i-input v-model="modelForm.mobile"></i-input>
                  </FormItem>
                </i-col>
                <i-col span="12">
                  <FormItem label="邮箱" prop="email">
                    <i-input v-model="modelForm.email"></i-input>
                  </FormItem>
                </i-col>
              </Row>
            </i-col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button type="error" size="large" @click="modelFlag = false">取消</Button>
        <Button type="success" size="large" @click="saveUser">保存</Button>
      </div>
    </Modal>
 </div>
</template>

<script>
export default {
  data () {
    return {
      searchForm: {
        name: '',
        loginName: ''
      },
      modelForm: {
        loginName: '',
        name: '',
        email: '',
        phone: '',
        mobile: '',
        photo: '',
        sex: ''
      },
      modelFlag: false,
      tableColumns: [
        { title: '头像', slot: 'photo', align: 'center' },
        { title: '登录名', slot: 'loginName', align: 'center' },
        { title: '角色', key: 'sort', align: 'center' },
        { title: '姓名', key: 'name', align: 'center' },
        { title: '手机', key: 'mobile', align: 'center' },
        { title: '电话', key: 'phone', align: 'center' },
        { title: '邮箱', key: 'email', align: 'center' },
        { title: '操作', slot: 'action', align: 'center' }
      ],
      tableData: [],
      page: {
        pageNo: 1,
        total: 0,
        size: 10
      }
    }
  },
  mounted: function () {
    this.$ajax.get('/sys/user/page').then((res) => {
      this.tableData = res.page.list
    })
  },
  methods: {
    getUser () {
      this.$ajax.get('/sys/user/page', {
        params: {
          name: this.searchForm.name,
          loginName: this.searchForm.loginName,
          pageNo: this.page.pageNo,
          pageSize: this.page.size
        } }).then((res) => {
        this.tableData = res.page.list
        this.page.pageNo = res.page.pageNo
        this.page.size = res.page.pageSize
        this.page.total = res.page.total
      })
    },
    saveUser () {
      this.$ajax.post('/sys/user/save',
        this.modelForm
      ).then((res) => {

      })
    },
    onEdit (row) {
      this.modelFlag = true
      this.modelForm = row
    },
    pageChangeHandler (index) {
      this.page.pageNo = index
      this.getUser()
    },
    pageSizeChangeHandler (size) {
      this.page.size = size
      this.getUser()
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
button{
  margin-right:5px;
}
.photo {
  width: 100px;
  border-radius:50px;
}
</style>
