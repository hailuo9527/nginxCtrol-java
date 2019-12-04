<template>
  <div class="x-chart">
    <MyChart :chartData="chartData" :loading="loading" title="CPU 使用率%" :color="['#333333','#5BA9FF']"/>
  </div>
</template>

<script>
  import MyChart from '@/components/my-chart/my-chart.vue'
  import { getCpuUsage } from "../../../api/L4-chart";

  export default {
    name: "chart",
    components: {
      MyChart
    },
    data(){

      return {
        chartData:  {
          'columns': ['日期', '访问用户', '下单用户',],
          'rows': [
            { '日期': '1/1', '访问用户': 1393, '下单用户': 1093,  },
            { '日期': '1/2', '访问用户': 3530, '下单用户': 3230,  },
            { '日期': '1/3', '访问用户': 2923, '下单用户': 2623,  },
            { '日期': '1/4', '访问用户': 1723, '下单用户': 1423,  },
            { '日期': '1/5', '访问用户': 3792, '下单用户': 3492,  },
            { '日期': '1/6', '访问用户': 4593, '下单用户': 4293,  }
          ],
        },
        loading: false,
    }
    },
    methods:{
      /* 获取cpu负载数据 */
       getData(L4_code) {
         this.loading =true
        let p1 = getCpuUsage({L4_code: L4_code, type: 1})
         Promise.all([p1]).then(res => {
           console.log(res)
           this.loading = false
         }).catch(err => {
           console.log(err)
         })
      }
    },
    computed:{

    },
    watch:{
      '$route'(val,oldVal) {
        this.getData(this.$route.params.id)
      }
    },
    mounted() {
      this.getData(this.$route.params.id)
      //this.getCpuUsage()
    }
  }
</script>

<style scoped lang="less">
 @import "chart.css";
</style>
