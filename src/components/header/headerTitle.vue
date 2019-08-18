<template>
    <div v-show="titleShow">
        <h2 style="margin-left:10px;" v-if="title">{{title}}</h2>
        <p v-if="subTitle" style="margin-bottom: 4px;">{{subTitle}}</p>
    </div>
</template>

<script>
export default {
    props: {
        title: {default: ''},
        subTitle: {default: ''}
    },
    data () {
      return {
        titleShow: true
      }
    }
};
</script>
