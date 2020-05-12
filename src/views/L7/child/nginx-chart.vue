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
        <!--<div class="upload-wrap">
            <div class="upload">
                <Upload
                        multiple
                        type="drag"
                        :format="['deb','rpm']"

                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :on-error="handleError"
                        :headers="headers"
                        :action="action">
                    <div class="upload-content">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或者拖拽文件上传NGINX安装包，后缀为.deb或.rpm格式文件</p>
                    </div>
                </Upload>
            </div>

        </div>-->
        <div class="nodata" v-if="!activeAside.nginxVersion">
            未安装NGINX或自动安装失败，请手动安装NGINX
        </div>
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
                reload: true,

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
    .upload-wrap{
        width: 60%;
        margin: 0 auto;
        height: 100%;
        //align-items: center;
        display: flex;
        .upload{
            flex: 1;
            .upload-content{
                padding: 20px;
            }
        }

    }
    .nodata{
        width: 100%;
        color: #7b7e81;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
