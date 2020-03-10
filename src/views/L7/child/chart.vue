<template>
  <div class="x-chart" v-if="reload">
    <MyChart
            v-for="(item, index) in list"
            :key ='index'
            :data ='item'
            />
  </div>
</template>

<script>
  import MyChart from '@/components/my-chart/my-chart.vue'
  import configList from '../../L4/child/chartConfigList'
  import { mapState } from 'vuex'
  export default {
    name: "chart",
    components: {
      MyChart
    },
    data(){

      return {
        list: configList,
        loading: false,
        reload: true
      }
    },

    methods:{
      /* 更新组件 */
      updateComponent() {
        this.reload = false
        this.$nextTick(()=> {
          this.reload = true
        })
      }
    },
    computed:{
      ...mapState({
        chartFilter:  state => state.L4.chartFilter
      })
    },
    watch:{
      '$route'(val,oldVal) {
       this.updateComponent()
      },
      chartFilter() {
        this.updateComponent()
      }
    },

  }
</script>

<style scoped lang="less">
 .x-chart{
    display: flex;
    justify-content: space-between;
    padding: 107px 30px 30px 30px;
}

</style>
