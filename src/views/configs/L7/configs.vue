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
    import { getNginxConfALL } from "../../../api/L7";

    export default {
        data () {
            return {
                tableConfig: [
                    /*{
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },*/
                    {
                        title: '配置名',
                        key: 'config_name'
                    },
                    {
                        title: 'INSTANCES',
                        key: 'instance_count'
                    },
                    {
                        title: '历史版本',
                        key: 'version_no'
                    },
                    {
                        title: '最近修改时间',
                        key: 'upd_time'
                    },
                    {
                        title: '最近修改人',
                        key: 'upd_name'
                    },
                ],
                tableData: []
            }
        },
        methods: {
            goConfigDetail(row, index){
               // console.log(row)
                this.$router.push({ name: 'nginxConfig',
                    params:{
                        configName: row.config_name,

                    },
                    query: {
                        nginx_conf_id: row.nginx_conf_id,
                        version_no: row.version_no
                    }
                } )
            },
            async getAllConfigInfo () {
                let res = await getNginxConfALL()
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
