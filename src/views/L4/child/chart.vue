<template>
  <div class="x-chart" v-if="reload">
    <MyChart
            v-for="(item, index) in list"
            :key ='index'
            :data ='item'
            :index = 'index'
            @firstShowHandle= 'getData'
            />
  </div>
</template>

<script>
  import MyChart from '@/components/my-chart/my-chart.vue'
  import { getChartData } from "../../../api/chart";
  import configList from './chartConfigList'
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
      },

       async getData(data) {
        let params = {
          //code: this.$route.params.L4 ,
          code: this.$route.params.L4 ? this.$route.params.L4 : this.$route.params.L7,
          // startTime: '2019-11-23 09:39:42',
          // endTime: '2019-12-29 09:39:42'
            time: this.chartFilter.value

        }
        try {
          this.list[data.index].loading = true
          let res = await getChartData( data.url , {...params})
            //console.log(res)
          if (this.asyncOk(res)){
              this.list[data.index].interval = parseInt(res.data.result.length / 6)
              this.list[data.index].chartData.rows = res.data.result || []
              this.list[data.index].loading = false

             // console.log(this.list[data.index].interval)
          }
        } catch (e) {
          console.log(e)
        }
      },
    },
    computed:{
      ...mapState({
        chartFilter:  state => state.common.chartFilter
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
    padding: 107px 30px 30px 30px!important;
}

</style>
