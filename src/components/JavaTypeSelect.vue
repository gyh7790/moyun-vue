<template>
  <Select v-model="javaType" style="width:90px;">
    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
  </Select>
</template>
<script>
export default {
  props: {
    javaType: String
  },
  data () {
    return {
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
        }
      ]
    }
  }
}
</script>
