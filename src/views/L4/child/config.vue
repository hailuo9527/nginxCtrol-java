<template>
    <div>
        <!--网络配置-->
        <div class="nav-content">
            <div class="form-group">
                <div class="report-section-box" >
                    <div>
                        <h4 class="report-section-box__title">
                            基础配置
                        </h4>
                        <div class="report-section-box__table">
                            <Form ref="netConfigForm" :model="netConfig" :rules="netConfigRules" :label-width="130" label-position="left">
                                <FormItem label="IP地址：" prop="L4_service_vip">
                                    <Input type="text" v-model.trim="netConfig.L4_service_vip" placeholder="请输入IP地址"></Input>
                                </FormItem>
                                <FormItem label="网关：" prop="L4_gateway">
                                    <Input type="text" v-model.trim="netConfig.L4_gateway" placeholder="请输入网关数据"></Input>
                                </FormItem>
                                <FormItem label="IP子网：" prop="L4_subnet_mask">
                                    <Input type="text" v-model.trim="netConfig.L4_subnet_mask" placeholder="请输入IP子网"></Input>
                                </FormItem>
                                <FormItem label="DNS地址：" prop="L4_dns">
                                    <Input type="text" v-model.trim="netConfig.L4_dns" placeholder="请输入DNS服务地址"></Input>
                                </FormItem>
                            </Form>

                        </div>
                    </div>

                </div>


            </div>
            <div class="form-group">
                <div class="report-section-box" >
                    <div>
                        <h4 class="report-section-box__title">
                            业务配置
                        </h4>
                        <div class="report-section-box__table">
                            <p class="tip" v-if="!serviceConfigList.length">暂无配置，请点击新建配置</p>
                            <div class="service_list" v-if="serviceConfigList.length">
                                <Table   max-height="500" :show-header="true" :columns="tableConfig" :data="serviceConfigList">
                                    <template slot-scope="{ row, index }" slot="action">

                                        <Icon type="ios-create" class=" icon modify" @click="modifyConfig(row)" size="20"/>
                                        <Poptip
                                                width="200"
                                                confirm
                                                :transfer="true"
                                                title="确定要删除此项吗?"
                                                @on-ok="removeConfig(row, index)"
                                               >
                                            <Icon type="ios-trash" class=" icon remove" size="20" />
                                        </Poptip>
                                    </template>
                                </Table>

                            </div>
                            <div class="opera">
                                <Button type="primary" @click="modal = true">
                                    <Icon type="md-add" />
                                    新建配置
                                </Button>
                            </div>
                        </div>
                    </div>
                    <!-- 新建或修改配置弹窗 -->
                    <Modal
                            v-model="modal"
                            :title="configMode?'修改配置': '新建配置'">
                        <div style="padding: 20px">
                            <Form ref="newConfigForm" :model="newConfig" :rules="newConfigRules" :label-width="100" label-position="left">
                                <FormItem label="负载均衡:"  prop="load_balance">
                                    <Select v-model="newConfig.load_balance" placeholder="请选择负载均衡算法">
                                        <Option :value="item" v-for="item in load_balance_list" :key="item">{{item}}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="服务IP：" prop="L7_server_ip">
                                    <Input type="text" v-model.trim="newConfig.L7_server_ip" placeholder="请输入交付服务器IP地址"></Input>
                                </FormItem>
                                <FormItem label="服务权重：" prop="L7_server_weight">
                                    <Input type="text" v-model.trim="newConfig.L7_server_weight" placeholder="请输入交付服务器权重"></Input>
                                </FormItem>
                                <FormItem label="会话保持：" prop="session_maintenance">
                                    <i-switch v-model="newConfig.session_maintenance" >
                                        <span slot="open">On</span>
                                        <span slot="close">Off</span>
                                    </i-switch>
                                </FormItem>
                                <FormItem label="备注：" prop="L7_remarks">
                                    <Input type="text" v-model.trim="newConfig.L7_remarks" placeholder="请输入备注，用于设置名称"></Input>
                                </FormItem>

                            </Form>
                        </div>
                        <div slot="footer">
                            <Button type="text" @click="modal=false">取消</Button>
                            <Button type="primary" :loading="addNewConfigLoading" @click="serviceConfig">确定</Button>
                        </div>
                    </Modal>
                </div>


            </div>
            <div class="save-bar">
                <Button type="primary" shape="circle" >保存</Button>
            </div>
        </div>
    </div>
</template>
<script>
    import { getDeviceConfig, serviceConfig, getServiceConfig, removeServiceConfig } from "../../../api/L4";
    import { ipaddressRules, dnsserRules, ipsubnetRules, gatewayRules } from "../../../libs/util";

    export default {
        data() {
            return {
                netConfig: {},
                netConfigRules: {
                    L4_service_vip: [
                        {validator: ipaddressRules, trigger: 'blur'}
                    ],
                    L4_dns: [
                        {validator: dnsserRules, trigger: 'blur'}
                    ],
                    L4_subnet_mask: [
                        {validator: ipsubnetRules, trigger: 'blur'}
                    ],
                    L4_gateway: [
                        {validator: gatewayRules, trigger: 'blur'}
                    ]
                },
                showPremium: false,
                modal: false, // 新建配置弹窗
                configMode: false, // 新建：false 或修改: true
                newConfig: {},
                newConfigRules: {
                    load_balance: [
                        { required: true, message: '请选择方案', trigger: 'change' }
                    ],
                    L7_server_ip: [
                        { required: true, validator: ipaddressRules, message: '交付服务器IP地址不能为空', trigger: 'blur' }
                    ],
                    L7_server_weight: [
                        { required: true, message: '交付服务器权重不能为空', trigger: 'blur' }
                    ],
                    L7_remarks: [
                        { required: true, message: '请填写备注', trigger: 'blur' }
                    ],

                },
                load_balance_list: ['方案一', '方案二', '方案三'],
                addNewConfigLoading: false,
                serviceConfigList: [], // 业务配置列表
                tableConfig: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '配置列表',
                        key: 'L7_remarks'
                    },
                    {
                        title: 'Action',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }

                ],
            }
        },
        methods: {
            /* 获取基本配置 */
            async getBaseConfig() {
                let res = await getDeviceConfig({L4_code: this.$route.params.id})
                // console.log(res)
                if (this.asyncOk(res)) {
                    this.netConfig = res.data.data
                }
            },
            /* 获取业务配置 */
            async getServiceConfig() {
                let res = await getServiceConfig({L4_code: this.$route.params.id})
                console.log(res)
                if (this.asyncOk(res)) {
                    this.serviceConfigList = res.data.data.service_conf_list || []
                    //console.log(this.serviceConfigList)
                }
            },
            /* 新建或修改配置 */

            serviceConfig () {
                this.$refs['newConfigForm'].validate((valid) => {
                    if (valid) {
                        let json = {
                            ...this.newConfig,
                            L4_code: this.$route.params.id,
                        }
                        json.session_maintenance = this.newConfig.session_maintenance ? 'on' : 'off'
                        this.addNewConfigLoading = true
                        //console.log(json)
                        let method = this.configMode ? 'put': 'post'
                        serviceConfig(method, json).then(res => {
                            // console.log(res)
                            if (this.asyncOk(res)) {
                                this.$Message.success('操作成功！')
                                this.addNewConfigLoading = false
                                this.modal = false
                                this.configMode = false
                                this.newConfig = {}
                                this.getServiceConfig()
                            } else {
                                this.addNewConfigLoading = false
                                this.$Message.error('错误'+ res.data.message)
                            }
                        })
                    }
                })
            },
            /* 删除配置 */
            async removeConfig(row, index) {
                let res = await  removeServiceConfig({L4_service_id: row.L4_service_id}).then(res => {
                    // console.log(res)
                    if (this.asyncOk(res)) {
                        this.$Message.success('操作成功！')
                        this.modal = false
                        this.serviceConfigList.splice(index, 1);
                    }
                })
            },
            /* 修改配置 */
            modifyConfig(row) {
                this.newConfig = row
                this.newConfig.session_maintenance = row.session_maintenance === 'on'
                this.modal = true
                this.configMode = true
            }
        },
        mounted() {
            this.getBaseConfig()
            this.getServiceConfig()

        }
    }
</script>
<style lang="less" scoped>
    @import "config";

</style>
