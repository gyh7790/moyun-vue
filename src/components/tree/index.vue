<template>
    <div>
        <i-input v-show="search" v-model="searchText" placeholder="搜索..."></i-input>
        <ul ref="tree" class="ztree" style="overflow: auto;"></ul>
    </div>
</template>


<script>
import $ from '@/utils/jquery.js'
import '@/plugins/ztree/ztree.js'
export default {
  props: {

    // 数据
    treeData: { default: () => [] },
    search: {default: true},

    // 简单 json 数据类型
    simpleData: {default: true},
    idKey: {default: 'id'},
    pIdKey: {default: 'pId'},
    rootPId: { default: 0 },
    chkboxTypeY: {default: 'ps'},
    chkboxTypeN: {default: 'ps'},
    chkStyle: {default: 'checkbox'}

  },
  data () {
    return {
      searchText: '',
      tree: {
        data: this.treeData,
        obj: null
      }
    }
  },
  watch: {
    treeData () {
      this.tree.data = this.treeData
    }
  },
  computed: {
    treeSetting () {
      return {
        data: {
          simpleData: {
            enable: this.simpleData,
            idKey: this.idKey,
            pIdKey: this.pIdKey,
            rootPId: this.rootPId
          },
          callback: {
            onClick: (event, treeId, treeNode) => { this.$emit('ztClick', event, treeId, treeNode) },
          },
          check: {
            enable: true,
            nocheckInherit: true,
            chkboxType: { Y: this.chkboxTypeY, N: this.chkboxTypeN },
            chkStyle: this.chkStyle,
            radioType: "all"
          }
        }
      }
    }
  },
  mounted () {
    this.treeInit()
  },
  methods: {
    zTreeOnClick () {
      console.log('测试Ztree单击')
    },
    treeInit () {
      this.tree.obj = $.fn.zTree.init($(this.$refs.tree), this.treeSetting, this.tree.data)
    }
  }
}
</script>
