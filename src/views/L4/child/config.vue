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
                                <FormItem label="IP地址：" prop="l4_ipaddr">
                                    <Input type="text" v-model.trim="netConfig.l4_ipaddr" placeholder="请输入IP地址"></Input>
                                </FormItem>
                                <FormItem label="网关：" prop="l4_gateway">
                                    <Input type="text" v-model.trim="netConfig.l4_gateway" placeholder="请输入网关数据"></Input>
                                </FormItem>
                                <FormItem label="IP子网：" prop="l4_subnet_mask">
                                    <Input type="text" v-model.trim="netConfig.l4_subnet_mask" placeholder="请输入IP子网"></Input>
                                </FormItem>
                                <FormItem label="DNS地址：" prop="l4_dns">
                                    <Input type="text" v-model.trim="netConfig.l4_dns" placeholder="请输入DNS服务地址"></Input>
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
                                <Table :loading="loading3"
                                       max-height="500"
                                       :show-header="true"
                                       :columns="tableConfig"
                                       @on-selection-change="selectedConfigs"
                                       :data="serviceConfigList">
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
                            :title="configMode?'修改配置': '新建配置'" :mask-closable="false">
                        <div style="padding: 20px">
                            <Form ref="newConfigForm" :model="newConfig" :rules="newConfigRules" :label-width="100" label-position="left">
                                <FormItem label="负载均衡:"  prop="load_balance">
                                    <Select v-model="newConfig.load_balance" placeholder="请选择负载均衡算法">
                                        <Option :value="item" v-for="item in load_balance_list" :key="item">{{item}}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="服务IP：" prop="l7_server_ip">
                                    <Input type="text" v-model.trim="newConfig.l7_server_ip" placeholder="请输入交付服务器IP地址"></Input>
                                </FormItem>
                                <FormItem label="服务权重：" prop="l7_server_weight">
                                    <Input type="text" v-model.trim="newConfig.l7_server_weight" placeholder="请输入交付服务器权重"></Input>
                                </FormItem>
                                <FormItem label="会话保持：" prop="session_maintenance">
                                    <i-switch v-model="newConfig.session_maintenance" >
                                        <span slot="open">On</span>
                                        <span slot="close">Off</span>
                                    </i-switch>
                                </FormItem>
                                <FormItem label="备注：" prop="l7_remarks">
                                    <Input type="text" v-model.trim="newConfig.l7_remarks" placeholder="请输入备注，用于设置名称"></Input>
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
                <Button type="primary" :loading="loading2" shape="circle" @click="saveChange">保存</Button>
            </div>
        </div>
    </div>
</template>
<script>
    import { selServerConfig, serviceConfig, getDeviceConfig, modifyDeviceConfig, delServerConfig, uptServerConfigStatus } from "../../../api/L4";
    import { ipaddressRules, dnsserRules, ipsubnetRules, gatewayRules } from "../../../libs/util";

    export default {
        data() {
            return {
                netConfig: {},
                netConfigRules: {
                    l4_ipaddr: [
                       // {validator: ipaddressRules, trigger: 'blur'}
                    ],
                    l4_dns: [
                      //  {validator: dnsserRules, trigger: 'blur'}
                    ],
                    l4_subnet_mask: [
                      //  {validator: ipsubnetRules, trigger: 'blur'}
                    ],
                    l4_gateway: [
                      //  {validator: gatewayRules, trigger: 'blur'}
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
                    l7_server_ip: [
                        { required: true, validator: ipaddressRules,  trigger: 'blur' }
                    ],
                    l7_server_weight: [
                        { required: true, message: '交付服务器权重不能为空', trigger: 'blur' }
                    ],
                    l7_remarks: [
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
                        key: 'l7_remarks'
                    },
                    {
                        title: 'Action',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }

                ],
                loading2: false, // 保存
                loading3: false, // 加载业务配置
                selection: [], // 已选中的业务配置
            }
        },
        methods: {
            /* 获取基本配置 */
            async getBaseConfig() {
                let res = await getDeviceConfig({l4_code: this.$route.params.id})
                // console.log(res)
                if (this.asyncOk(res)) {
                    this.netConfig = res.data.result
                }
            },
           /* /!* 修改基础配置 *!/
            async changeBaseConfig() {
                let json = {
                    ...this.netConfig,
                    l4_code: this.$route.params.id
                }
                let res = await modifyDeviceConfig(json)
                //console.log(res)
                if (this.asyncOk(res)) {
                    this.$Message.success('保存成功!')
                } else {
                    this.$Message.error(res.data.result)
                }
            },*/
            /* 获取业务配置 */
            async getServiceConfig() {
                this.loading3 = true
                let res = await selServerConfig({l4_code: this.$route.params.id})
               // console.log(res)
                if (this.asyncOk(res)) {
                    this.loading3 = false
                    this.serviceConfigList = res.data.result || []
                    this.serviceConfigList.map(item => {
                        item._checked = item.status
                    })
                   // console.log(this.serviceConfigList)
                }
            },
            /* 新建或修改配置 */
            serviceConfig () {
                this.$refs['newConfigForm'].validate((valid) => {
                    if (valid) {
                        let json = {
                            ...this.newConfig,
                            l4_code: this.$route.params.id,
                        }
                        json.session_maintenance = this.newConfig.session_maintenance ? 'on' : 'off'
                        this.addNewConfigLoading = true
                        //console.log(json)
                        let url = this.configMode ? '/uptServerConfig': '/insServerConfig'
                        serviceConfig(url, json).then(res => {
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
                this.loading3 = true
                let res = await  delServerConfig({l4_service_id: row.l4_service_id}).then(res => {
                    // console.log(res)
                    if (this.asyncOk(res)) {
                        this.loading3 = false
                        this.$Message.success('操作成功！')
                        this.modal = false
                        this.serviceConfigList.splice(index, 1);
                    }
                })
            },
            /* 修改业务配置 */
            modifyConfig(row) {
                this.newConfig = row
                this.newConfig.session_maintenance = row.session_maintenance === 'on'
                this.modal = true
                this.configMode = true
            },
            /* 选中的配置 */
            selectedConfigs(selection) {
                if(!selection) return
                let arr = []
                selection.map((item) => {
                    arr.push({
                        l4_service_id: item.l4_service_id,
                    })
                })
                // console.log(arr)
                this.selection = arr
            },
           /* /!* 保存业务配置状态 *!/
            async uptServerConfigStatus() {
                let res = await uptServerConfigStatus(this.selectedConfigs())
            },*/
            /* 保存修改 */
            saveChange() {
                this.$refs['netConfigForm'].validate((valid) => {
                    if (valid) {
                        this.loading2 = true
                       // this.changeBaseConfig()
                       // this.uptServerConfigStatus()
                        let json = {
                            ...this.netConfig,
                            l4_code: this.$route.params.id
                        }

                        let p1 = modifyDeviceConfig(json)
                        let p2 = uptServerConfigStatus(this.selection, {l4_code: this.$route.params.id})
                        Promise.all([p1,p2]).then(res => {
                            this.loading2 = false
                            res.map(item => {
                                if(item.data.code !== 'success') {
                                    this.$Message.error('保存失败！')
                                   // this.loading2 = false
                                    return
                                }
                            })

                            this.$Message.success('保存成功！')
                        }).catch(err => {
                             console.log(err)
                        })

                    }
                })
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
