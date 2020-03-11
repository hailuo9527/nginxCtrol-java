<template>
    <my-form-item  :title="title"
                   @closeConfig = "closeConfig"
                   @saveConfig = "saveConfig"
                   @cancel = "cancel"
                   @edit="edit"
                   :modify="modify"
                   :open = "form.access_log_state"
                   :valid="valid"
                   info="Enables access log for this virtual server. Log can be found at /var/log/nginx/access.log">
        <div slot="edit">
            <div  class="ctrl-edit-item ctrl-edit-item_edit">

                <div class="item-body">
                    <Form ref="form" :model="form" :rules="formRules"    @submit.native.prevent>
                        <FormItem label="USE DEFAULT FORMAT" class="aline-center" >
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
                    <span class="">{{form.access_log_format}}</span>
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
                    this.form.access_log_format = '$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" "$http_x_forwarded_for" "$host" sn="$server_name" rt=$request_time ua="$upstream_addr" us="$upstream_status" ut="$upstream_response_time" ul="$upstream_response_length" cs=$upstream_cache_status'
                    this.form.access_log_name = 'super_log_format_recommended'
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
