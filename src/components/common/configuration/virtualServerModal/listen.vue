<template>
    <my-form-item  :title="title"
                   @closeConfig = "closeConfig"
                   @saveConfig = "saveConfig"
                   @cancel = "cancel"
                   @edit="edit"
                   :open="true"
                   :modify="modify"
                   :valid="valid"
                   :important="true"
                   info="Address and port (IPv4 or IPv6) or UNIX domain socket path on which the server will accept requests.">

        <div slot="edit">
            <div :key="index" v-for="(item, index) in form.ngcListenings" class="ctrl-edit-item ctrl-edit-item_edit mulity">

                <div class="item-body">
                    <Form ref="form" :model="form.ngcListenings[index]" :rules="formRules"    @submit.native.prevent>
                        <FormItem class="line-form-item" prop="listening_address_port">
                            <Input v-model.trim="item.listening_address_port" placeholder="192.168.0.1:80"></Input>
                        </FormItem>
                        <FormItem label="DEFAULT SERVER" class="aline-center">
                            <i-switch  v-model="item.default_server_state">
                            </i-switch>
                        </FormItem>
                        <FormItem label="SSL" class="aline-center">
                            <i-switch v-model="item.ssl_state" >
                            </i-switch>
                        </FormItem>
                        <FormItem label="HTTP/2" class="aline-center">
                            <i-switch v-model="item.http2_state" >
                            </i-switch>
                        </FormItem>
                        <FormItem label="PROXY PROTOCOL" class="aline-center">
                            <i-switch v-model="item.proxy_protocol_state"  >
                            </i-switch>
                        </FormItem>
                        <expandPanel>
                            <FormItem label="FIB" class="inline-form-item" prop="fib">
                                <Input  placeholder="number" v-model.trim="item.fib"></Input>
                            </FormItem>
                            <FormItem label="TCP FAST OPEN" class="inline-form-item" prop="tcp_fast_open">
                                <Input  placeholder="number" v-model.trim="item.tcp_fast_open"></Input>
                            </FormItem>
                            <FormItem label="BACKLOG" class="inline-form-item" prop="backlog">
                                <Input  placeholder="number" v-model.trim="item.backlog"></Input>
                            </FormItem>
                            <FormItem label="RECEIVE BUFFER SIZE" class="inline-form-item" prop="receive_buffer_size">
                                <Input  placeholder="bytes" v-model.trim="item.receive_buffer_size"></Input>
                            </FormItem>
                            <FormItem label="SEND BUFFER SIZE" class="inline-form-item" prop="send_buffer_size">
                                <Input placeholder="bytes" v-model.trim="item.send_buffer_size"></Input>
                            </FormItem>
                            <FormItem label="ACCEPT FILTER" class="inline-form-item" prop="accept_filter">
                                <Select v-model="item.accept_filter">
                                    <Option value="dataready">dataready</Option>
                                    <Option value="httpready">httpready</Option>
                                    <Option value="none">none</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="DEFERRED" class="aline-center">
                                <i-switch  v-model="item.deferred_state" >
                                </i-switch>
                            </FormItem>
                            <FormItem label="BIND" class="aline-center">
                                <i-switch v-model="item.bind_state" >
                                </i-switch>
                            </FormItem>
                            <FormItem label="ACCEPT IPV6 ONLY" class="aline-center">
                                <i-switch v-model="item.accept_ipv6_only_state">
                                </i-switch>
                            </FormItem>
                            <FormItem label="REUSEPORT" class="aline-center">
                                <i-switch v-model="item.reuseport_state" >
                                </i-switch>
                            </FormItem>
                            <FormItem label="TCP KEEPALIVE" class=" inline-form-item">
                                <i-switch v-model="item.tcp_keepalive_state" >
                                </i-switch>
                                <div v-if="item.tcp_keepalive_state" class="radio-option">
                                    <RadioGroup v-model="tcp_keepalive_value">
                                        <Radio label="on">
                                            <span>on</span>
                                        </Radio>
                                        <Radio label="off">
                                            <span>off</span>
                                        </Radio>
                                        <Radio label="socket">
                                            <span>socket option</span>
                                        </Radio>
                                    </RadioGroup>
                                    <Input  placeholder="bytes" v-model.trim="item.socket_option_value"></Input>
                                </div>
                            </FormItem>
                        </expandPanel>
                    </Form>

                </div>
                <div class="item-body-remove" v-if="form.ngcListenings.length>1">
                    <Icon type="ios-trash" class="remove-icon" @click="removeList(form.ngcListenings,index)" size="20"/>
                </div>
            </div>
            <div class="add-listen" @click="addListen">
                <Icon class="icon" size="22" type="ios-add-circle-outline" />
                <span class="tip">Add listen</span>
            </div>
        </div>


        <div slot="show" >
            <div class="ctrl-edit-item" :key="index" v-for="(item, index) in form.ngcListenings">
                <div class="ctrl-edit-item__string">{{item.listening_address_port}}</div>
                <div class="ctrl-edit-item__tags">
                    <span class="tags black" v-if="item.default_server_state">default_server</span>
                    <span class="tags" v-if="item.ssl_state">ssl</span>
                    <span class="tags" v-if="item.http2_state">http2</span>
                    <span class="tags" v-if="item.proxy_protocol_state">proxy_protocol</span>
                    <span class="tags" v-if="item.fib">setfib={{item.fib}}</span>
                    <span class="tags" v-if="item.tcp_fast_open">fastopen={{item.tcp_fast_open}}</span>
                    <span class="tags" v-if="item.backlog">backlog={{item.backlog}}</span>
                    <span class="tags" v-if="item.receive_buffer_size">rcvbuf={{item.receive_buffer_size}}</span>
                    <span class="tags" v-if="item.send_buffer_size">sndbuf={{item.send_buffer_size}}</span>
                    <span class="tags" v-if="item.accept_filter">accept_filter={{item.accept_filter}}</span>
                    <span class="tags" v-if="item.deferred_state">deferred</span>
                    <span class="tags" v-if="item.bind_state">bind</span>
                    <span class="tags" v-if="item.reuseport_state">reuseport</span>
                    <span class="tags" v-if="item.tcp_keepalive_state">
                        so_keepalive={{item.socket_option_value }}
                    </span>
                </div>
            </div>
        </div>
    </my-form-item>
</template>

<script>
    import mixin from '../mixins'
    import expandPanel from '../../expandPanel'
    import emptyConfig from '../emptyConfig'
    export default {
        mixins: [mixin],
        components: {
             expandPanel
        },
        data () {
            const number = { type: 'number', message: '请输入数字', trigger: 'blur',
                transform(value) {
                    return Number(value);
                }
            }
            return {
                title: 'LISTENING ADDRESS AND PORT',
                formRules: {
                    listening_address_port: [
                        { required: true, message: '不能为空' },
                        number

                    ],
                    fib: [
                        number
                    ],
                    tcp_fast_open: [
                        number
                    ],
                    backlog: [
                        number
                    ],
                    receive_buffer_size: [
                        number
                    ],
                    send_buffer_size: [
                        number
                    ]

                },
            }
        },
        methods: {
            addListen() {
                let json = this.copyJson(emptyConfig.ngcVirtualServers[0].ngcListenings[0])
                this.form.ngcListenings.push(json)
            },
            removeList(arr, index) {
                arr.splice(index, 1)
            },

            /* 保存配置项 */
            saveConfig() {
                let flag = true
                for(let item of this.$refs['form']){
                    item.validate(valid => {
                        if (!valid) {
                            flag = false
                        }
                    })
                }
                this.valid = flag
                if (flag){
                    this.$emit('readyOk', this.form)
                } else {
                    this.$Message.error('验证失败')
                }
            },

        },
    }
</script>
<style lang="less" scoped>
    @import "../modal-form";
    .radio-option{
        display: flex;
        align-items: flex-end;

        /deep/.ivu-radio-group{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    }
</style>
