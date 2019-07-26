<template>
<zTree ref="ztrea" :search="true" :treeData="deptList" @ztClick="getDeptRole"></zTree>
</template>
<script>
    export default {
        data () {
            return {
              deptList: []
            }
        },
        mounted () {
          this.getDept()
        },
        methods: {
          getDept () {
            this.$ajax.get('/sys/dept/list').then((res) => {
              let deptmap = res.list.map(e => ({
                id: e.id,
                pId: e.parentId,
                name: e.name
              }))
              this.deptList = deptmap
            })
          }
        }
    }
</script>