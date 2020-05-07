<template>
  <div>
    <div class="row-item" @click="collapsed = !collapsed">
      <div class="title" :class="collapsed? 'collapsed': ''">
        <span>{{title}}</span>
        <Icon type="ios-arrow-forward" size="20" class="icon"/>
      </div>

    </div>
    <slot v-if="collapsed">

    </slot>
  </div>

</template>
<script>
  export default {
    data() {
      return{
        collapsed: false
      }
    },
    props: {
      title: String,
    }
  }
</script>
<style lang="less" scoped>
  .row-item{

    padding: 0 40px ;
    border-bottom: 1px solid #e8eaec;
    transition: all .3s;
    height: auto;
    .info-list {
      padding: 20px 0;
    }
    .list-item{
      //margin-bottom: 15px;
      padding: 10px 0;
      &:hover{
        background: rgba(47, 187, 120, 0.05);
      }
      &:last-child{
        margin-bottom: 0;
      }
    }
    .title{
      display: flex;
      justify-content: space-between;
      padding: 15px 0;
      font-weight: bolder;
      cursor: pointer;
      .icon{
        transition: all .3s;
      }
      &.collapsed{
        .icon{
          transform: rotate(90deg);
        }
      }
    }
    .status{
      padding-bottom: 15px;
      span{
        margin-left: 5px;

        font-weight: bolder;
      }
    }
  }
</style>
