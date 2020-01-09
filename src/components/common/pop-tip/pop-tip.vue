<template>
  <!--<Poptip word-wrap width="200" trigger="hover" :content="content">
    <Icon style="font-weight: bold;" size="14" color="" type="ios-help-circle-outline" />
  </Poptip>-->
  <Tooltip :content="content" :placement="placement" max-width="200" theme="light" >
    <Icon class="handle" size="18"  type="md-information-circle" :color="color"/>
    
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
      default: '#d8d8d8'
    }
  }
}
</script>
<style lang="less" scoped>
  .handle{
    font-weight: bold;
    cursor: pointer;
    transition: all .3s;
    &:hover{
      color: #333;
    }
  }
</style>
