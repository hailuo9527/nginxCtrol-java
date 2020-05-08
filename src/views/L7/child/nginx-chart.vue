<template>
    <div class="x-chart" v-if="reload">
        <MyChart
                v-if="activeAside.nginxVersion"
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
    import { getChartData } from "../../../api/nginx";
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
                        this.list[data.index].interval = parseInt(res.data.result.data.length / 6)
                        this.list[data.index].chartData.rows = res.data.result.data || []
                        this.list[data.index].markAreaData = res.data.result.nullListTime || []
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
                        this.$set(this.list[data.index], 'supData', this.supData)
                        let json = {
                            code: this.$route.params.L4 ? this.$route.params.L4 : this.$route.params.L7
                        }
                        /* 获取下拉菜单 */
                        this.list[data.index].loading = true
                        let res = await getSupData(this.list[data.index].supUrl, json)
                        this.list[data.index].loading = false
                        if(res.data.code === 'success') {
                            this.supData = res.data.result
                            //console.log(this.supData)
                            this.$set(this.list[data.index], 'supData', this.supData)
                            this.$set(this.list[data.index], 'supParams', this.supData[0] ? this.supData[0]: null)
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
                activeAside: state => state.L7.activeAside,
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
        mounted() {
             console.log(this.activeAside)
        }

    }
</script>

<style scoped lang="less">

    .x-chart{
        display: flex;
        justify-content: space-between;
        padding: 107px 30px 30px 30px!important;
    }

</style>
