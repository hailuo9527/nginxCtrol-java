<template>
    <div v-if="model">
        <Modal
                width="790"
                v-model="model"
                :transfer="true"
                :mask-closable="false"
                @on-visible-change="change"
                :title="modify?  '修改Location' : '新建Location'"

        >
            <div class="virtual_server_form" >

                <Alert type="error" class="err-tip" v-if="errorTip.show" closable >
                    您需要确认每个部分的更改: {{errorTip.value}}
                    <Icon type="md-close"  class="close" slot="close"/>
                </Alert>
                <uriPath
                        :modify="modify"
                        :data = "uriPath"
                        @edit = "checkEditStatus"
                        @readyOk = 'prepareConfig'
                ></uriPath>
                <apiLocation
                        :modify="modify"
                        :data = "apiLocation"
                        @edit = "checkEditStatus"
                        @readyOk = 'prepareConfig'
                ></apiLocation>
                <proxy
                        :disabled="disabled"
                        :modify="modify"
                        :data = "proxy"
                        @edit = "checkEditStatus"
                        @readyOk = 'prepareConfig'
                ></proxy>
                <allowDeny
                        :disabled="disabled"
                        :modify="modify"
                        :data = "allow_deny"
                        @edit = "checkEditStatus"
                        @readyOk = 'prepareConfig'
                ></allowDeny>
                <errorPages :modify="modify"
                            :disabled="disabled"
                            :data = "errorPages"
                            @edit = "checkEditStatus"
                            @readyOk = 'prepareConfig'
                ></errorPages>
                <indexFile
                        :modify="modify"
                        :disabled="disabled"
                        :data = "indexFiles"
                        @edit = "checkEditStatus"
                        @readyOk = 'prepareConfig'
                ></indexFile>
                <root
                        :modify="modify"
                        :disabled="disabled"
                        :data = "root"
                        @edit = "checkEditStatus"
                        @readyOk = 'prepareConfig'
                ></root>
                <alias
                        :modify="modify"
                        :disabled="disabled"
                        :data = "alias"
                        @edit = "checkEditStatus"
                        @readyOk = 'prepareConfig'
                ></alias>
                <!--<Form ref="locationForm" :model="locationForm" :rules="locationFormRules"   @submit.native.prevent>
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
                                        <Icon type="ios-trash" class="remove-icon" @click="removeList(locationForm.listening_m.listening,index)" size="20"/>
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

                    <my-form-item :obj="locationForm.listening_m.listening" title="ALLOW / DENY"
                                  @closeConfig = "closeConfig('locationForm.listening_m.listening')"
                                  @saveConfig = "saveConfig('locationForm.listening_m.listening')"
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
                    <my-form-item :obj="locationForm.listening_m.listening" title="ERROR PAGES"
                                  @closeConfig = "closeConfig('locationForm.listening_m.listening')"
                                  @saveConfig = "saveConfig('locationForm.listening_m.listening')"
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
                                    <Icon type="ios-trash" class="remove-icon" @click="removeList(locationForm.listening_m.listening,index)" size="20"/>
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
                    <my-form-item :obj="locationForm.listening_m.listening" title="INDEX FILES"
                                  @closeConfig = "closeConfig('locationForm.listening_m.listening')"
                                  @saveConfig = "saveConfig('locationForm.listening_m.listening')"
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
                    <my-form-item :obj="locationForm.listening_m.listening" title="ROOT"
                                  @closeConfig = "closeConfig('locationForm.listening_m.listening')"
                                  @saveConfig = "saveConfig('locationForm.listening_m.listening')"
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
                    <my-form-item :obj="locationForm.listening_m.listening" title="ALIAS"
                                  @closeConfig = "closeConfig('locationForm.listening_m.listening')"
                                  @saveConfig = "saveConfig('locationForm.listening_m.listening')"
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
                </Form>-->


            </div>
            <div slot="footer">
                <modelFooter name="location" :showRemoveButton="modify" @remove="remove" @cancel="change(false)" @save="handleSubmit"></modelFooter>

            </div>
        </Modal>
    </div>

</template>
<script>
    import uriPath from './locationModal/uriPath'
    import apiLocation from './locationModal/apiLocation'
    import proxy from './locationModal/proxy'
    import allowDeny from './locationModal/allow_deny'
    import errorPages from './locationModal/errorPages'
    import indexFile from './locationModal/indexFile'
    import root from './locationModal/root'
    import alias from './locationModal/alias'
    import modelFooter from './modelFooter'
    export default {
        props: {
            show: false,
            data: {
                type: Object,
                default: () => {}
            },
            modify: false,
        },
        components: {
            uriPath, apiLocation, proxy, allowDeny, errorPages, indexFile, root, alias, modelFooter
        },
        watch: {
            show (newVal, oldVal) {
                //console.log(...arguments)
                this.model = newVal
            },
            model(newVal, oldVal){
                if (!newVal) {
                    this.change(newVal)
                    this.errorTip = {
                        show: false,
                        value: ''
                    }
                }
            },
            data : {
                handler(nv, ov){
                    /* 拷贝对象 */
                    this.locationForm = this.copyJson(nv)
                    this.uriPath = {
                        url_path_route_key: this.locationForm.url_path_route_key,
                        url_path_route_value: this.locationForm.url_path_route_value,
                    }
                    this.apiLocation = {
                        apilocation_state: this.locationForm.apilocation_state,
                        read_only_state: this.locationForm.read_only_state,
                    }
                    this.proxy = {
                        proxy_state: this.locationForm.proxy_state,
                        proxy_url: this.locationForm.proxy_url,
                        ngcLocationHeaders: this.locationForm.ngcLocationHeaders,
                        buffering_state: this.locationForm.buffering_state,
                        allow_to_buffer_on_disk_state: this.locationForm.allow_to_buffer_on_disk_state,
                        http_version: this.locationForm.http_version,
                        connect_timeout: this.locationForm.connect_timeout,
                        intercept_errors_state: this.locationForm.intercept_errors_state,
                    }
                    this.allow_deny = {
                        allow_deny_state: this.locationForm.allow_deny_state,
                        ngcAllowDenies: this.locationForm.ngcAllowDenies,
                    }
                    this.errorPages = {
                        error_pages_state: this.locationForm.error_pages_state,
                        ngcErrorPages: this.locationForm.ngcErrorPages
                    }
                    this.indexFiles = {
                        index_files_state: this.locationForm.index_files_state,
                        index_files: this.locationForm.index_files,
                    }
                    this.root = {
                        root_state: this.locationForm.root_state,
                        root_path: this.locationForm.root_path,
                    }
                    this.alias = {
                        alias_state: this.locationForm.alias_state,
                        alias_path: this.locationForm.alias_path,
                    }

                },
                immediate: true
            },
            modify(nv) {
               // console.log(nv)
            },


        },
        data () {
            return {
                modal_loading: false,
                model: false,
                locationForm: {},
                errorInfo: {},
                errorTip: {
                    show: false,
                    value: ''
                },
                disabled: false,
                uriPath: {},
                apiLocation: {},
                proxy: {},
                allow_deny: {},
                errorPages: {},
                indexFiles: {},
                root: {},
                alias: {}
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
                console.log('保存')
                // 验证是否有未确认的更改
                // console.log(this.errorInfo)
                let flag = true

                Object.keys(this.errorInfo).map((item) => {
                    //console.log(this.errorInfo[item])
                    if (this.errorInfo[item]){
                        flag = false
                        this.errorTip = {
                            show: true,
                            value: item
                        }
                    }
                })
                if (flag) {
                    this.$emit('submit', this.locationForm)
                    this.change(false)
                }
            },
            /* 检查是否有未保存的配置项 */
            checkEditStatus(data){
                //console.log(data)
                this.errorInfo[data.name] = data.value
                Object.keys(this.errorInfo).map((item) => {
                    if (!this.errorInfo[item]){
                        this.errorTip = {
                            show: false,
                            value: ''
                        }
                    }
                })
            },
            prepareConfig(data) {
                console.log(data)

                this.disabled = data.apilocation_state
                Object.keys(data).map(item => {
                    this.locationForm[item] = data[item] // 拿到修改过后的配置对象
                })

            },
            remove(){
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>是否要删除此配置？</p>',
                    onOk: () => {
                        this.change(false)
                        this.$emit('removeConfig', 'location')
                        //this.$Message.info('Clicked ok');
                    },
                    onCancel: () => {
                        //this.$Message.info('Clicked cancel');
                    }
                })

            }

        },
        mounted() {
            console.log(this.data)
        }
    }
</script>
<style lang="less" scoped>
    @import "modal-form";
</style>
