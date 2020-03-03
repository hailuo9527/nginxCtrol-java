<template>
    <my-form-item  :title="title"
                   @closeConfig = "cancel"
                   @saveConfig = "saveConfig"
                   @cancel = "cancel"
                   @edit="edit"
                   :modify="modify"
                   :open = "form.error_pages_state"
                   :valid="valid"
                   info="Define the response that will be shown for specific errors.">
        <div slot="edit">
            <div :key="index" v-for="(item, index) in form.ngcErrorPages"  class="ctrl-edit-item ctrl-edit-item_edit mulity">

                <div class="item-body">
                    <Form ref="form" :model="item" :rules="formRules" :hide-required-mark="true"  @submit.native.prevent>
                        <FormItem label="HTTP CODES" class="inline-form-item full-input" prop="httpCodes">
                            <Button  icon="md-close" class="tag"
                                     :key="codeIndex"
                                     v-if="code"
                                     @click="removeTag(item, codeIndex)"
                                     v-for="(code, codeIndex) in item.http_codes.split(',')">{{code}}</Button>
                            <Input  v-model.trim="item.httpCodes"  @on-enter="addHttpCode(index)" placeholder="code"></Input>
                        </FormItem>
                        <FormItem label="REDIRECT TO" class="inline-form-item full-input" prop="redirect_to">
                            <Input placeholder="URL | URI | variable" v-model.trim="item.redirect_to"></Input>
                        </FormItem>
                        <FormItem label="RESPONSE CODE" class="inline-form-item full-input"  prop="response_code">
                            <Input placeholder="=code" v-model="item.response_code"></Input>
                        </FormItem>
                    </Form>


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

        <div slot="show">
            <div  class="ctrl-edit-item error-pages">
                <span class="error-pages-codes">404</span> will show <span class="error-pages-redirect">111</span> with response <span class="error-pages-response">404</span>
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
            const httpCodesRule = (rule, value, callback) => {
                console.log(value)
                if (!value) callback()
                let reg = /(^1[0-1]{2}$)|(^2[0-6]{2}$)|(^3[0-7]{2}$)|(^4[0-17]{2}$)|(^5[0-5]{2}$)/
                console.log()
                if (!reg.test(value)){
                    callback(new Error('请输入正确的状态码'))
                }else {
                    callback()
                }

                callback()
            }
            const resCodesRule = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('不能为空'));
                } else {

                }
                callback()
            }
            return {
                title: 'ERROR PAGES',

                formRules: {
                    httpCodes: [

                        { validator: httpCodesRule }
                    ],
                    redirect_to: [
                        { required: 'true', message:'不能为空' }
                    ],
                    response_code: [
                        { validator: resCodesRule, trigger: 'blur' }
                    ]
                },
            }
        },
        computed: {

        },
        methods: {
            addErrorPage() {
                //console.log(this.form.ngcErrorPages)
                let json = this.copyJson(emptyConfig.ngcVirtualServers[0].ngcErrorPages[0])
                this.form.ngcErrorPages.push(json)
            },
            addHttpCode (index) {
                if(this.form.ngcErrorPages[index].httpCodes === "") return
                this.$refs['form'][index].validateField('httpCodes',(valid) => {
                    if (!valid) {
                        let arr = this.form.ngcErrorPages[index].http_codes.split(',')
                        arr.push(this.form.ngcErrorPages[index].httpCodes)
                        arr.map((item, key)=> {
                            if (!item) arr.splice(key,1)
                        })
                        this.form.ngcErrorPages[index].http_codes = arr.join(',')
                        this.form.ngcErrorPages[index].httpCodes = ''
                    }
                });

            },
            removeTag(str,index) {
                let arr = this.form.ngcErrorPages[index].http_codes.split(',')
                let i = arr.indexOf(str)
                arr.splice(i, 1)
                this.form.ngcErrorPages[index].http_codes = arr.join(',')
            }
        },

        mounted() {

        }
    }
</script>
<style lang="less" scoped>
    @import "../modal-form";
</style>
