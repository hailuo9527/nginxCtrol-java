<template>
  <div class="x-chart" v-if="reload">
    <!--<MyChart
            v-for="(item, index) in list"
            :key ='index'
            :chartData = "item.chartData"
            :loading="item.loading"
            :title="item.title"
            :chartSettings="item.chartSettings"
            v-view-lazy="(e)=>firstShow(e,index,item.url)"

            :color="item.color"/>-->
    <MyChart
            v-for="(item, index) in list"
            :key ='index'
            :data ='item'
            />
  </div>
</template>

<script>
  import MyChart from '@/components/my-chart/my-chart.vue'
  import { getChartData } from "../../../api/L4-chart";
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
      /* 第一次出现在屏幕中 */
      firstShow (e,index,url) {
        this.getData(index,url)
      },
      /* 获取cpu负载数据 */
      async getData(index, url) {
        let params = {
          l4_code: this.$route.params.id, // 'b9ce850e8874492dbd20a3a3b8e2d225'
          time: this.chartFilter.value
        }
        try {
          this.list[index].loading = true
          let res = await getChartData( url , {...params})
         // console.log(res)
          if (this.asyncOk(res)){
            this.list[index].chartData.rows = res.data.result || []
            this.list[index].loading = false
          }
        } catch (e) {
          console.log(e)
        }
      },
       /*getData(l4_code) {
         let params = {
           l4_code: l4_code, // 'b9ce850e8874492dbd20a3a3b8e2d225'
           time: this.chartFilter.value
         }
         this.loading =true
         Promise.all([
           this.getChartData('/selL4CpuLoad', params),
           this.getChartData('/selL4Netflow', params),
           this.getChartData('/selL4CurrentTotalConnect', params),
           this.getChartData('/selL4CurrentTotalConnects', params),
         ]).then(res => {
           //console.log(res)
           res.map((item, index) => {
             switch (index) {
               case 0:
                 this.$set(this.list, index , {
                   title: 'CPU 使用率%',
                   color: ['#333333','#5BA9FF',],
                   chartData: {
                     rows: item.data.result || []
                   },
                   chartSettings: {
                     metrics: ['temp'],
                     dimension: ['data'],
                     labelMap: {
                       'temp': '系统',
                     },
                   },
                   loading: false
                 })
                break
               case 1:
                 this.$set(this.list, index , {
                   title: '网络流量',
                   color: ['#f96cb3', '#030ddd'],
                   chartData: {
                     rows: item.data.result || []
                   },
                   chartSettings: {
                     metrics: ['temp'],
                     dimension: ['data'],
                     labelMap: {
                       'temp': '流量',
                     },
                   },
                   loading: false
                 })
                     break
               case 2:
                 this.$set(this.list, index , {
                   title: '应用总连接数量',
                   color: ['#ff7b7b','#ff7070'],
                   chartData: {
                     rows: item.data.result || []
                   },
                   chartSettings: {
                     metrics: ['temp'],
                     dimension: ['data'],
                     labelMap: {
                       'temp': '总连接数',
                     },
                   },
                   loading: false
                 })
                 break
               case 3:
                 this.$set(this.list, index , {
                   title: '当前每秒应用总连接数',
                   color: ['#fc9487','#59d5d0'],
                   chartData: {
                     rows: item.data.result || []
                   },
                   chartSettings: {
                     metrics: ['temp'],
                     dimension: ['data'],
                     labelMap: {
                       'temp': '每秒连接数',
                     },
                   },
                   loading: false
                 })
                 break

             }
           })



          // console.log(this.list)
           this.loading = false
         }).catch(err => {
           console.log(err)
         })
      },*/
      /* cpu负载 */
      async getChartData (url, data) {
        return  getChartData( url , data)
      },
      /* 网络 */
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
        // this.getData(this.$route.params.id)
       this.updateComponent()
      },
      chartFilter() {
        // this.getData(this.$route.params.id)
        this.updateComponent()
      }
    },
    mounted() {
      //this.getData(this.$route.params.id)
      //this.getCpuUsage()

    }
  }
</script>

<style scoped lang="less">
 @import "chart.css";
</style>
