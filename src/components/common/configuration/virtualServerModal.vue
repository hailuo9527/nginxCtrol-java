<template>
    <Modal
            width="790"
            v-model="model"
            :transfer="true"
            :mask-closable="false"
            @on-visible-change="change"
            title="新建虚拟服务器"
            v-show="!isEmptyObject(serverForm)"
    >
        <div class="virtual_server_form" >

            <Alert type="error" class="err-tip" v-if="errorTip.show" closable >
                您需要确认每个部分的更改: {{errorTip.value}}
                <Icon type="md-close"  class="close" slot="close"/>
            </Alert>

            <Form ref="serverForm" :model="serverForm" :rules="serverFormRules"   @submit.native.prevent>
                <my-form-item :obj="serverForm.domain_names_m" title="DOMAIN NAMES"
                              @closeConfig = "closeConfig('domain')"
                              @saveConfig = "saveConfig('domain')"
                              info="Domain names that are served by this virtual server. This corresponds with the server_name directive in NGINX configuration.">
                    <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
                            <FormItem class="border-bottom">
                                <Button  icon="md-close" class="tag"
                                         :key="index"
                                         v-for="(item, index) in serverForm.domain_names_m.domain_names">{{item}}</Button>
                                <Input v-model.trim="serverForm.domain_names_m.input" @on-enter="addDomainName" placeholder="2134"></Input>
                            </FormItem>
                            <div class="ctrl-edit-item__note">Prefix the name with ~ to use a regular expression</div>
                    </div>

                    <div slot="show" class="ctrl-edit-item">
                        <div class="name-list">
                        <span  class="tag" :key="index"
                               v-for="(item, index) in serverForm.domain_names_m.domain_names">{{item}}</span>
                        </div>
                    </div>
                </my-form-item>
                <my-form-item :obj="serverForm.listening_m.listening" title="LISTENING ADDRESS AND PORT"
                              @closeConfig = "closeConfig('serverForm.listening_m.listening')"
                              @saveConfig = "saveConfig('serverForm.listening_m.listening')"
                              :important="true"
                              info="Address and port (IPv4 or IPv6) or UNIX domain socket path on which the server will accept requests.">

                   <div slot="edit">
                       <div  v-if="serverForm.listening_m.listening.length===1" class="ctrl-edit-item ctrl-edit-item_edit">
                           <FormItem class="input line-form-item">
                               <Input v-model.trim="serverForm.listening_m.listening[0].port" @on-enter="addDomainName" placeholder="2134"></Input>
                           </FormItem>
                           <FormItem label="DEFAULT SERVER" class="aline-center">
                               <i-switch v-model="serverForm.listening_m.listening[0].default_server" >
                               </i-switch>
                           </FormItem>
                           <FormItem label="SSL" class="aline-center">
                               <i-switch v-model="serverForm.listening_m.listening[0].default_server" >
                               </i-switch>
                           </FormItem>
                           <FormItem label="HTTP/2" class="aline-center">
                               <i-switch v-model="serverForm.listening_m.listening[0].default_server" >
                               </i-switch>
                           </FormItem>
                           <FormItem label="PROXY PROTOCOL" class="aline-center">
                               <i-switch v-model="serverForm.listening_m.listening[0].default_server" >
                               </i-switch>
                           </FormItem>
                           <expandPanel>
                               <FormItem label="FIB" class="inline-form-item">
                                   <Input v-model.trim="serverForm.listening_m.listening[0].port" @on-enter="addDomainName" placeholder="number"></Input>
                               </FormItem>
                               <FormItem label="TCP FAST OPEN" class="inline-form-item">
                                   <Input v-model.trim="serverForm.listening_m.listening[0].port" @on-enter="addDomainName" placeholder="number"></Input>
                               </FormItem>
                               <FormItem label="BACKLOG" class="inline-form-item">
                                   <Input v-model.trim="serverForm.listening_m.listening[0].port" @on-enter="addDomainName" placeholder="number"></Input>
                               </FormItem>
                               <FormItem label="RECEIVE BUFFER SIZE" class="inline-form-item">
                                   <Input v-model.trim="serverForm.listening_m.listening[0].port" @on-enter="addDomainName" placeholder="bytes"></Input>
                               </FormItem>
                               <FormItem label="SEND BUFFER SIZE" class="inline-form-item">
                                   <Input v-model.trim="serverForm.listening_m.listening[0].port" @on-enter="addDomainName" placeholder="bytes"></Input>
                               </FormItem>
                               <FormItem label="ACCEPT FILTER" class="inline-form-item">
                                   <Select v-model="serverForm.listening_m.listening[0].select">
                                       <Option value="dataready">dataready</Option>
                                       <Option value="httpready">httpready</Option>
                                       <Option value="none">none</Option>
                                   </Select>
                               </FormItem>
                               <FormItem label="DEFERRED" class="aline-center">
                                   <i-switch v-model="serverForm.listening_m.listening[0].default_server" >
                                   </i-switch>
                               </FormItem>
                               <FormItem label="BIND" class="aline-center">
                                   <i-switch v-model="serverForm.listening_m.listening[0].default_server" >
                                   </i-switch>
                               </FormItem>
                               <FormItem label="ACCEPT IPV6 ONLY" class="aline-center">
                                   <i-switch v-model="serverForm.listening_m.listening[0].default_server" >
                                   </i-switch>
                               </FormItem>
                               <FormItem label="REUSEPORT" class="aline-center">
                                   <i-switch v-model="serverForm.listening_m.listening[0].default_server" >
                                   </i-switch>
                               </FormItem>
                               <FormItem label="TCP KEEPALIVE" class="aline-center">
                                   <i-switch v-model="serverForm.listening_m.listening[0].default_server" >
                                   </i-switch>
                               </FormItem>
                           </expandPanel>
                       </div>
                       <div :key="index" v-if="serverForm.listening_m.listening.length>1" v-for="(item, index) in serverForm.listening_m.listening" class="ctrl-edit-item ctrl-edit-item_edit mulity">

                           <div class="item-body">
                               <FormItem class="input line-form-item">
                                   <Input v-model.trim="item.port" @on-enter="addDomainName" placeholder="2134"></Input>
                               </FormItem>
                               <FormItem label="DEFAULT SERVER" class="aline-center">
                                   <i-switch v-model="item.default_server" >
                                   </i-switch>
                               </FormItem>
                               <FormItem label="SSL" class="aline-center">
                                   <i-switch v-model="item.default_server" >
                                   </i-switch>
                               </FormItem>
                               <FormItem label="HTTP/2" class="aline-center">
                                   <i-switch v-model="item.default_server" >
                                   </i-switch>
                               </FormItem>
                               <FormItem label="PROXY PROTOCOL" class="aline-center">
                                   <i-switch v-model="item.default_server" >
                                   </i-switch>
                               </FormItem>
                               <expandPanel>
                                   <FormItem label="FIB" class="inline-form-item">
                                       <Input v-model.trim="item.port" @on-enter="addDomainName" placeholder="number"></Input>
                                   </FormItem>
                                   <FormItem label="TCP FAST OPEN" class="inline-form-item">
                                       <Input v-model.trim="item.port" @on-enter="addDomainName" placeholder="number"></Input>
                                   </FormItem>
                                   <FormItem label="BACKLOG" class="inline-form-item">
                                       <Input v-model.trim="item.port" @on-enter="addDomainName" placeholder="number"></Input>
                                   </FormItem>
                                   <FormItem label="RECEIVE BUFFER SIZE" class="inline-form-item">
                                       <Input v-model.trim="item.port" @on-enter="addDomainName" placeholder="bytes"></Input>
                                   </FormItem>
                                   <FormItem label="SEND BUFFER SIZE" class="inline-form-item">
                                       <Input v-model.trim="item.port" @on-enter="addDomainName" placeholder="bytes"></Input>
                                   </FormItem>
                                   <FormItem label="ACCEPT FILTER" class="inline-form-item">
                                       <Select v-model="item.select">
                                           <Option value="dataready">dataready</Option>
                                           <Option value="httpready">httpready</Option>
                                           <Option value="none">none</Option>
                                       </Select>
                                   </FormItem>
                                   <FormItem label="DEFERRED" class="aline-center">
                                       <i-switch v-model="item.default_server" >
                                       </i-switch>
                                   </FormItem>
                                   <FormItem label="BIND" class="aline-center">
                                       <i-switch v-model="item.default_server" >
                                       </i-switch>
                                   </FormItem>
                                   <FormItem label="ACCEPT IPV6 ONLY" class="aline-center">
                                       <i-switch v-model="item.default_server" >
                                       </i-switch>
                                   </FormItem>
                                   <FormItem label="REUSEPORT" class="aline-center">
                                       <i-switch v-model="item.default_server" >
                                       </i-switch>
                                   </FormItem>
                                   <FormItem label="TCP KEEPALIVE" class="aline-center">
                                       <i-switch v-model="item.default_server" >
                                       </i-switch>
                                   </FormItem>
                               </expandPanel>
                           </div>
                           <div class="item-body-remove">
                               <Icon type="ios-trash" class="remove-icon" @click="removeList(serverForm.listening_m.listening,index)" size="20"/>
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
    export default {
        props: {
            show: false,
            data: {
                type: Object,
                default: () => {}
            }
        },
        components: {
          PopTip, myFormItem, expandPanel
        },
        watch: {
            show (newVal, oldVal) {
                this.model = newVal
            },
            data (newVal, oldVal) {
                // console.log(...arguments)
                if (!this.isEmptyObject(newVal)){
                    this.serverForm = newVal
                    //this.model = true
                }
            }
        },
        data () {
            return {
                modal_loading: false,
                model: false,
                serverForm: {
                    domain_names_m: {
                        domain_names: ['123','rew'],
                        input: ''
                    },
                    listening_m:{
                        listening: [
                            {port: ''},
                            {rwr: 432}
                        ],
                    }
                },
                config: {},
                serverFormRules: {

                },
                errorTip: {
                    show: false,
                    value: ''
                },

            }
        },
        computed: {

        },
        methods: {
            change(data) {
                this.$emit('modalVisibleChange', {data: data, name: 'serverModal'})
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
                console.log(this.serverForm.listening_m.listening)
                this.serverForm.listening_m.listening.push({name: 123})
                console.log(this.serverForm.listening_m.listening)

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
    /deep/ .ivu-modal-close{
        .ivu-icon-ios-close{
            color: #fff;
            opacity: .6;
            font-size: 38px;
            transition: all .2s;
            &:hover{
                opacity: 1;
                transform: rotate(180deg);
            }
        }
    }
    /deep/.ivu-modal-body{
        //padding: 0 40px 20px;
        padding: 0;
    }
    .border-bottom /deep/.ivu-form-item-content{

        margin-top: 0!important;
        padding-bottom: 6px;
        border-bottom: 1px solid #ccc;
        display: flex;
    }


   .err-tip{
       margin-bottom: 0!important;
       background: #ff5559;
       opacity: .95;
       border: none;
       border-radius: 0;
       font-size: 14px;
       color: #fff;
       padding: 10px 40px;
       position: sticky;
       top: 0;
       .close{
           font-size: 18px;
           color: #fff;
           margin-right: 10px;
       }
   }
    /deep/.ivu-modal-header {
        border-bottom: none;
    }
    .name-list{
        .tag{
            border-radius: 3px;
        }
    }
    .tag{
        margin-right: 10px;
        display: inline-block;
        padding: 5px 10px;
        background: #f3f3f3;
        color: #333;

    }
    .aline-center{
        display: flex;
        align-items: center;
        &.ivu-form-item{
            margin-top: 15px;
        }
        /deep/ .ivu-form-item-content{
            margin-top: 0;
            padding-bottom: 0;
        }
    }
    /deep/.ivu-form .ivu-form-item-label{
        font-size: 12px;
        font-weight: bold;
        letter-spacing: .15em;
        color: #888;
        width: 160px;
        word-wrap:break-word;
        line-height: 16px;
        text-align: left;

    }
    .inline-form-item{
        display: flex;
        margin-bottom: 15px!important;
        margin-top: 15px;
        align-items: center;
        /deep/.ivu-form-item-content{
            height: 100%;
            border-bottom: 1px solid #ccc;
        }
        /deep/.ivu-input, /deep/ .ivu-select {
            border-radius: 0;
            width: 230px;
            height: 100%;
            display: inline-block;
            &:focus{
                box-shadow: 0 2px 0 0 #666;
            }
        }
        /deep/ .ivu-select-selection{
            border-radius: 0;
            border: none;
            .ivu-select-selected-value{
                font-size: 18px;
                color: #333;
            }
        }
        /deep/ .ivu-select-visible .ivu-select-selection {

            outline: 0;
            box-shadow: 0 2px 0 0 #666;
        }

    }
    .line-form-item{
        display: flex;

        /deep/.ivu-form-item-content{
            flex: 1;
            border-bottom: 1px solid #ccc;
            /deep/.ivu-input{
                border-radius: 0;

                &:focus{
                    box-shadow: 0 2px 0 0 #666;
                }
            }
        }


    }
    .add-listen {

        margin: 20px 40px 10px;
        font-size: 18px;
        line-height: 23px;
        vertical-align: middle;
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.1s linear;
        .icon{
            margin-right: 10px;
        }
    }

</style>
