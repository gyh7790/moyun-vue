<template>
    <div>
        <Card style="margin-bottom:5px;">
          <!-- 表单 -->
          <Form ref="form" label-position="top" :model="form" inline>
              <FormItem label="表名" prop="name">
                <Input v-model="form.name" placeholder="name" disabled/>
              </FormItem>
              <FormItem label="说明" prop="comments">
                <Input v-model="form.comments" placeholder="comments"/>
              </FormItem>
              <FormItem label="类名" prop="className">
                <Input v-model="form.className" placeholder="className"/>
              </FormItem>
              <FormItem label="父表表名" prop="parentTable">
                <Select v-model="form.parentTable"  style="width:200px" filterable>
                    <Option v-for="item in tableSelet" style="width:200px" :value="item.name" :key="item.name">{{ item.name }} &nbsp;&nbsp;:&nbsp;&nbsp;{{ item.comments }}</Option>
                </Select>
              </FormItem>
              <FormItem label="当前表外键" prop="parentTableFk">
                <Select v-model="form.parentTableFk" style="width:200px" filterable>
                    <Option v-for="item in form.columns" style="width:200px" :value="item.name" :key="item.name">{{ item.name }} &nbsp;&nbsp;:&nbsp;&nbsp;{{ item.comments }}</Option>
                </Select>
              </FormItem>
              <div v-if="form.id">
                <FormItem label="修改">
                  <Button style="margin-right:5px;" type="warning" :loading="loading" @click="saveSubmit" icon="ios-redo"></Button>
                </FormItem>
              </div>
              <div v-else>
                <FormItem label="保存">
                  <Button type="primary" @click="saveSubmit" :loading="loading" icon="ios-redo"></Button>
                </FormItem>
              </div>
          </Form>
        </Card>
        <Table style="overflow:initial;" :columns="columns" :data="form.columns">
          <!-- 表名 -->
          <template slot-scope="{ row,index }" slot="comments">
            <Input type="text" v-model="form.columns[index].comments" />
          </template>
          <!-- java类型 -->
          <template slot-scope="{ row,index }" slot="javaType">
            <Select v-model="form.columns[index].javaType" style="width:90px;">
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <!-- <JavaTypeSelect v-bind="row.javaType"></JavaTypeSelect> -->
          </template>
          <!-- java属性 -->
          <template slot-scope="{ row,index }" slot="javaAttr">
            <Input type="text" v-model="form.columns[index].javaAttr" />
          </template>
          <!-- 是否可为空 -->
          <template slot-scope="{ row,index }" slot="isNull">
            <i-switch disabled v-model="form.columns[index].isNull" :true-value="'1'" :false-value="'0'"/>
          </template>
          <!-- 主键 -->
          <template slot-scope="{ row,index }" slot="isPk">
            <i-switch disabled v-model="form.columns[index].isPk" :true-value="'1'" :false-value="'0'"/>
          </template>
          <!-- 插入 -->
          <template slot-scope="{ row,index }" slot="isInsert">
            <i-switch v-model="form.columns[index].isInsert" :true-value="'1'" :false-value="'0'"/>
          </template>
          <!-- 编辑 -->
          <template slot-scope="{ row,index }" slot="isEdit">
            <i-switch v-model="form.columns[index].isEdit" :true-value="'1'" :false-value="'0'"/>
          </template>
          <!-- 列表 -->
          <template slot-scope="{ row,index }" slot="isList">
            <i-switch v-model="form.columns[index].isList" :true-value="'1'" :false-value="'0'"/>
          </template>
          <!-- 查询 -->
          <template slot-scope="{ row,index }" slot="isQuery">
            <i-switch v-model="form.columns[index].isQuery" :true-value="'1'" :false-value="'0'"/>
          </template>
          <!-- 查询 -->
          <template slot-scope="{ row,index }" slot="queryType">
            <Select v-model="form.columns[index].queryType" clearable  style="width:90px;">
              <Option v-for="item in queryList" :value="item.value" :key="item.value">{{ item.value }}</Option>
            </Select>
          </template>
        </Table>
    </div>
</template>
<script>
export default {
  props: {
    rows: Object,
    tableSelet: Array
  },
  data () {
    return {
      rowName: this.rows,
      loading: false,
      form: {
        id: this.rows.id,
        name: this.rows.name,
        comments: this.rows.comments,
        className: this.rows.className,
        parentTable: '',
        parentTableFk: '',
        columns: []
      },
      typeList: [
        {
          value: 'String',
          label: 'String'
        },
        {
          value: 'Integer',
          label: 'Integer'
        },
        {
          value: 'Long',
          label: 'Long'
        },
        {
          value: 'Double',
          label: 'Double'
        },
        {
          value: 'Float',
          label: 'Float'
        },
        {
          value: 'Date',
          label: 'Date'
        },
        {
          value: 'Boolean',
          label: 'Boolean'
        },
        {
          value: 'User',
          label: 'User'
        }
      ],
      queryList: [
        {
          value: '='
        },
        {
          value: '!='
        },
        {
          value: '>'
        },
        {
          value: '>='
        },
        {
          value: '<'
        },
        {
          value: '<='
        },
        {
          value: 'like'
        },
        {
          value: 'right like'
        },
        {
          value: 'left like'
        }
      ],
      columns: [
        {
          title: '列名',
          key: 'name',
          width: 125,
          fixed: 'left'
        },
        {
          title: '描述',
          slot: 'comments',
          width: 125,
          fixed: 'left'
        },
        {
          title: '类型',
          key: 'jdbcType',
          width: 125
        },
        {
          title: 'java类型',
          slot: 'javaType',
          width: 125
        },
        {
          title: 'java属性',
          slot: 'javaAttr',
          width: 150
        },
        {
          title: '主键',
          slot: 'isPk',
          width: 80
        },
        {
          title: '可空',
          slot: 'isNull',
          width: 80
        },
        {
          title: '插入',
          slot: 'isInsert',
          width: 80
        },
        {
          title: '编辑',
          slot: 'isEdit',
          width: 80
        },
        {
          title: '列表',
          slot: 'isList',
          width: 80
        },
        {
          title: '查询',
          slot: 'isQuery',
          width: 80
        },
        {
          title: 'queryType',
          slot: 'queryType',
          width: 125
        },
        {
          title: 'sort',
          key: 'sort',
          width: 70
        }
      ]
    }
  },
  mounted () {
    this.$ajax.get('/sys/gen/table/column?name=' + this.rowName.name).then((res) => {
      this.form = res.data
    })
  },
  methods: {
    saveSubmit () {
      this.loading = true
      this.$ajax.post('/sys/gen/table/save', {
        genTable: this.form
      }).then((res) => {
        if (!this.rowName.id) {
          this.$emit('getID', res.data)
        }
        this.form = res.data
        this.$Message.success('保存成功')
      })
      this.loading = false
    }
  }
}
</script>
