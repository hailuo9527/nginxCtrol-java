<template>
    <div class="config-list">
        <div class="config_header">
            <span class="config_title">Configurations</span>
            <Button type="primary" size="large" icon="md-add" @click="$router.push('/newNginxConfig')">新建配置</Button>

        </div>
        <div class="config_table_wrapper">
            <Table :columns="tableConfig" @on-row-click="goConfigDetail" :data="tableData"></Table>
        </div>

    </div>
</template>
<script>
    import { getAllConfigInfo } from "../../../api/L7";

    export default {
        data () {
            return {
                tableConfig: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '配置名',
                        key: 'config_name'
                    },
                    {
                        title: 'INSTANCES',
                        key: 'config_name'
                    },
                    {
                        title: '历史版本',
                        key: 'config_name'
                    },
                    {
                        title: '最近修改时间',
                        key: 'config_name'
                    },
                    {
                        title: '最近修改人',
                        key: 'address'
                    },
                ],
                tableData: []
            }
        },
        methods: {
            goConfigDetail(row, index){
               // console.log(row)
                this.$router.push({ name: 'nginxConfig', params:{ configId: row.config_name}} )
            },
            async getAllConfigInfo () {
                let res = await getAllConfigInfo()
                //console.log(res)
                if (this.asyncOk(res)) {
                    this.tableData = res.data.result || []
                }
            }
        },
        mounted() {
            this.getAllConfigInfo()

        }


    }
</script>
<style lang="less">
    .config-list{
        max-width: 1080px;
        height: 100%;
        margin: 0 auto;
        background: #f8f8f8;
        .config_header{
            display: flex;
            justify-content: space-between;
            padding: 18px 40px;
            border-bottom: 1px solid #d8d8d8;
            margin: 0 0 20px;
            .config_title{
                font-size: 22px;
                font-weight: bold;
                margin-top: 10px;
            }

        }
        .config_table_wrapper{
            height: calc(100% - 160px);
            overflow-y: auto;
            padding: 0 40px;
        }
    }
</style>
