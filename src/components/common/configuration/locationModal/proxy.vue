<template>
    <my-form-item  :title="title"
                   @closeConfig = "closeConfig"
                   @saveConfig = "saveConfig"
                   @cancel = "cancel"
                   @edit="edit"
                   :modify="modify"
                   :open = "form.proxy_state"
                   :valid="valid"
                   :disabled="disabled"
                   :info="info">
        <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">

            <Form ref="form" :model="form" :rules="formRules"    @submit.native.prevent>
                <FormItem label="" class="line-form-item" prop="proxy_url">
                    <Input placeholder="URL" v-model.trim="form.proxy_url"></Input>
                </FormItem>
                <div  class="inline-form-item proxy">
                    <span class="proxy_label">HEADERS</span>
                    <div class="proxy_wrapper">
                        <div class="ctrl-edit-item ctrl-edit-item_edit mulity" v-for="(item, index) in form.ngcLocationHeaders">

                            <FormItem label="" class="line-form-item" prop="headers_key">
                                <Input placeholder="Header" v-model.trim="item.headers_key"></Input>
                            </FormItem>
                            <FormItem label="" class="line-form-item" prop="headers_value">
                                <Input placeholder="Value" v-model.trim="item.headers_value"></Input>
                            </FormItem>

                            <div class="item-body-remove" >
                                <Icon type="ios-trash" class="remove-icon" @click="removeList(form.ngcLocationHeaders,index)" size="20"/>
                            </div>

                        </div>
                        <div class="add-listen" @click="addHeader">
                            <Icon class="icon" size="22" type="ios-add-circle-outline" />
                            <span class="tip">Add header</span>
                        </div>
                    </div>

                </div>
                <div  class="inline-form-item ">
                    <div class="buffer">
                        <FormItem label="BUFFERING" class="line-form-item">
                            <i-switch size="small" v-model="form.buffering_state">
                            </i-switch>
                        </FormItem>
                        <div class="buffer_sub" v-if="form.buffering_state">
                            <FormItem  class="line-form-item">
                                <i-switch size="small" v-model="form.allow_to_buffer_on_disk_state">
                                </i-switch>
                                <span style="color: #666; margin-left: 10px">Allow to buffer on disk</span>
                            </FormItem>

                        </div>
                    </div>


                </div>
                <FormItem label="HTTP VERSION" class="inline-form-item">
                    <Select v-model="form.http_version">
                        <Option value="1.1">1.1</Option>
                        <Option value="1.0">1.0</Option>
                    </Select>
                </FormItem>
                <FormItem label="CONNECT TIMEOUT" class="inline-form-item" prop="connect_timeout">
                    <Input  placeholder="time" v-model.trim="form.connect_timeout"></Input>
                </FormItem>
                <FormItem label="CONNECT TIMEOUT" class="inline-form-item">
                    <i-switch size="small" v-model="form.intercept_errors_state">
                    </i-switch>
                </FormItem>

            </Form>

        </div>

        <div slot="show" class="ctrl-edit-item">
            <div class="show-panel-title">{{form.proxy_url}}</div>
            <div class="show-panel">
                <div class="show-panel-item">
                    <div class="show-panel-item-left">
                        <span>HEADERS</span>
                    </div>
                    <div class="show-panel-item-right">
                        <div class="ctrl-edit-item" v-for="(item, index) in form.ngcLocationHeaders">
                            <div class="ctrl-edit-properties__row">
                                <span class="label">{{item.headers_key}}</span>
                                <span class="value">{{item.headers_value}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="show-panel-item">
                    <div class="show-panel-item-left">
                        <span>BUFFERING</span>
                    </div>
                    <div class="show-panel-item-right">
                        <span>{{form.buffering_state? 'on': 'off'}}</span>
                    </div>
                </div>
                <div class="show-panel-item">
                    <div class="show-panel-item-left">
                        <span>WRITE ON DISK</span>
                    </div>
                    <div class="show-panel-item-right">
                        <span>{{form.allow_to_buffer_on_disk_state? 'on': 'off'}}</span>
                    </div>
                </div>
                <div class="show-panel-item">
                    <div class="show-panel-item-left">
                        <span>HTTP VERSION</span>
                    </div>
                    <div class="show-panel-item-right">
                        <span>{{form.http_version}}</span>
                    </div>
                </div>
                <div class="show-panel-item">
                    <div class="show-panel-item-left">
                        <span>CONNECT TIMEOUT</span>
                    </div>
                    <div class="show-panel-item-right">
                        <span>{{form.connect_timeout}}</span>
                    </div>
                </div>
                <div class="show-panel-item" v-if="form.intercept_errors_state">
                    <div class="show-panel-item-left">
                        <span>CONNECT TIMEOUT</span>
                    </div>
                    <div class="show-panel-item-right">
                        <span>{{form.intercept_errors_state? 'on': 'off'}}</span>
                    </div>
                </div>
            </div>
        </div>
    </my-form-item>
</template>

<script>
    import mixin from '../mixins'
    import emptyConfig from "../emptyConfig";
    export default {
        mixins: [mixin],
        data () {
            const number = { type: 'number', message: '请输入数字', trigger: 'blur',
                transform(value) {
                    return Number(value);
                }
            }
            const proxyUrl = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('不能为空'))
                }else {
                    let reg = /(http|https):\/\/([\w.]+\/?)\S*/
                    if(!reg.test(value)){
                        callback(new Error('请输入正确的URL'))
                    }else {
                        callback()
                    }
                }


            }

            return {
                title: 'PROXY',
                info: 'Proxy requests to upstream servers.',
                formRules: {
                    proxy_url: [
                        { validator: proxyUrl }
                    ],
                    headers_key: [
                        {required: true, message:'不能为空'}
                    ],
                    headers_value: [
                        { required: true, message: '不能为空' }
                    ],
                    connect_timeout: [
                        number
                    ]
                },
            }
        },
        computed: {

        },
        methods: {
            addHeader() {
                let json = {
                    headers_key: '',
                    headers_value: '',
                }
                this.form.ngcLocationHeaders.push(json)
            },
            removeList(arr, index) {
                arr.splice(index, 1)
            },
            /* 开关变化时 */
            closeConfig(data){
                if (!data){
                    this.resetConfig(emptyConfig.ngcVirtualServers[0].ngcLocations[0])
                } else{
                    this.form.proxy_state = data
                }

            },
        },

    }
</script>
<style lang="less" scoped>
    @import "../modal-form";
</style>
