<template>
    <div class="x-chart">
        <ve-sankey height="100%" width="100%" :data="chartData" :settings="chartSettings"
                   :loading="loading"
                   :data-empty="dataEmpty"
                   :extend="chartExtend"
                   :before-config= 'getdata'
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
                links: []
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
                    rows: []
                },
                loading: false,
                dataEmpty: false
            }
        },
        methods: {
            getdata(data) {
                console.log(data)
            },
            async getChartData (){
                let res = await appViewData({app_service_id: this.$route.params.app})
                console.log(this.chartSettings.links)
                console.log(this.chartData.rows)
                console.log(res.data.result)
                this.chartData.rows[0] = {"页面": 'requests_total', "访问量": 100000}
                this.chartData.rows[1] = {"页面": 'appdata', "访问量": 20000}
                this.chartData.rows[2] = {"页面": 'aaa', "访问量": 10000}
                this.chartData.rows[3] = {"页面": 'bbb', "访问量": 10000}
                this.chartSettings.links[0] = {source: 'requests_total', target: 'appdata'}
                this.chartSettings.links[1] = {source: 'appdata', target: 'aaa'}
                this.chartSettings.links[2] = {source: 'appdata', target: 'bbb'}
                console.log(this.chartSettings.links)
                console.log(this.chartData.rows)
                // this.chartData.rows[0]['访问量'] = res.data.result.requests_total
                // this.chartData.rows[0]['页面'] = 'appdata'
                // this.chartData.rows[0]['访问量'] = res.data.result.appdata.length
                // this.chartSettings.links[0].source = 'requests_total'
                // this.chartSettings.links[0].target = 'appdata'
            }
        },
        mounted() {
            this.getdata()
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
