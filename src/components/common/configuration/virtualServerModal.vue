<template>
    <div v-if="model">
        <Modal
                width="790"
                v-model="model"
                :transfer="true"
                :mask-closable="false"
                @on-visible-change="change"
                :title="modify?  '修改虚拟服务器' : '新建虚拟服务器'"
        >
            <div class="virtual_server_form" >

                <Alert type="error" class="err-tip" v-if="errorTip.show" closable >
                    您需要确认每个部分的更改: {{errorTip.value}}
                    <Icon type="md-close"  class="close" slot="close"/>
                </Alert>
                <domain :modify="modify"
                        :data = "domain"
                        @edit = "checkEditStatus"
                        @readyOk = 'prepareConfig'
                ></domain>
                <listen :modify="modify"
                        :data = "listen"
                        @edit = "checkEditStatus"
                        @readyOk = 'prepareConfig'></listen>
                  <!--<Form ref="serverForm" :model="serverForm" :rules="serverFormRules"    @submit.native.prevent>
                      <my-form-item  title="DOMAIN NAMES"
                                    @closeConfig = "cancel('domain')"
                                    @saveConfig = "saveConfig('domain')"
                                     @cancel = "cancel('domain')"
                                     :modify="modify"
                                     :open = "serverForm.domain_names_state"
                                    info="Domain names that are served by this virtual server. This corresponds with the server_name directive in NGINX configuration.">
                          <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
                                  <FormItem class="input line-form-item with-button" prop="domain_name">
                                      <Button  icon="md-close" class="tag"
                                               :key="index"
                                               v-if="item"
                                               @click="removeTag(item)"
                                               v-for="(item, index) in serverForm.domain_name.split(',')">{{item}}</Button>
                                      <Input  v-model.trim="serverForm.domainName" @on-blur="addDomainName" @on-enter="addDomainName" placeholder="name"></Input>
                                  </FormItem>
                                  <div class="ctrl-edit-item__note">Prefix the name with ~ to use a regular expression</div>
                          </div>

                          <div slot="show" class="ctrl-edit-item">
                              <div class="name-list">
                              <span  class="tag" :key="index"
                                     v-for="(item, index) in serverForm.domain_name.split(',')">{{item}}</span>
                              </div>

                          </div>
                      </my-form-item>
                      <my-form-item  title="LISTENING ADDRESS AND PORT"
                                    @closeConfig = "closeConfig('serverForm.listening_m.listening')"
                                    @saveConfig = "saveConfig('serverForm.listening_m.listening')"
                                    :important="true"
                                    info="Address and port (IPv4 or IPv6) or UNIX domain socket path on which the server will accept requests.">

                         <div slot="edit">
                             <div :key="index" v-for="(item, index) in serverForm.ngcListenings" class="ctrl-edit-item ctrl-edit-item_edit mulity">

                                 <div class="item-body">
                                     <FormItem class="line-form-item">
                                         <Input v-model.trim="item.port" @on-enter="addDomainName" placeholder="2134"></Input>
                                     </FormItem>
                                     <FormItem label="DEFAULT SERVER" class="aline-center">
                                         <i-switch  >
                                         </i-switch>
                                     </FormItem>
                                     <FormItem label="SSL" class="aline-center">
                                         <i-switch  >
                                         </i-switch>
                                     </FormItem>
                                     <FormItem label="HTTP/2" class="aline-center">
                                         <i-switch >
                                         </i-switch>
                                     </FormItem>
                                     <FormItem label="PROXY PROTOCOL" class="aline-center">
                                         <i-switch  >
                                         </i-switch>
                                     </FormItem>
                                     <expandPanel>
                                         <FormItem label="FIB" class="inline-form-item">
                                             <Input  placeholder="number"></Input>
                                         </FormItem>
                                         <FormItem label="TCP FAST OPEN" class="inline-form-item">
                                             <Input  placeholder="number"></Input>
                                         </FormItem>
                                         <FormItem label="BACKLOG" class="inline-form-item">
                                             <Input  placeholder="number"></Input>
                                         </FormItem>
                                         <FormItem label="RECEIVE BUFFER SIZE" class="inline-form-item">
                                             <Input  placeholder="bytes"></Input>
                                         </FormItem>
                                         <FormItem label="SEND BUFFER SIZE" class="inline-form-item">
                                             <Input placeholder="bytes"></Input>
                                         </FormItem>
                                         <FormItem label="ACCEPT FILTER" class="inline-form-item">
                                             <Select >
                                                 <Option value="dataready">dataready</Option>
                                                 <Option value="httpready">httpready</Option>
                                                 <Option value="none">none</Option>
                                             </Select>
                                         </FormItem>
                                         <FormItem label="DEFERRED" class="aline-center">
                                             <i-switch  >
                                             </i-switch>
                                         </FormItem>
                                         <FormItem label="BIND" class="aline-center">
                                             <i-switch v-model="item.default_server" >
                                             </i-switch>
                                         </FormItem>
                                         <FormItem label="ACCEPT IPV6 ONLY" class="aline-center">
                                             <i-switch >
                                             </i-switch>
                                         </FormItem>
                                         <FormItem label="REUSEPORT" class="aline-center">
                                             <i-switch  >
                                             </i-switch>
                                         </FormItem>
                                         <FormItem label="TCP KEEPALIVE" class="aline-center">
                                             <i-switch  >
                                             </i-switch>
                                         </FormItem>
                                     </expandPanel>
                                 </div>
                                 <div class="item-body-remove" v-if="index>1">
                                     <Icon type="ios-trash" class="remove-icon" @click="removeList(serverForm.ngcListenings,index)" size="20"/>
                                 </div>
                             </div>
                             <div class="add-listen" @click="addListen">
                                 <Icon class="icon" size="22" type="ios-add-circle-outline" />
                                 <span class="tip">Add listen</span>
                             </div>
                         </div>


                          <div slot="show" >
                              <div class="ctrl-edit-item">

                              </div>
                          </div>
                      </my-form-item>
                      <my-form-item  title="SSL CERTIFICATE"
                                    @closeConfig = "closeConfig('serverForm.listening_m.listening')"
                                    @saveConfig = "saveConfig('serverForm.listening_m.listening')"
                                    info="Specify the path to the file containing server certificate. The secret key can be placed in the certificate file or defined separately. Both the certificate and the key should be in the PEM format.">

                          <div slot="edit">
                              <div  class="ctrl-edit-item ctrl-edit-item_edit">
                                 <div class="ctrl-edit-item__note">
                                     Please enable SSL in "Listening Address and Port" and make sure you have manually uploaded both the certificate and the key to the server.
                                 </div>
                                  <FormItem label="FILE" class="line-form-item">
                                      <Input placeholder="certs/myserver.crt"></Input>
                                  </FormItem>
                                  <FormItem label="KEY" class="line-form-item">
                                      <Input placeholder="certs/myserver.key"></Input>
                                  </FormItem>
                              </div>
                          </div>
                          <div slot="show" >
                              <div class="ctrl-edit-item">
                                  <div class="ctrl-edit-item__note">
                                      Please enable SSL in "Listening Address and Port" and make sure you have manually uploaded both the certificate and the key to the server.
                                  </div>
                                  <div class="ctrl-edit-properties__row">
                                      <span class="label">FILE</span>
                                      <span class="value">123</span>
                                  </div>
                                  <div class="ctrl-edit-properties__row">
                                      <span class="label">KEY</span>
                                      <span class="value">123</span>
                                  </div>
                              </div>
                          </div>
                      </my-form-item>
                      <my-form-item  title="ALLOW / DENY"
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
                      <my-form-item  title="ERROR PAGES"
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
                      <my-form-item  title="ERROR LOG"
                                    :onlyShow="true"
                                    @closeConfig = "closeConfig('serverForm.listening_m.listening')"
                                    @saveConfig = "saveConfig('serverForm.listening_m.listening')"
                                    info="Define the response that will be shown for specific errors.">
                          <div slot="show" >
                              <div  class="ctrl-edit-item ">
                                  <div class="ctrl-edit-properties__row">
                                      <span class="label">PATH</span>
                                      <span class="value">/var/log/nginx/error.log</span>
                                  </div>
                                  <div class="ctrl-edit-properties__row">
                                      <span class="label">LEVEL</span>
                                      <span class="value">ERROR</span>
                                  </div>
                              </div>

                          </div>
                      </my-form-item>
                      <my-form-item  title="ACCESS LOG"
                                    @closeConfig = "closeConfig('serverForm.listening_m.listening')"
                                    @saveConfig = "saveConfig('serverForm.listening_m.listening')"
                                    info="Enables access log for this virtual server. Log can be found at /var/log/nginx/access.log">

                          <div slot="edit">
                              <div  class="ctrl-edit-item ctrl-edit-item_edit">

                                  <div class="item-body">
                                      <FormItem label="USE DEFAULT FORMAT" class="aline-center">
                                          <i-switch >
                                          </i-switch>
                                      </FormItem>
                                      <FormItem class="line-form-item">

                                          <Input placeholder="name"></Input>
                                      </FormItem>
                                      <FormItem class="line-form-item">
                                          <Input placeholder="format"></Input>
                                      </FormItem>
                                  </div>

                              </div>
                          </div>
                          <div slot="show" >
                              <div  class="ctrl-edit-item ">
                                  <div class="ctrl-edit-properties__row">
                                      <span class="label">PATH</span>
                                      <span class="value">/var/log/nginx/access.log</span>
                                  </div>
                                  <div class="ctrl-edit-properties__row">
                                      <span class="label">LEVEL</span>
                                      <span class="">324</span>
                                  </div>
                              </div>

                          </div>
                      </my-form-item>
                  </Form>-->

            </div>
            <div slot="footer">
                <Button @click="change(false)">取消</Button>
                <Button type="primary"  :loading="modal_loading" @click="handleSubmit">保存</Button>

            </div>
        </Modal>
    </div>

</template>
<script>
    import PopTip from '@/components/common/pop-tip'
    import myFormItem from './form-item'
    import expandPanel from '../expandPanel'
    import draggable from 'vuedraggable'
    import defaultConfig from './defaultConfig'
    import emptyConfig from './emptyConfig'
    import domain from './virtualServerModal/domain'
    import listen from './virtualServerModal/listen'
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
          PopTip, myFormItem, expandPanel,  draggable, domain, listen
        },
        watch: {
            show (newVal, oldVal) {
                this.model = newVal
            },
            model(newVal, oldVal){
                if (!newVal) {
                    this.change(newVal)
                }
            },
            modify(nv) {
                console.log(nv)
            },
            data : {
                handler(nv, ov){
                    /* 拷贝对象 */
                    this.serverForm = this.copyJson(nv)
                    this.domain = {
                        domain_names_state: this.serverForm.domain_names_state,
                        domain_name: this.serverForm.domain_name,
                    }
                    this.listen = {
                        ngcListenings: this.serverForm.ngcListenings
                    }

                },
                immediate: true
            }
        },
        data () {

            return {
                modal_loading: false,
                model: false,
                serverForm: {

                },
                errorInfo: {},
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
                domain: {},
                listen: {}

            }
        },
        computed: {

        },
        methods: {
            change(data) {
                this.model = data
                this.$emit('change', {data: data, name: 'serverModal'})
            },

            handleSubmit () {
                // 验证是否有未确认的更改
                Object.keys(this.errorInfo).map((item) => {
                    console.log(this.errorInfo[item])
                    if (this.errorInfo[item]){
                        this.errorTip = {
                            show: true,
                            value: item
                        }
                        return
                    }
                })
            },

            checkEditStatus(data){
                this.errorInfo[data.name] = data.value
            },
            prepareConfig(data) {
                Object.keys(data).map(item => {
                    this.serverForm[item] = data[item]
                })
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
        beforeDestroy() {
            console.log('yichu')
            //this.change(false)
        }
    }
</script>
<style lang="less" scoped>
   @import "modal-form";
</style>
