<template>
    <Modal
            width="790"
            v-model="model"
            :transfer="true"
            :mask-closable="false"
            @on-visible-change="change"
            title="NEW LOCATION"

    >
        <div class="virtual_server_form" >

            <Alert type="error" class="err-tip" v-if="errorTip.show" closable >
                您需要确认每个部分的更改: {{errorTip.value}}
                <Icon type="md-close"  class="close" slot="close"/>
            </Alert>

            <Form ref="serverForm" :model="serverForm" :rules="serverFormRules"   @submit.native.prevent>
                <my-form-item title="URI-PATH/ROUTE"
                              @closeConfig = "closeConfig('domain')"
                              @saveConfig = "saveConfig('domain')"
                              :important="true"
                              info="Location definitions are central to the request routing mechanism in NGINX. Location specifies whether NGINX will proxy a particular request or serve it directly.">
                    <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
                        <FormItem label="" class="inline-form-item options">
                            <Select >
                                <Option value="dataready">prefix</Option>
                                <Option value="httpready">exact</Option>
                                <Option value="httpready">regex</Option>
                                <Option value="httpready">regex(case-insensitive)</Option>
                            </Select>
                            <span class="options-label">match with</span>
                            <Input placeholder="/"></Input>
                        </FormItem>
                    </div>

                    <div slot="show" class="ctrl-edit-item">

                    </div>
                </my-form-item>
                <my-form-item title="USE AS NGINX API LOCATION"
                              @closeConfig = "closeConfig('domain')"
                              @saveConfig = "saveConfig('domain')"
                              :only-show="true"
                              info="Enable read-only REST API provided by the NGINX API module. Make sure to limit the access to the API using allow/deny. For more details, please refer to the NGINX documentation.">
                    <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">

                    </div>
                    <div slot="show" class="ctrl-edit-item">
                        <FormItem label="READ-ONLY" class="aline-center">
                            <i-switch >
                            </i-switch>
                        </FormItem>
                    </div>
                </my-form-item>
                <my-form-item title="PROXY"
                              @closeConfig = "closeConfig('domain')"
                              @saveConfig = "saveConfig('domain')"
                              info="Proxy requests to upstream servers.">
                    <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
                        <FormItem label="" class="line-form-item">
                            <Input placeholder="URL"></Input>
                        </FormItem>
                        <FormItem label="HEADERS" class="inline-form-item proxy">
                            <div class="ctrl-edit-item ctrl-edit-item_edit mulity">
                                <Input placeholder="Header"></Input>
                                <Input placeholder="Value"></Input>
                                <div class="item-body-remove" >
                                    <Icon type="ios-trash" class="remove-icon" @click="removeList(serverForm.listening_m.listening,index)" size="20"/>
                                </div>

                            </div>
                            <div class="add-listen" >
                                <Icon class="icon" size="22" type="ios-add-circle-outline" />
                                <span class="tip">Add header</span>
                            </div>
                        </FormItem>
                        <FormItem label="BUFFERING" class="inline-form-item">
                            <div>
                                <i-switch size="small">
                                </i-switch>
                            </div>
                            <div>
                                <i-switch size="small">
                                </i-switch>
                                <span style="color: #666; margin-left: 10px">Allow to buffer on disk</span>
                            </div>

                        </FormItem>
                        <FormItem label="HTTP VERSION" class="inline-form-item">
                            <Select >
                                <Option value="dataready">1.1</Option>
                                <Option value="httpready">1.0</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="CONNECT TIMEOUT" class="inline-form-item">
                            <Input  placeholder="time"></Input>
                        </FormItem>
                        <FormItem label="CONNECT TIMEOUT" class="inline-form-item">
                            <i-switch size="small">
                            </i-switch>
                        </FormItem>
                    </div>

                    <div slot="show" class="ctrl-edit-item">
                        <div class="show-panel-title">http://192.168.0.1</div>
                        <div class="show-panel">
                            <div class="show-panel-item">
                                <div class="show-panel-item-left">
                                    <span>HEADERS</span>
                                </div>
                                <div class="show-panel-item-right">
                                    <div class="ctrl-edit-item">
                                        <div class="ctrl-edit-properties__row">
                                            <span class="label">FILE</span>
                                            <span class="value">123</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="show-panel-item">
                                <div class="show-panel-item-left">
                                    <span>BUFFERING</span>
                                </div>
                                <div class="show-panel-item-right">
                                    <span>on</span>
                                </div>
                            </div>
                            <div class="show-panel-item">
                                <div class="show-panel-item-left">
                                    <span>WRITE ON DISK</span>
                                </div>
                                <div class="show-panel-item-right">
                                    <span>on</span>
                                </div>
                            </div>
                            <div class="show-panel-item">
                                <div class="show-panel-item-left">
                                    <span>HTTP VERSION</span>
                                </div>
                                <div class="show-panel-item-right">
                                    <span>1.1</span>
                                </div>
                            </div>
                            <div class="show-panel-item">
                                <div class="show-panel-item-left">
                                    <span>CONNECT TIMEOUT</span>
                                </div>
                                <div class="show-panel-item-right">
                                    <span>500</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </my-form-item>

                <my-form-item :obj="serverForm.listening_m.listening" title="ALLOW / DENY"
                              @closeConfig = "closeConfig('serverForm.listening_m.listening')"
                              @saveConfig = "saveConfig('serverForm.listening_m.listening')"
                              info="Allow or deny access for specific IP or network.">

                    <div slot="edit">
                        <draggable v-model="dragList" handle=".drag-handle" @start="drag = true"
                                   ghost-class="drag-item-ghost"
                                   @end="drag = false">
                            <transition-group >
                                <div v-for="element in dragList" :key="element.id">
                                    <div  class="ctrl-edit-item ctrl-edit-item_edit drag-edit-item mulity">
                                        <span class="drag-handle" v-if="dragList.length>1"></span>

                                        <FormItem label="" class="inline-form-item options">
                                            <Select >
                                                <Option value="dataready">ALLOW</Option>
                                                <Option value="httpready">DENY</Option>
                                            </Select>
                                            <Input placeholder="certs/myserver.crt"></Input>
                                        </FormItem>
                                        <div class="item-body-remove">
                                            <Icon type="ios-trash" class="remove-icon" @click="" size="20"/>
                                        </div>
                                    </div>

                                </div>
                            </transition-group>
                        </draggable>
                        <div class="add-listen" @click="addRule">

                            <Icon class="icon" size="22" type="ios-add-circle-outline" />
                            <span class="tip">Add rule</span>
                        </div>
                    </div>
                    <div slot="show" >
                        <draggable v-model="dragList" handle=".drag-handle" @start="drag = true"
                                   ghost-class="drag-item-ghost"
                                   @end="drag = false">
                            <transition-group >
                                <div v-for="element in dragList" :key="element.id">
                                    <div class="ctrl-edit-item drag-edit-item">
                                        <span class="drag-handle" v-if="dragList.length>1"></span>
                                        <span class="allow_deny">allow</span>
                                        <span class="allow_deny_value">192.168.0.1</span>
                                    </div>

                                </div>
                            </transition-group>
                        </draggable>

                    </div>
                </my-form-item>
                <my-form-item :obj="serverForm.listening_m.listening" title="ERROR PAGES"
                              @closeConfig = "closeConfig('serverForm.listening_m.listening')"
                              @saveConfig = "saveConfig('serverForm.listening_m.listening')"
                              info="Define the response that will be shown for specific errors.">

                    <div slot="edit">
                        <div  class="ctrl-edit-item ctrl-edit-item_edit mulity">

                            <div class="item-body">
                                <FormItem label="HTTP CODES" class="inline-form-item full-input">
                                    <Input  placeholder="code"></Input>
                                </FormItem>
                                <FormItem label="REDIRECT TO" class="inline-form-item full-input">
                                    <Input placeholder="URL | URI | variable"></Input>
                                </FormItem>
                                <FormItem label="RESPONSE CODE" class="inline-form-item full-input">
                                    <Input placeholder="=code"></Input>
                                </FormItem>
                            </div>
                            <div class="item-body-remove" >
                                <Icon type="ios-trash" class="remove-icon" @click="removeList(serverForm.listening_m.listening,index)" size="20"/>
                            </div>
                        </div>
                        <div class="add-listen" @click="addErrorPage">
                            <Icon class="icon" size="22" type="ios-add-circle-outline" />
                            <span class="tip">Add error page</span>
                        </div>
                    </div>
                    <div slot="show" >
                        <div  class="ctrl-edit-item error-pages">
                            <span class="error-pages-codes">404</span> will show <span class="error-pages-redirect">111</span> with response <span class="error-pages-response">404</span>
                        </div>

                    </div>
                </my-form-item>
                <my-form-item :obj="serverForm.listening_m.listening" title="INDEX FILES"
                              @closeConfig = "closeConfig('serverForm.listening_m.listening')"
                              @saveConfig = "saveConfig('serverForm.listening_m.listening')"
                              info="Define the response that will be shown for specific errors.">

                    <div slot="edit">
                        <div  class="ctrl-edit-item ctrl-edit-item_edit">
                            <FormItem class="line-form-item with-button">
                                <Button  icon="md-close" class="tag"
                                        >2131</Button>
                                <Input  placeholder="file"></Input>
                            </FormItem>
                        </div>
                    </div>
                    <div slot="show" >
                        <div  class="ctrl-edit-item">
                            <div class="name-list">
                                <span  class="tag" >123</span>
                            </div>
                        </div>

                    </div>
                </my-form-item>
                <my-form-item :obj="serverForm.listening_m.listening" title="ROOT"
                              @closeConfig = "closeConfig('serverForm.listening_m.listening')"
                              @saveConfig = "saveConfig('serverForm.listening_m.listening')"
                              info="Define the root directory for the static content when serving it directly.">

                    <div slot="edit">
                        <div  class="ctrl-edit-item ctrl-edit-item_edit">
                            <FormItem class="line-form-item">

                                <Input  placeholder="path"></Input>
                            </FormItem>
                        </div>
                    </div>
                    <div slot="show" >
                        <div  class="ctrl-edit-item">
                            <div class="ctrl-edit-item__string">path</div>
                        </div>

                    </div>
                </my-form-item>
                <my-form-item :obj="serverForm.listening_m.listening" title="ALIAS"
                              @closeConfig = "closeConfig('serverForm.listening_m.listening')"
                              @saveConfig = "saveConfig('serverForm.listening_m.listening')"
                              info="Define an alias for the URI path on the filesystem when serving static content directly.">

                    <div slot="edit">
                        <div  class="ctrl-edit-item ctrl-edit-item_edit">
                            <FormItem class="line-form-item">
                                <Input  placeholder="path"></Input>
                            </FormItem>
                        </div>
                    </div>
                    <div slot="show" >
                        <div  class="ctrl-edit-item">
                            <div class="ctrl-edit-item__string">path</div>
                        </div>

                    </div>
                </my-form-item>
            </Form>


        </div>
        <div slot="footer">
            <Button @click="model = false">取消</Button>
            <Button type="primary"  :loading="modal_loading" @click="handleSubmit">保存</Button>

        </div>
    </Modal>
</template>
<script>
    import PopTip from '@/components/common/pop-tip'
    import myFormItem from './form-item'
    import expandPanel from '../expandPanel'
    import draggable from 'vuedraggable'
    export default {
        props: {
            show: false,
            data: {
                type: Object,
                default: () => {}
            }
        },
        components: {
            PopTip, myFormItem, expandPanel,  draggable,
        },
        watch: {
            show (newVal, oldVal) {
                console.log(...arguments)
                this.model = newVal
            },
            data (newVal, oldVal) {
                if (!this.isEmptyObject(newVal)){
                    this.serverForm = newVal
                }
            }
        },
        data () {
            return {
                modal_loading: false,
                model: false,
                serverForm: {
                    domain_names_m: {
                        domain_names: [],
                        input: ''
                    },
                    listening_m:{
                        listening: [

                        ],
                    }
                },

                serverFormRules: {

                },
                errorTip: {
                    show: false,
                    value: ''
                },
                dragList: [
                    { name: "John", text: "", id: 0 },
                    { name: "Joao", text: "", id: 1 },
                    { name: "Jean", text: "", id: 2 }
                ],
                drag: false,
            }
        },
        computed: {

        },
        methods: {
            change(data) {
                this.model = data
                this.$emit('change', {data: data, name: 'locationModal'})
            },

            handleSubmit () {
                // 验证是否有未确认的更改
                Object.keys(this.serverForm).map((item) => {
                    console.log(this.serverForm[item])
                    if (this.isEmptyObject(this.serverForm[item])){
                        this.errorTip = {
                            show: true,
                            value: item
                        }
                        return
                    }
                })
            },
            addDomainName () {
                this.serverForm.domain_names_m.domain_names.push(this.serverForm.domain_names_m.input)
                this.serverForm.domain_names_m.input = ''
            },
            /* 保存配置项 */
            saveConfig(configName) {
                console.log(configName)
            },
            /* 关闭配置项 */
            closeConfig (configName) {
                console.log(configName)
            },
            addListen() {
                // console.log(this.serverForm.listening_m.listening)
                this.serverForm.listening_m.listening.push({name: 123})
                // console.log(this.serverForm.listening_m.listening)

            },
            addRule() {
                this.dragList.push(this.dragList[0])
            },
            addErrorPage() {

            },
            removeList(obj, index) {
                obj.splice(index, 1)
            },

        },
        mounted() {
            console.log(this.data)
        }
    }
</script>
<style lang="less" scoped>
    @import "modal-form";
</style>
