<template>
    <Select v-model="modelValue"
      clearable
      @on-change="change"
      :placeholder="placeholder"
      :filterable="filterable"
      :style="style"
      v-bind="$attrs">
        <Option v-for="item in dictList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
</template>
<script>
export default {
  props: {
    model: { default: '' },
    data: { default: () => [] },
    type: { default: '' },
    placeholder: { default: '' },
    clearable: { default: true },
    filterable: { default: true }
  },
  data () {
    return {
      dictList: [],
      modelValue: ''
    }
  },
  watch: {
    model (val) {
      this.modelValue = val
    }
  },
  computed: {
    style () {
      return {
        maxWidth: '300px'
      }
    }
  },
  mounted () {
    this.modelValue = this.model
    this.getDict()
  },
  methods: {
    getDict () {
      if (this.data.length > 0) {
        this.dictList = this.data
      } else {
        this.$ajax.get('/sys/dict/' + this.type).then((res) => {
          this.dictList = res.list
        })
      }
    },
    change (value) {
      this.$emit('update:model', value)
    }
  }
}
</script>
