export default {
  data: () => {
    return {
      page: {
        pageNo: 1,
        total: 0,
        size: 20
      }
    }
  },
  methods: {
    // 页码变化
    pageChangeHandler (index) {
      this.page.pageNo = index
      this.syncTableData()
    },
    pageSizeChangeHandler (size) {
      this.page.size = size
      this.syncTableData()
    }
  }
}
