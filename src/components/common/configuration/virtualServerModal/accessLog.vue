<template>
    <my-form-item  :title="title"
                   @closeConfig = "closeConfig"
                   @saveConfig = "saveConfig"
                   @cancel = "cancel"
                   @edit="edit"
                   :modify="modify"
                   :open = "form.access_log_state"
                   :valid="valid"
                   info="启用此虚拟服务器的访问日志。日志可以在/var/Log/nginx/access.Log中找到">
        <div slot="edit">
            <div  class="ctrl-edit-item ctrl-edit-item_edit">

                <div class="item-body">
                    <Form ref="form" :model="form" :rules="formRules"    @submit.native.prevent>
                        <FormItem label="使用默认格式" class="aline-center" >
                            <i-switch v-model="form.use_recommended_format_state" @on-change="changeStatus">
                            </i-switch>
                        </FormItem>
                        <FormItem class="line-form-item" prop="access_log_name">

                            <Input placeholder="name" v-model.trim="form.access_log_name" :disabled="form.use_recommended_format_state" > </Input>
                        </FormItem>
                        <FormItem class="line-form-item" prop="access_log_format">
                            <Input placeholder="format" v-model.trim="form.access_log_format"></Input>
                        </FormItem>

                    </Form>

                </div>

            </div>
        </div>

        <div slot="show">
            <div  class="ctrl-edit-item ">
                <div class="ctrl-edit-properties__row">
                    <span class="label">PATH</span>
                    <span class="value">{{form.access_log_path}}</span>
                </div>
                <div class="ctrl-edit-properties__row">
                    <span class="label">LOG FORMAT</span>
                    <span class="log-format">{{form.access_log_format}}</span>
                </div>
            </div>
        </div>
    </my-form-item>
</template>

<script>
    import mixin from '../mixins'
    import emptyConfig from '../emptyConfig'
    export default {
        mixins: [mixin],
        data () {
            const rule = (rule, value, callback) => {
                if (this.use_recommended_format_state){
                    callback()
                } else{
                    if (!value){
                        callback(new Error('不能为空'))
                    }
                }

                callback()
            }
            return {
                title: 'ACCESS LOG',
                formRules: {
                    access_log_name: [
                        { validator: rule }
                    ],
                    access_log_format: [
                        {validator: rule }
                    ]
                },
            }
        },
        watch: {

        },
        computed: {

        },
        methods: {
            changeStatus(status) {
                if (status){
                    this.form.access_log_format = '$time_local|$remote_addr|$request|nrsp=$status|$body_bytes_sent|$host|$request_time|$upstream_addr|ursp=$upstream_status|$upstream_response_time|$upstream_response_length|ucs=$upstream_cache_status|hr=$http_referer|hua=$http_user_agent|xf=$http_x_forwarded_for|sn=$server_name|ru=$remote_user'
                    this.form.access_log_name = 'controller_recommended_log_format'
                }else {
                    this.form.access_log_format = ''
                    this.form.access_log_name = ''
                }
            },
            /* 开关变化时 */
            closeConfig(data){

                if (!data){
                    this.resetConfig(emptyConfig.ngcVirtualServers[0])
                } else{
                    this.form.access_log_state = data
                }
            },
        },

        mounted() {

        }
    }
</script>
<style lang="less" scoped>
    @import "../modal-form";
</style>
