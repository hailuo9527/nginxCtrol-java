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

        async getData(data) {
            let params = {
                //code: this.$route.params.L4 ,
                code: this.$route.params.L4 ? this.$route.params.L4 : this.$route.params.L7,
                startTime: this.chartFilter.key === 5 ? this.chartFilter.value[0]: '',
                endTime: this.chartFilter.key === 5? this.chartFilter.value[1]: '',
                time: this.chartFilter.key<5 ? this.chartFilter.value : ''

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
