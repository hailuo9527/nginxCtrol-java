<template>

  <Tooltip :content="content" :placement="placement" :max-width="maxWidth" :transfer="true" theme="light" >
    <Icon class="handle" :size="size"  type="md-information-circle" :color="color"/>

  </Tooltip>
</template>
<script>
export default {
  name: 'popTip',
  props: {
    content: {
      type: String,
      default: ''
    },
    placement: {
      type: String,
      default: 'top'
    },
    color: {
      type: String,
      default: '#333'
    },
    size: {
      type: Number,
      default: 20
    },
    maxWidth: {
      type: Number,
      default: 400
    }
  }
}
</script>
<style lang="less" scoped>
  .handle{
    font-weight: bold;
    cursor: pointer;
    opacity: .2;
    transition: all .1s;
    &:hover{
      opacity: 1!important;
    }
  }
</style>
