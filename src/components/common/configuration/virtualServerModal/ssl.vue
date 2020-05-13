<template>
    <my-form-item  :title="title"
                   @closeConfig = "closeConfig"
                   @saveConfig = "saveConfig"
                   @cancel = "cancel"
                   @edit="edit"
                   :modify="modify"
                   :open = "form.ssl_certificate_state"
                   :valid="valid"
                   info="指定包含服务器证书的文件的路径。密钥可以放在证书文件中，也可以单独定义。证书和密钥都应采用PEM格式。">

        <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
            <div class="ctrl-edit-item__note">
                请在“侦听地址和端口”中启用SSL，并确保已将证书和密钥手动上载到服务器。
            </div>
            <Form ref="form" :model="form" :rules="formRules" :hide-required-mark="true"   @submit.native.prevent>
                <FormItem label="FILE" class="line-form-item" prop="ssl_file">
                    <Input v-model.trim="form.ssl_file" placeholder="certs/myserver.crt"></Input>
                </FormItem>
                <FormItem label="KEY" class="line-form-item" prop="ssl_key">
                    <Input v-model.trim="form.ssl_key" placeholder="certs/myserver.key"></Input>
                </FormItem>
            </Form>
        </div>

        <div slot="show" class="ctrl-edit-item">
            <div class="ctrl-edit-item__note">
                请在“侦听地址和端口”中启用SSL，并确保已将证书和密钥手动上载到服务器。
            </div>
            <div class="ctrl-edit-properties__row">
                <span class="label">FILE</span>
                <span class="value">{{form.ssl_file}}</span>
            </div>
            <div class="ctrl-edit-properties__row">
                <span class="label">KEY</span>
                <span class="value">{{form.ssl_key}}</span>
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
            return {
                title: 'SSL CERTIFICATE',
                formRules: {
                    ssl_key: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    ssl_file: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            /* 开关变化时 */
            closeConfig(data){
                if (!data){
                    this.resetConfig(emptyConfig.ngcVirtualServers[0])
                } else{
                    this.form.ssl_certificate_state = data
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
