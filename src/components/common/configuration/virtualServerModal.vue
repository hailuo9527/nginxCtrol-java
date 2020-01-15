<template>
    <Modal
            width="790"
            v-model="model"
            :transfer="true"
            @on-visible-change="change"
            title="新建虚拟服务器"
    >
        <div class="virtual_server_form" >

            <Alert type="error" class="err-tip" v-if="errorTip.show" closable >
                您需要确认每个部分的更改: {{errorTip.value}}
                <Icon type="md-close"  class="close" slot="close"/>
            </Alert>
           <!-- <Form ref="serverForm" :model="serverForm" :label-width="0">

                <FormItem>
                    <div class="form-item" :class="serverForm.domain.switch ? 'form-item-edit': ''">
                        <div class="form-item-header" >
                            <i-switch :value="!isEmptyObject(serverForm.domain)" ></i-switch>
                            <span class="title">DOMAIN NAMES</span>
                            <PopTip content="123"  placement="right"></PopTip>
                            <div class="actions" >
                                <Button shape="circle" icon="md-close" v-if="isEmptyObject(serverForm.domain)"></Button>
                                <Button  shape="circle" ghost type="primary" v-if="isEmptyObject(serverForm.domain)" icon="md-checkmark"></Button>
                                <Button shape="circle" icon="md-create" v-if="!isEmptyObject(serverForm.domain)"></Button>
                            </div>
                        </div>
                        <div class="ctrl-edit-item ctrl-edit-item_edit" v-show="!isEmptyObject(serverForm.domain)">

                                <div class="form-item-wrap" >
                                    <div class="name-list">
                                        <Button  icon="md-close" class="tag" v-for="(item,index) in serverForm.domain.nameList">{{item}}</Button>

                                    </div>
                                    <div class="input">
                                        <Input type="text"
                                               v-model="serverForm.domain.input"

                                               placeholder="example.com *.example.com">
                                        </Input>
                                    </div>

                                </div>

                            <div class="ctrl-edit-item__note">Prefix the name with ~ to use a regular expression</div>
                        </div>
                    </div>

                </FormItem>

            </Form>-->
            <Form ref="serverForm" :model="serverForm" :rules="serverFormRules" :label-width="0" @submit.native.prevent>
                <my-form-item :obj="serverForm.domain" title="DOMAIN NAMES"
                              @closeConfig = "closeConfig('domain')"
                              @saveConfig = "saveConfig('domain')"
                              info="Domain names that are served by this virtual server. This corresponds with the server_name directive in NGINX configuration.">
                    <div slot="edit" >
                        <div class="form-item-wrap" >
                            <div class="name-list">
                                <Button  icon="md-close" class="tag"
                                         :key="index"
                                         v-for="(item, index) in serverForm.domain.nameList">{{item}}</Button>
                            </div>
                            <div class="input">
                                <FormItem>
                                    <Input v-model.trim="serverForm.domain.input" @on-enter="addDomainName" placeholder="2134"></Input>
                                </FormItem>
                            </div>
                        </div>
                        <div class="ctrl-edit-item__note">Prefix the name with ~ to use a regular expression</div>
                    </div>
                    <div slot="show">
                        <div class="name-list">
                            <span  class="tag" :key="index"
                                   v-for="(item, index) in serverForm.domain.nameList">{{item}}</span>
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
    export default {
        props: {
            show: false,
        },
        components: {
          PopTip, myFormItem
        },
        watch: {
            show (newVal, oldVal) {
                this.model = newVal
            }
        },
        data () {
            return {
                modal_loading: false,
                model: true,
                serverForm: {
                    domain: {
                        nameList: ['123','rew'],
                        input: ''
                    },
                    listen: {

                    },
                },
                virtualForm: {
                    /*domain: {
                        nameList: ['123','rew'],
                        input: ''
                    },*/
                    domain: {},
                    listen: {

                    },
                    domainName: ''

                },
                add_l4_form: {},
                ruleValidate: {
                    l4_code: [
                        { required: true, message: '序列号不能为空', trigger: 'blur' }
                    ],

                },
                serverFormRules: {

                },
                errorTip: {
                    show: false,
                    value: ''
                },
                server: {
                    domain: {
                        name: 123
                    },
                    listen: {
                        port: 123,
                        default_server: false,
                        ssl: false,
                        http2: false,
                        proxy: false,
                        advancedSettings: [
                            {
                                fib: 'number',
                                tcp: 'number',
                                backlog: 'number',
                                receiveBufferSize: 'bytes',
                                sendBufferSize: 'bytes',
                                acceptFilter: 'string',
                                deferred: false,
                                bind: false,
                                ip6: false,
                                reuseport: false,
                                keepAlive: false
                            },
                            {
                                fib: 'number',
                                tcp: 'number',
                                backlog: 'number',
                                receiveBufferSize: 'bytes',
                                sendBufferSize: 'bytes',
                                acceptFilter: 'string',
                                deferred: false,
                                bind: false,
                                ip6: false,
                                reuseport: false,
                                keepAlive: false
                            }
                        ]
                    },
                    ssl: {
                        file: 'string',
                        key: 'string'
                    },
                    allowOrDeny: [
                        {
                            type: 'allow/deny',
                            rule: 'String'
                        }
                    ],
                    errorPages: [
                        {
                            httpCode: 'String',
                            redirectTo: 'String',
                            responseCode: 'String'
                        }
                    ],
                    errorLog: {
                        path: 'String',
                        level: 'String'
                    },
                    accessLog: {
                        useDefaultFormat: false,
                        name: 'String',
                        format: 'String'
                    }



                }
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
                this.serverForm.domain.nameList.push(this.serverForm.domain.input)
                this.serverForm.domain.input = ''
            },
            /* 保存配置项 */
            saveConfig(configName) {
                console.log(configName)
            },
            /* 关闭配置项 */
            closeConfig (configName) {
                console.log(configName)
            }
        },
        mounted() {

           /* setTimeout(() => {
                this.serverForm.domain = {
                    nameList : [ '123']
                }
            },100)*/
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
    /deep/.ivu-form-item-content{
       /* margin-top: 0 !important;
        position: relative;

        padding: 10px 40px 10px;
        border-bottom: 1px solid #e2e2e2!important;
        background-color: #f3f3f3;
        transition: border-color 0.1s linear, background-color 0.1s linear;*/
        margin-top: 0!important;
        border-bottom: none!important;
        padding-bottom: 0 !important;
       // margin: 0px -40px !important;
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
    .form-item-wrap{
        flex: 1;
        width: 100%;
        display: flex;
        border-bottom: 1px solid #ccc;
        padding-bottom: 5px;
        .input{
            flex: 1;
        }

        /deep/.ivu-input{

            //
            border-radius: 0;
            &:focus{
                //  border-bottom: 1px solid #666;
            }
        }

    }
    .name-list{
        .tag{
            margin-right: 10px;
        }
    }
</style>
