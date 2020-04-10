<template>
    <div class="x-chart">
        <ve-sankey height="100%" width="100%" :data="chartData" :settings="chartSettings"
                   :loading="loading"
                   :data-empty="dataEmpty"
                   :extend="chartExtend"
        ></ve-sankey>
    </div>
</template>
<script>
    import veSankey from 'v-charts/lib/sankey.common'
    import { appViewData } from "../../../api/app";
    import 'v-charts/lib/style.css'
    export default {
        name: 'overView',
        components: {
            veSankey
        },
        data () {
            this.chartSettings = {
                links: [
                    { source: '首页', target: '列表页a',  },
                    { source: '首页', target: '列表页b', },
                    { source: '列表页a', target: '内容页a-1',  },
                    { source: '列表页a', target: '内容页a-2',  },
                    { source: '列表页b', target: '内容页b-1',},
                    { source: '列表页b', target: '内容页b-2', }
                ]
            }
            this.chartExtend = {
                series: {
                    type: 'sankey',
                    focusNodeAdjacency: true,
                }
            }
            return {
                chartData: {
                    columns: ['页面', '访问量'],
                    rows: [
                        { '页面': '首页', '访问量': 100000 },
                        { '页面': '列表页a', '访问量': 40000 },
                        { '页面': '列表页b', '访问量': 60000 },
                        { '页面': '内容页a-1', '访问量': 30000 },
                        { '页面': '内容页a-2', '访问量': 10000 },
                        { '页面': '内容页b-1', '访问量': 40000 },
                        { '页面': '内容页b-2', '访问量': 20000 }
                    ]
                },
                loading: false,
                dataEmpty: false
            }
        },
        methods: {
            async getChartData (){
                let res = await appViewData({app_service_id: this.$route.params.app})
                console.log(res)
            }
        },
        mounted() {
            this.getChartData()
        }
    }
</script>
<style lang="less" scoped>
    .x-chart{
        display: flex;
        justify-content: space-between;
        padding: 107px 30px 30px 30px!important;
    }
</style>
