<template>
    <div class="config-list">
        <div class="config_header">
            <span class="config_title">Configurations</span>
            <div>
                <Button type="info" size="large" icon="md-cloud-upload" @click="openModal()">导入配置文件</Button>
                <Button type="primary" size="large" icon="md-add" @click="$router.push('/newNginxConfig')" style="margin-left: 10px">新建配置</Button>
            </div>

        </div>
        <div class="config_table_wrapper">
            <Table :columns="tableConfig" :loading="loading" @on-row-click="goConfigDetail" :data="tableData">
                <template slot-scope="{ row, index }" slot="action">
                    <!--<Button type="error" size="small" @click="remove(index)">删除</Button>-->
                    <Icon type="md-trash" size="22" style="cursor: pointer" @click.stop="remove(row.nginx_conf_id, index)"/>
                </template>
            </Table>
        </div>
        <Modal v-model="importModal" title="导入配置文件" :mask-closable="false" width="40">
            <Form ref="formInline" :model="formInline" :rules="ruleInline">
                <FormItem prop="inputValue" label="配置文件名称">
                    <Input type="text" v-model="formInline.inputValue" placeholder="配置文件名称"></Input>
                </FormItem>
            </Form>
            <div>
                <span style="display: block; float: left; line-height: 32px; margin-right: 10px;">文件导入</span>
                <Upload
                    :before-upload="handleUpload"
                    action="/url">
                    <Button icon="ios-cloud-upload-outline">导入文件</Button>
                </Upload>
            </div>
            <div v-if="file !== null" class="file-content"><span>{{ file.name }}</span><Icon type="md-close" class="close-icon" @click="close()"/></div>
            <div class="footer" slot="footer">
                <Button @click="cancel()">取消</Button>
                <Button type="primary" @click="upload()" :loading="loadingStatus">{{loadingStatus?'导入中...':'导入'}}</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import { getNginxConfALL, delNginxConf, uploadNgConf } from "../../../api/L7";

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
                        title: 'APP',
                        key: 'app_count'
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
                loading: true,
                importModal: false,
                formInline: {
                    inputValue: ''
                },
                ruleInline: {
                    inputValue: [
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ]
                },
                file: null,
                loadingStatus: false
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
            },
            openModal() {
                this.importModal = true
                this.formInline.inputValue = ''
            },
            cancel() {
                this.importModal = false
            },
            //绑定 before-upload，并返回false，可以阻止默认上传流程，手动控制文件上传。
            handleUpload (file) {
                this.file = file;
                return false;
            },
            //导入配置文件
            async upload() {
                this.$refs.formInline.validate( async (valid) => {
                    if (valid) {
                        if (this.file !== null) {
                            this.loadingStatus = true
                            let file = new FormData();
                            file.append("file", this.file);
                            let res = await uploadNgConf(file, {config_name: this.formInline.inputValue}) 
                                if (res.data.code === '200') {
                                    this.loadingStatus = false;
                                    this.importModal = false
                                    this.$Message.success({content: "文件 " + this.file.name + "导入成功！", duration: 3});
                                    this.file = null;
                                    this.getAllConfigInfo()
                                } else {
                                    this.loadingStatus = false;
                                    this.$Message.error({
                                       content: "文件 " + this.file.name + "导入失败！" + res.data.result, duration: 3
                                    });
                                    this.file = null;
                                }                   
                        } else {
                            this.$Message.error({content: '请选择一份配置文件', duration: 3});
                        }
                    } else {
                        this.$Message.error({content:'请输入配置文件名称', duration: 3});
                    }
                })
            },
            close() {
                this.file = null;
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
    .file-content {
        padding: 10px;
        background-color: #f3f3f3;
        span {
            color: #01c864;
            font-size: 16px;
        }
        .close-icon {
            cursor: pointer;
            float: right;
            margin-top: 4px;
            font-size: 20px;
            opacity: 0.5;
            &:hover {
                opacity: 1;
            }
        }
    }
</style>
