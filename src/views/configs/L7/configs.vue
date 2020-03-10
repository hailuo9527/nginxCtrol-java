<template>
    <div class="config-list">
        <div class="config_header">
            <span class="config_title">Configurations</span>
            <Button type="primary" size="large" icon="md-add" @click="$router.push('/newNginxConfig')">新建配置</Button>

        </div>
        <div class="config_table_wrapper">
            <Table :columns="tableConfig" :loading="loading" @on-row-click="goConfigDetail" :data="tableData">
                <template slot-scope="{ row, index }" slot="action">
                    <!--<Button type="error" size="small" @click="remove(index)">删除</Button>-->
                    <Icon type="md-trash" size="22" style="cursor: pointer" @click.stop="remove(row.nginx_conf_id, index)"/>
                </template>
            </Table>
        </div>

    </div>
</template>
<script>
    import { getNginxConfALL, delNginxConf } from "../../../api/L7";

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
                    {
                        title: '操作',
                        slot: 'action'
                    }
                ],
                tableData: [],
                loading: true
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
                    this.loading = false
                    this.tableData = res.data.result || []
                }
            },
            /* 删除配置 */
             remove(id,index) {
                 this.$Modal.confirm({
                     title: '提示',
                     content: '<p>是否确定要删除此配置</p>',
                     onOk: async () => {
                         let res = await delNginxConf({ nginx_conf_id: id })
                         if (this.asyncOk(res)){
                             this.$Message.success({
                                 content: '删除成功',
                                 duration: 2
                             });
                             this.tableData.splice(index, 1)
                         } else {
                             this.$Message.error({
                                 content: res.data.result,
                                 duration: 3
                             });
                         }
                     },
                     onCancel: () => {
                         //this.$Message.info('Clicked cancel');
                     }
                 });
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
