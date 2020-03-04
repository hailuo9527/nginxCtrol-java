<template>
    <my-form-item  :title="title"
                   @closeConfig = "closeConfig"
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
                            <Input  v-model.trim="item.httpCodes" @on-blur="addHttpCode(index)"  @on-enter="addHttpCode(index)" placeholder="code"></Input>
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
                    <Icon type="ios-trash" class="remove-icon" @click="removeList(form.ngcErrorPages,index)" size="20"/>
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
                if (!value){
                    if (this.form.ngcErrorPages[this.activeForm].http_codes === ""){
                        callback(new Error('不能为空'))
                    }
                }else {
                    let reg = /(^10[0-2]$)|(^20[0-6]$)|(^30[0-7]$)|(^4[0-1][0-7]$)|(^50[0-5]$)/

                    if (!reg.test(value)){
                        callback(new Error('请输入正确的状态码'))
                    }else {
                        callback()
                    }
                }


                callback()
            }
            const resCodesRule = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('不能为空'));
                } else {
                    let str = value.slice(0,1)
                    if (str !== '='){
                        callback(new Error('请输入正确的格式, 例如‘ =XXX’'));
                    }
                }
                callback()
            }
            return {
                title: 'ERROR PAGES',
                activeForm: 0,
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
                        this.activeForm = index
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
            },
            removeList(arr, index) {
                arr.splice(index, 1)
            },
            /* 保存配置项 */
            saveConfig() {
                //console.log(this.$refs['form'])
                let flag = true
                for(let item of this.$refs['form']){
                    item.validate(valid => {
                        console.log(valid)
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
            /* 开关变化时 */
            closeConfig(data){
                if (!data){
                    this.resetConfig(emptyConfig.ngcVirtualServers[0])
                } else{
                    this.form.error_pages_state = data
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
