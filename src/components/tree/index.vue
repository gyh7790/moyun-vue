<template>
  <div>
    <i-input v-show="search" id="key" v-model="keywords" placeholder="搜索..."></i-input>
    <ul ref="tree" class="ztree" style="overflow: auto;" :style="{maxHeight: `${maxHeight}px`}"></ul>
  </div>
</template>

<script>
import $ from '@/utils/jquery.js'
import '@/plugins/ztree/ztree.js'
export default {
  props: {
    // 数据
    treeData: { default: () => [] },
    search: { default: true },
    maxHeight: { default: 400 },
    searchKeyName: { default: 'name' },

    // 简单 json 数据类型
    simpleData: { default: true },
    idKey: { default: 'id' },
    pIdKey: { default: 'pId' },
    rootPId: { default: 0 },

    checkEnable: { default: false },
    chkboxTypeY: { default: 'ps' },
    chkboxTypeN: { default: 'ps' },
    chkStyle: { default: 'checkbox' },
    radioType: { default: 'radioType' },
    initAfterSync: { default: true }, // 是否直接 初始化(默认为false)
    isHighLight: { default: false },
    isExpand: { default: true }
  },
  data () {
    return {
      keywords: '',
      tree: {
        data: [],
        obj: null,
        expand: {}
      }
    }
  },
  watch: {
    treeData (value) {
      this.tree.data = this.treeData
      this.syncTreeData()
      // if (this.dataMode === 'data') {
      //   // 只有在 dataMode = data 的时候才有效 (外部提供数据源)
      //   this.syncTreeData()
      //   if (this.tree.obj) {
      //       this.tree.obj.refresh()
      //       if (this.tree.expand) {
      //           const node = this.tree.obj.getNodesByFilter(n => n.id === this.tree.expand)
      //           if (node.length > 0) {
      //               this.tree.obj.expandNode(node[0])
      //           }
      //       }
      //   }
      // }
    },
    keywords () {
      this.searchNodes(this.keywords)
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
          }
        },
        async: {
          enable: true
        },
        check: {
          enable: this.checkEnable,
          chkboxType: { Y: this.chkboxTypeY, N: this.chkboxTypeN },
          chkStyle: this.chkStyle,
          radioType: this.radioType
        },
        callback: {
          beforeCheck: (event, treeId, treeNode) => { console.log('点击beforeCheck') },
          onClick: (event, treeId, treeNode) => { this.$emit('ztClick', event, treeId, treeNode) },
          onExpand: (event, treeId, treeNode) => { this.tree.expand = treeNode.id }
        }
      }
    }
  },
  mounted () {
    this.syncTreeData()
  },
  methods: {
    init () {
      // 初始化树
      if (this.tree.obj) {
        console.log('执行删除tree')
        this.destroy()
      }
      this.tree.obj = $.fn.zTree.init($(this.$refs.tree), this.treeSetting, this.tree.data)
    },
    syncTreeData () {
      this.tree.data = this.treeData
      console.log(this.tree)
      // 判断是否需要立即初始化
      if (this.initAfterSync) {
        this.init()
      }
    },
    // 回显
    checkNode () {
      if (this.tree.obj) {
        this.checked.forEach(e => {
          let node = this.tree.obj.getNodeByParam('id', e)
          if (node) {
            if (this.check) {
              this.tree.obj.checkNode(node, true, false)
            } else {
              this.tree.obj.selectNode(node, true, false)
            }
          }
        })
      }
    },
    searchNodes (keywords) {
      if (this.tree.obj === null) {
        return
      }
      // 隐藏节点
      let hideAllNode = nodes => {
        const nodesArray = this.tree.obj.transformToArray(nodes)
        nodesArray.forEach(e => {
          this.tree.obj.hideNode(e)
        })
      }
      const nodes = this.tree.obj.getNodes()
      hideAllNode(nodes)

      // 更新节点状态
      const updateNodes = nodeList => {
        this.tree.obj.showNodes(nodeList)
        nodeList.forEach(e => {
          // 展开当前节点的父节点
          this.tree.obj.showNode(e.getParentNode())
          // this.tree.obj.expandNode(nodeList[i].getParentNode(), true, false, false)
          // 显示展开符合条件节点的父节点
          while (e.getParentNode() != null) {
            this.tree.obj.expandNode(e.getParentNode(), true, false, false)
            e = e.getParentNode()
            this.tree.obj.showNode(e.getParentNode())
          }
          // 显示根节点
          this.tree.obj.showNode(e.getParentNode())
          // 展开根节点
          this.tree.obj.expandNode(e.getParentNode(), true, false, false)
        })
      }
      var nodesShow = this.tree.obj.getNodesByParamFuzzy(this.searchKeyName, this.keywords)
      updateNodes(nodesShow)
    },
    destroy () {
      // 销毁树
      if (this.tree.obj) {
        this.tree.obj.destroy()
        this.tree.obj = null
      }
    }
  }
}
</script>
