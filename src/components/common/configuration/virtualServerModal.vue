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
                        @readyOk = 'prepareConfig'
                ></listen>
                <ssl :modify="modify"
                     :data = "ssl"
                     @edit = "checkEditStatus"
                     @readyOk = 'prepareConfig'
                ></ssl>
                <allowDeny :modify="modify"
                           :data = "allow_deny"
                           @edit = "checkEditStatus"
                           @readyOk = 'prepareConfig'
                ></allowDeny>
                <errorPages :modify="modify"
                            :data = "errorPages"
                            @edit = "checkEditStatus"
                            @readyOk = 'prepareConfig'
                ></errorPages>
                <errorLog :modify="modify"
                          :data = "errorLog"
                          @edit = "checkEditStatus"
                          @readyOk = 'prepareConfig'
                ></errorLog>
                <accessLog :modify="modify"
                           :data = "accessLog"
                           @edit = "checkEditStatus"
                           @readyOk = 'prepareConfig'
                ></accessLog>


            </div>
            <div slot="footer">
                <Button @click="change(false)">取消</Button>
                <Button type="primary"  :loading="modal_loading" @click="handleSubmit">保存</Button>

            </div>
        </Modal>
    </div>

</template>
<script>
   /* import PopTip from '@/components/common/pop-tip'
    import myFormItem from './form-item'
    import expandPanel from '../expandPanel'*/

    import domain from './virtualServerModal/domain'
    import listen from './virtualServerModal/listen'
    import ssl from './virtualServerModal/ssl'
    import allowDeny from './virtualServerModal/allow_deny'
    import errorPages from './virtualServerModal/errorPages'
    import errorLog from './virtualServerModal/errorLog'
    import accessLog from './virtualServerModal/accessLog'
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
           domain, listen, ssl, allowDeny, errorPages, errorLog, accessLog
        },
        watch: {
            show (newVal, oldVal) {
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
                    this.serverForm = this.copyJson(nv)
                    this.domain = {
                        domain_names_state: this.serverForm.domain_names_state,
                        domain_name: this.serverForm.domain_name,
                    }
                    this.listen = {
                        ngcListenings: this.serverForm.ngcListenings
                    }
                    this.ssl = {
                        ssl_certificate_state: this.serverForm.ssl_certificate_state,
                        ssl_file: this.serverForm.ssl_file,
                        ssl_key: this.serverForm.ssl_key,
                    }
                    this.allow_deny = {
                        allow_deny_state: this.serverForm.allow_deny_state,
                        ngcAllowDenies: this.serverForm.ngcAllowDenies
                    }
                    this.errorPages = {
                        error_pages_state: this.serverForm.error_pages_state,
                        ngcErrorPages: this.serverForm.ngcErrorPages
                    }
                    this.errorLog = {
                        error_log_state: this.serverForm.error_log_state,
                        error_log_path: this.serverForm.error_log_path,
                        error_log_level: this.serverForm.error_log_level,
                    }
                    this.accessLog = {
                        access_log_state: false,
                        use_recommended_format_state: false,
                        access_log_name: this.serverForm.access_log_name,
                        access_log_path: this.serverForm.access_log_path,
                        access_log_format: this.serverForm.access_log_format,
                    }

                },
                immediate: true
            },

        },
        data () {

            return {
                modal_loading: false,
                model: false,
                serverForm: {},
                errorInfo: {},
                errorTip: {
                    show: false,
                    value: ''
                },
                flag: false,
                domain: {},
                listen: {},
                ssl: {},
                allow_deny: {},
                errorPages: {},
                errorLog: {},
                accessLog: {}

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
                    this.$emit('submit', this.serverForm)
                    this.change(false)
                }

            },
            /* 检查是否有未保存的配置项 */
            checkEditStatus(data){
                 console.log(data)
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
               // console.log(data)
                Object.keys(data).map(item => {
                    this.serverForm[item] = data[item] // 拿到修改过后的配置对象
                })
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
