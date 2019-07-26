<template>
<div class="demo-split" style="padding:5px;">
  <Form ref="searchForm" label-position="top" inline>
    <FormItem label="新增"><Button type="primary" @click="onAdd" icon="md-add"></Button></FormItem>
  </Form>
  <Row :gutter="24" style="padding:5px;">
    <i-col style="padding:5px;" span="4">
      <div>
        <Card dis-hover style="height:100%;">
          <p slot="title">部门</p>
          <Button :loading="loadRefresh" icon="ios-refresh" @click="getDept"  size="small" shape="circle" slot="extra"></Button>
          <zTree :search="true" :treeData="deptList" @ztClick="getPartDept"></zTree>
        </Card>
      </div>
    </i-col>
    <i-col style="padding:5px;" span="20">
      <Table no-data-text="已是最低部门" border :columns="tablecolumn" :data="tableData">
        <template slot-scope="{ row, index }" slot="action">
          <Button  type="warning" style="margin-right:5px;" size="small" @click="onEdit(row, index)">编辑</Button>
          <Button  type="error" style="margin-right:5px;" size="small" @click="onDelete(row, index)">删除</Button>
        </template>
      </Table>
    </i-col>
  </Row>

  <Modal v-model="modal" width="900" :mask-closable="false">
    <p slot="header" style="color:#f60;">
      <span v-if="modelForm.id">修改部门({{updateName}})</span>
      <span v-else-if="modelForm.parentName">添加({{modelForm.parentName}})的下级部门</span>
      <span v-else>添加公司</span>
    </p>
    <div>
      <Form ref="modelForm" :model="modelForm" :rules="ruleValidate" label-position="top" inline>
        <FormItem label="名称" prop="name">
            <i-input v-model="modelForm.name"></i-input>
        </FormItem>
        <FormItem label="区域">
            <i-input v-model="modelForm.areaId"></i-input>
        </FormItem>
        <FormItem label="地址">
            <i-input v-model="modelForm.address"></i-input>
        </FormItem>
        <FormItem label="code">
            <i-input v-model="modelForm.code"></i-input>
        </FormItem>
        <FormItem label="邮编">
            <i-input v-model="modelForm.zipCode"></i-input>
        </FormItem>
        <FormItem label="负责人">
            <i-input v-model="modelForm.master"></i-input>
        </FormItem>
        <FormItem label="手机">
            <i-input v-model="modelForm.phone"></i-input>
        </FormItem>
        <FormItem label="传真">
            <i-input v-model="modelForm.fax"></i-input>
        </FormItem>
        <FormItem label="邮箱" prop="mail">
            <i-input v-model="modelForm.email"></i-input>
        </FormItem>
        <FormItem label="主负责人">
            <i-input v-model="modelForm.principal"></i-input>
        </FormItem>
        <FormItem label="副负责人">
            <i-input v-model="modelForm.deputy"></i-input>
        </FormItem>
        <FormItem label="类型">
            <i-input v-model="modelForm.type"></i-input>
        </FormItem>
        <FormItem label="等级">
            <i-input type="number" size="small" v-model="modelForm.grade"></i-input>
        </FormItem>
        <FormItem label="排序">
            <i-input type="number" size="small" v-model="modelForm.sort"></i-input>
        </FormItem>
        <FormItem label="可见">
          <i-switch :value="modelForm.useable">
              <span slot="1">开</span>
              <span slot="0">关</span>
          </i-switch>
        </FormItem>
    </Form>
    </div>
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
      split: 0.13,
      deptList: [],
      loadRefresh: false,
      saveLoading: false,
      editIndex: -1,
      modal: false,
      tableData: [],
      tablecolumn: [
        {
          title: '名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '地址',
          key: 'address',
          align: 'center'
        },
        {
          title: '邮编',
          key: 'zipCode',
          align: 'center'
        },
        {
          title: '手机',
          key: 'phone',
          align: 'center'
        },
        {
          title: '邮箱',
          key: 'email',
          align: 'center'
        },
        {
          title: '负责人',
          key: 'master',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        },
      ],
      modelForm: {
        parentId: 0,
			  parentIds: 0,
      },
      ruleValidate: {
        mail: [
          { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
          { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
        ],
      }
    }
  },
  mounted () {
    this.$ajax.get('/sys/dept/list').then((res) => {
      this.tableData = res.list
      this.deptList = res.list.map(e => ({
        id: e.id,
        pId: e.parentId,
        pIds: e.parentIds,
        name: e.name
      }))
    })
  },
  methods: {
    getDept () {
      this.loadRefresh = true
      this.$ajax.get('/sys/dept/list').then((res) => {
        let deptmap = res.list.map(e => ({
          id: e.id,
          pId: e.parentId,
          name: e.name
        }))
        this.deptList = deptmap
        this.loadRefresh = false
      })
    },
    getPartDept (event, treeId, treeNode) {
      this.modelForm.parentId = treeNode.id,
      this.modelForm.parentName = treeNode.name
			this.modelForm.parentIds = treeNode.pIds + ',' + treeNode.id,
      this.$ajax.get('/sys/dept/listByPid', { params: {
        pId: treeNode.id
      } }).then((res) => {
        this.tableData = res.list
      })
    },
    onAdd () {
      this.modal = true
      this.modelForm = {
        parentId: this.modelForm.parentId,
        parentIds: this.modelForm.parentIds,
        parentName: this.modelForm.parentName,
      }
    },
    onSave () {
      this.saveLoading = true
      this.$ajax.post('/sys/dept/save', this.modelForm).then((res) => {
        if (this.modelForm.editIndex) {
          this.tableData.splice(this.modelForm.editIndex,1,this.modelForm)
        }
        this.$Message.success(res.msg)
        this.saveLoading = false
        this.modal = false
      }).catch((res) => { this.saveLoading = false })
    },
    onEdit (item, index) {
      this.modal = true
      this.modelForm = {
        id: item.id,
			  parentId: item.parentId,
			  parentIds: item.parentIds,
			  name: item.name,
			  areaId: item.areaId,
			  sort: item.sort,
			  code: item.code,
			  type: item.type,
			  grade: item.grade,
			  address: item.address,
			  zipCode: item.zipCode,
			  master: item.master,
			  phone: item.phone, 
		    fax: item.fax,
			  email: item.email,
			  principal: item.principal,
			  deputy: item.deputy,
        useable: item.useable,
        editIndex: index
      }
      this.updateName = item.name
    },
    onDelete (item, index) {
      this.$Modal.confirm({
        title: '删除数据',
        content: '<p>是否要删除"' + item.name + '"</p>',
        onOk: () => {
          this.$ajax.delete('/sys/dept/' + item.id).then((res) => {
            this.tableData.splice(index, 1)
            this.$Message.success(res.msg)
            this.getMenu()
            this.modal = false
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

.demo-split {
  height: 100%;
}

</style>
