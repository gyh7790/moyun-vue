<template>
    <Page
        :total="total"
        :page-size="pageSize"
        :page-no="pageNo"
        size="small"
        show-total
        show-elevator
        show-sizer
        :page-size-opts="sizeOpts"
        class="margin-top-10"
        @on-change="handleChange"
        @on-page-size-change="handlePageSizeChange"
        style="margin-top: 10px;"
        :transfer="true">
    </Page>
</template>

<script>
export default {
  props: {
    pageNo: {
      default: 1
    },
    total: {
      default: 0
    },
    pageSize: {
      default: 0
    }
  },
  computed: {
    sizeOpts () {
      return [
        10,
        40,
        100,
        this.total
      ]
    }
  },
  methods: {
    handleChange (id) {
      this.$emit('change', id)
    },
    handlePageSizeChange (size) {
      this.$emit('change-page-size', size)
    }
  }
}
</script>
