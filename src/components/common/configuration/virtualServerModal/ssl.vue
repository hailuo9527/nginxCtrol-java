<template>
    <my-form-item  :title="title"
                   @closeConfig = "closeConfig"
                   @saveConfig = "saveConfig"
                   @cancel = "cancel"
                   @edit="edit"
                   :modify="modify"
                   :open = "form.ssl_certificate_state"
                   :valid="valid"
                   info="Specify the path to the file containing server certificate. The secret key can be placed in the certificate file or defined separately. Both the certificate and the key should be in the PEM format.">

        <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
            <div class="ctrl-edit-item__note">
                Please enable SSL in "Listening Address and Port" and make sure you have manually uploaded both the certificate and the key to the server.
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
                Please enable SSL in "Listening Address and Port" and make sure you have manually uploaded both the certificate and the key to the server.
            </div>
            <div class="ctrl-edit-properties__row">
                <span class="label">FILE</span>
                <span class="value">{{form.ssl_file}}</span>
            </div>
            <div class="ctrl-edit-properties__row">
                <span class="label">KEY</span>
                <span class="value">{{form.ssl_file}}</span>
            </div>
        </div>
    </my-form-item>
</template>

<script>
    import mixin from '../mixins'
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

        },

        mounted() {

        }
    }
</script>
<style lang="less" scoped>
    @import "../modal-form";
</style>
