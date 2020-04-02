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
  import { getChartData, getSupData } from "../../../api/chart";
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
        reload: true,
          supData: [],
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
        async getChartData(data) {
            let params = {
                //code: this.$route.params.L4 ,
                code: this.$route.params.L4 ? this.$route.params.L4 : this.$route.params.L7,
                startTime: this.chartFilter.key === 5 ? this.chartFilter.value[0]: '',
                endTime: this.chartFilter.key === 5? this.chartFilter.value[1]: '',
                time: this.chartFilter.key<5 ? this.chartFilter.value : '',
                label : data.supParams ? data.supParams : this.supData[0]
            }

            try {
                this.list[data.index].loading = true
                //console.log(this.supData)
                let res = await getChartData( data.url , {...params})
                //console.log(res)
                if (this.asyncOk(res)){
                    this.list[data.index].interval = parseInt(res.data.result.length / 6)
                    this.list[data.index].chartData.rows = res.data.result || []
                    this.list[data.index].loading = false
                    //console.log(this.list[data.index].interval)
                }
            } catch (e) {
                // console.log('rewr')
            }
        },
       async getData(data) {
          if (data.supParams){
              /*  切换参数， 重新执行 */
              this.getChartData(data)
          }else {
              /* 首次执行 */
              //console.log('首次执行')
              if (this.list[data.index].supUrl ){
                  let json = {
                      code: this.$route.params.L4 ? this.$route.params.L4 : this.$route.params.L7
                  }
                  let res = await getSupData(this.list[data.index].supUrl, json)
                  console.log(res)
                  if(res.data.code === 'success') {
                      this.supData = res.data.result.length ? res.data.result : null
                      this.$set(this.list[data.index], 'supData', this.supData)
                      if (res.data.result.length){
                          this.getChartData(data)
                      }

                  }


              }else {
                  this.getChartData(data)
              }
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
