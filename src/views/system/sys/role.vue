<template>
<div class="demo-split" style="padding:5px;">
  <h1>角色管理</h1>
  <Form ref="searchForm" label-position="top" inline>
    <FormItem label="新增"><Button type="primary" @click="onAdd" icon="md-add"></Button></FormItem>
  </Form>

  <Row :gutter="24" style="padding:5px;">
    <i-col style="padding:5px;" span="4">
      <div>
        <Card dis-hover>
          <p slot="title">DEPT</p>
          <Button :loading="loadRefresh" icon="ios-refresh" @click="getDept"  size="small" shape="circle" slot="extra"></Button>
          <zTree  ref="ztreeRole" :search="true" :treeData="deptList" @ztClick="getDeptRole"></zTree>
        </Card>
      </div>
    </i-col>
    <i-col style="padding:5px;" span="20">
      <Table style="overflow:initial;" border :columns="tablecolumn" :data="tableData">
        <template slot-scope="{ row, index }" slot="name">
          <Input type="text" v-model="row.name" v-if="editIndex === index" />
          <span v-else>{{ row.name }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="enname">
          <Input type="text" v-model="row.enname" v-if="editIndex === index" />
          <span v-else>{{ row.enname }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="dept">
          <Input type="text" v-model="row.value" v-if="editIndex === index" />
          <span v-else>{{ company(row) }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="useable">
          <Input type="text" v-model="row.useable" v-if="editIndex === index" />
          <span v-else>{{ row.useable }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="dataScope">
          <div v-if="editIndex === index">
            <Dict :model.sync="row.dataScope" type="type"></Dict>
          </div>
          <span v-else>{{ row.dataScope }}</span>
        </template>
        <template slot-scope="{ row }" slot="permission">
          <span>{{ row.permission }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button  type="warning" style="margin-right:5px;" size="small" @click="editIndex = index">编辑</Button>
          <Button  type="success" style="margin-right:5px;" size="small" @click="allotUser(row)" >分配</Button>
          <Button  type="error" style="margin-right:5px;" size="small" @click="onDelete(row, index)" >删除</Button>
        </template>
      </Table>
    </i-col>
  </Row>

  <Modal v-model="modal" width="900" :mask-closable="false" >
    <p slot="header" style="color:#f60;">
      <span>角色分配</span>
    </p>
      <Row type="flex" justify="space-around" class="code-row-bg">
        <i-col span="8" style="padding:0px 5px;">
          <Card style="height:300px;overflow: auto;">
            <p slot="title">部门</p>
            <template>
              <zTree ref="ztree" :initAfterSync="false" :search="true" :treeData="deptUserList" @ztClick="zTreeDeptUser"></zTree>
            </template>
          </Card>
        </i-col>
        <i-col span="8" style="padding:0px 5px;">
          <Card style="height:300px;overflow: auto;">
            <p slot="title">待选人员</p>
            <Tag v-for="(item, index) in waiting" size="small" :key="index" type="dot" :color="isSelected(item.id) ? 'default' : 'primary'" @click.native="moveUser(item)">{{item.name}}</Tag>
          </Card>
        </i-col>
        <i-col span="8" style="padding:0px 5px;">
          <Card style="height:300px;overflow: auto;">
            <p slot="title">已选人员</p>
            <Tag v-for="(item, index) in already" size="small" closable :key="index" type="border" color="blue" @on-close="removeUser(index)">{{item.name}}</Tag>
          </Card>
        </i-col>
      </Row>
    <div slot="footer">
      <Button type="error" @click="modal = false">取消</Button>
      <Button type="info" :loading="saveLoading" @click="onSave()">保存</Button>
    </div>
  </Modal>
</div>
</template>

<script>
export default {
  data () {
    return {
      deptList: [],
      deptUserList: [],
      loadRefresh: false,
      saveLoading: false,
      editIndex: -1,
      modal: false,
      tableData: [],
      tablecolumn: [
        {
          title: '角色名称',
          slot: 'name',
          align: 'center'
        },
        {
          title: '英文名称',
          slot: 'enname',
          align: 'center'
        },
        {
          title: '归属部门',
          slot: 'dept',
          align: 'center'
        },
        {
          title: '可用',
          slot: 'useable',
          align: 'center'
        },
        {
          title: '数据范围',
          slot: 'dataScope',
          align: 'center'
        },
        {
          title: '权限',
          slot: 'permission',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          align: 'center'
        }
      ],
      modelForm: {
        parentId: 0,
        parentIds: 0
      },
      ruleValidate: {
        mail: [
          { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
          { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
        ]
      },
      roleId: '',
      waiting: [],
      already: []
    }
  },
  watch: {
    'modal' (flag) {
      if (flag) {
        this.$refs.ztree.init()
      } else {
        this.$refs.ztree.destroy()
      }
    }
  },
  computed: {
    company () {
      return (row) => {
        let name = '未知公司'
        this.deptList.forEach(e => {
          if (e.id === row.deptId) {
            name = e.name
          }
        })
        return name
      }
    }
  },
  mounted () {
    this.getDept()
    this.getRole()
  },
  methods: {
    getRole () {
      this.$ajax.get('/sys/role/list').then((res) => {
        this.tableData = res.list
      })
    },
    getDept () {
      this.loadRefresh = true
      this.$ajax.get('/sys/dept/list').then((res) => {
        let deptmap = res.list.map(e => ({
          id: e.id,
          pId: e.parentId,
          name: e.name
        }))
        this.deptUserList = deptmap
        this.deptList = deptmap
        this.loadRefresh = false
      })
    },
    getDeptRole (event, treeId, treeNode) {
      let ids = []
      const getZtreeIds = nodes => {
        nodes.forEach(e => {
          ids.push(e.id)
          if (e.children) {
            getZtreeIds(e.children)
          }
        })
      }
      getZtreeIds([treeNode])
      this.modelForm.parentId = treeNode.id
      this.$ajax.get('/sys/role/list', { params: {
        deptIds: ids.join(',')
      } }).then((res) => {
        this.tableData = res.list
      })
    },
    // 分配用户 初始化
    allotUser (item) {
      this.modal = true
      this.roleId = item.id
      // 获取 该角色下的人员
      this.$ajax.get('/sys/user/listUser', { params: {
        roleId: item.id
      } }).then((res) => {
        this.already = res.list
      })
      // 获取 该部门下的人员
      this.getDeptUser(item.deptId)
    },
    zTreeDeptUser (event, treeId, treeNode) {
      this.getDeptUser(treeNode.id)
    },
    getDeptUser (id) {
      this.$ajax.get('/sys/user/list', { params: {
        deptId: id
      } }).then((res) => {
        this.waiting = res.list
      })
    },
    isSelected (id) {
      return this.already.find(e => e.id === id)
    },
    // 转移用户
    moveUser (user) {
      if (!this.isSelected(user.id)) {
        this.already.push(user)
      }
    },
    // 移除用户
    removeUser (index) {
      this.already.splice(index, 1)
    },
    getZtIds () {

    },
    onAdd () {
      this.modal = true
      this.modelForm = {
        parentId: this.modelForm.parentId,
        parentIds: this.modelForm.parentIds,
        parentName: this.modelForm.parentName
      }
    },
    onSave () {
      this.saveLoading = true
      this.$ajax.post('/sys/userRole/saveset', {
        userIds: this.already.map(e => e.id),
        roleId: this.roleId
      }).then((res) => {
        if (this.modelForm.editIndex) {
          this.tableData.splice(this.modelForm.editIndex, 1, this.modelForm)
        }
        this.$Message.success(res.msg)
        this.saveLoading = false
        this.modal = false
        this.roleId = ''
      }).catch((res) => { this.saveLoading = false })
    },
    onDelete (item, index) {
      console.log(item)
      console.log(this.$refs.ztree.tree)
      console.log(this.$refs.ztreeRole.tree)
    }
  }
}
</script>

<style lang="scss" scope>
.ivu-table-tip table{
  width: auto;
}
.demo-split {
  height: 100%;
}
.ivu-table-cell {
  overflow: inherit;
}
.ivu-modal-body {
  background:#eee;
}
</style>
