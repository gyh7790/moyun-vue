<template>
<div>
  <Form ref="searchForm" label-position="top" inline>
    <FormItem label="新增"><Button type="primary" @click="modal = true" icon="md-add"></Button></FormItem>
  </Form>
  <table  class="table table-bordered" id='hl-tree-table'>
    <thead>
      <tr>
        <th v-for="col in tableColumns" :key="col.key">
          {{col.title}}
        </th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item , trIndex) in tableData" :key="item.id" v-show="show(item)">
        <td v-for="(col, index) in tableColumns" :key="col.key" :style="tdStyle(col)">
          <span>
            <span :style="textPaddingRight(item,index)">
              <Icon v-if="index == 0 && item.child" @click="toggle(item,trIndex)" :type="item.childShow ? 'md-remove' : 'md-add'"/>
              {{ item[col.key] }}
            </span>
          </span>
        </td>
        <td width="200" style="text-align:center;"  class="action-col">
          <i-button type="warning" @click="onEdit(item,trIndex)" size="small">编辑</i-button>
          <i-button type="error" @click="onDelete(item, trIndex)" size="small">删除</i-button>
          <i-button type="primary" @click="onAdd(item,trIndex)" size="small">添加</i-button>
        </td>
      </tr>
    </tbody>
</table>

<!-- 弹框 -->
  <Modal v-model="modal" width="900" :mask-closable="false">
    <p slot="header" style="color:#f60;">
      <span v-if="modelForm.id">修改菜单({{updateName}})</span>
      <span v-else>添加菜单</span>
    </p>
    <div>
      <Form ref="formValidate" :model="modelForm" label-position="top" :rules="formValidate" inline>
        <FormItem label="名称" prop="name">
            <i-input v-model="modelForm.name"></i-input>
        </FormItem>
        <FormItem label="图标">
            <i-input v-model="modelForm.icon"></i-input>
        </FormItem>
        <FormItem label="链接">
            <i-input v-model="modelForm.href"></i-input>
        </FormItem>
        <FormItem label="目标">
            <i-input v-model="modelForm.target"></i-input>
        </FormItem>
        <FormItem label="排序">
            <i-input type="number" v-model="modelForm.sort"></i-input>
        </FormItem>
        <FormItem label="可见">
          <i-switch :value="modelForm.show">
              <span slot="true">开</span>
              <span slot="false">关</span>
          </i-switch>
        </FormItem>
        <FormItem label="权限标识">
            <i-input v-model="modelForm.permission"></i-input>
        </FormItem>
    </Form>
    </div>
    <div slot="footer">
      <Button type="error" @click="modal = false">取消</Button>
      <Button type="info" @click="onSave('formValidate')">保存</Button>
    </div>
  </Modal>
</div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      modal: false,
      updateName: '',
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
  mounted: function () {
    this.$ajax.get('/sys/menu/navList').then((res) => {
      this.tableData = res.list
    })
  },
  methods: {
    getMenu () {
      this.$ajax.get('/sys/menu/navList').then((res) => {
        this.tableData = res.list
      })
    },
    textPaddingRight (item, index) {
      var style = {}
      if (index === 0) {
        style['margin-left'] = (item.parentIds.split(',').length - 1) * 15 + 'px'
      }
      return style
    },
    show (item) {
      let pop = item.parentIds.split(',').pop()
      if (pop === '1') {
        return true
      }
      if (item.show !== undefined) {
        return item.show
      }
    },
    // 设置td宽度,td的align
    tdStyle (column) {
      var style = {}
      if (column.align) {
        style['text-align'] = column.align
      }
      if (column.width) {
        style['min-width'] = column.width + 'px'
      }
      return style
    },
    toggle (item, index) {
      this.tableData.forEach(e => {
        if (item.childShow) {
          if (e.parentIds.split(',').includes(item.id.toString())) {
            e.show = false
            e.childShow = false
          }
        } else {
          if (e.parentId === item.id) {
            e.show = true
          }
        }
      })
      this.tableData[index].childShow = !item.childShow
    },
    onEdit (item, index) {
      this.modal = true
      this.modelForm = {
        id: item.id,
        name: item.name,
        parentId: item.parentId,
        parentIds: item.parentIds,
        href: item.href,
        sort: item.sort,
        target: item.target,
        icon: item.icon,
        show: item.show,
        childShow: item.childShow,
        child: item.child,
        permission: item.permission,
        index: index
      }
      this.updateName = item.name
    },
    onAdd (item, index) {
      this.modal = true
      this.modelForm = {
        name: '',
        parentId: item.id,
        parentIds: item.parentIds + ',' + item.id,
        href: '',
        sort: 0,
        target: '',
        icon: '',
        show: true,
        permission: '',
        index: index
      }
    },
    onSave (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$ajax.post('/sys/menu/save',
            this.modelForm
          ).then((res) => {
            this.$Message.success('保存成功')
            this.modal = false
            this.updateName = ''
            this.getMenu()
          })
        }
      })
    },
    onDelete (item, index) {
      this.$Modal.confirm({
        title: '删除数据',
        content: '<p>是否要删除"' + item.name + '"</p><p>以及子级菜单</p>',
        onOk: () => {
          this.$ajax.delete('/sys/menu/' + item.id).then((res) => {
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

<style scoped>
.autoTbale {
    overflow: auto;
}

table {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
    overflow: auto;
}

.table-bordered {
    border: 1px solid #EBEBEB;
}

.table>tbody>tr>td,
.table>tbody>tr>th,
.table>thead>tr>td,
.table>thead>tr>th {
    border-top: 1px solid #e7eaec;
    line-height: 1.42857;
    padding: 8px;
    vertical-align: middle;
}

.table-bordered>tbody>tr>td,
.table-bordered>tbody>tr>th,
.table-bordered>tfoot>tr>td,
.table-bordered>tfoot>tr>th,
.table-bordered>thead>tr>td,
.table-bordered>thead>tr>th {
    border: 1px solid #e7e7e7;
}

.table>thead>tr>th {
    border-bottom: 1px solid #DDD;
}

.table-bordered>thead>tr>td,
.table-bordered>thead>tr>th {
    background-color: #F5F5F6;
}

#hl-tree-table>tbody>tr {
    background-color: #fbfbfb;
}

#hl-tree-table>tbody>.child-tr {
    background-color: #fff;
}

#hl-tree-table>tbody>.child-tr td:first-child {
    padding-left: 18px;
}

label {
    margin: 0 8px;
}
.action-col>button{
    margin-right: 5px;
}

.ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 14px;
    height: 14px;
}

.ms-tree-space::before {
    content: ""
}

#hl-tree-table th>label {
    margin: 0;
}
.action-col>button{
    margin-right: 5px;
}
.action-col>button:last-child{
    margin-right: 0px;
}
</style>
