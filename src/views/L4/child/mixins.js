import MyChart from '@/components/my-chart/my-chart.vue'
import { getChartData } from "../../../api/chart";
import { mapState } from 'vuex'
export default {
    components: {
        MyChart
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
            }

            if (this.list[data.index].supUrl){
                if (data.supParams){
                    params.label = data.supParams
                }else if (this.supData[0]){
                    params.label = this.supData[0]
                } else {
                    this.list[data.index].chartData.rows = []
                    return
                }
            }

            try {
                this.list[data.index].loading = true
                let res = await getChartData( data.url , {...params})
                if (this.asyncOk(res)){
                    this.list[data.index].interval = parseInt(res.data.result.length / 6)
                    this.list[data.index].chartData.rows = res.data.result || []
                    this.list[data.index].loading = false

                }
            } catch (e) {

            }
        },
        async getData(data) {
            if (data.supParams){
                /*  切换参数， 重新执行 */
                this.getChartData(data)
            }else {
                /* 首次执行 */
                if (this.list[data.index].supUrl ){
                    /* 有supUrl */
                    this.supData = [] //清空图表下拉菜单
                    let json = {
                        code: this.$route.params.L4 ? this.$route.params.L4 : this.$route.params.L7
                    }
                    this.list[data.index].loading = true
                    let res = await getSupData(this.list[data.index].supUrl, json)
                    this.list[data.index].loading = false
                    if(res.data.code === 'success') {
                        this.supData = res.data.result
                        this.$set(this.list[data.index], 'supData', this.supData)
                        this.getChartData(data)
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
