<template>
    <my-form-item  title="DOMAIN NAMES"
                   @closeConfig = "cancel('domain')"
                   @saveConfig = "saveConfig('domain')"
                   @cancel = "cancel('domain')"
                   :modify="modify"
                   :open = "form.domain_names_state"
                   info="Domain names that are served by this virtual server. This corresponds with the server_name directive in NGINX configuration.">
        <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
            <Form ref="form" :model="form" :rules="formRules"    @submit.native.prevent>
                <FormItem class="input line-form-item with-button" prop="domain_name">
                    <Button  icon="md-close" class="tag"
                             :key="index"
                             v-if="item"
                             @click="removeTag(item)"
                             v-for="(item, index) in form.domain_name.split(',')">{{item}}</Button>
                    <Input  v-model.trim="form.domainName" @on-blur="addDomainName" @on-enter="addDomainName" placeholder="name"></Input>
                </FormItem>
            </Form>

            <div class="ctrl-edit-item__note">Prefix the name with ~ to use a regular expression</div>
        </div>

        <div slot="show" class="ctrl-edit-item">
            <div class="name-list">
                              <span  class="tag" :key="index"
                                     v-for="(item, index) in form.domain_name.split(',')">{{item}}</span>
            </div>

        </div>
    </my-form-item>
</template>

<script>
    import myFormItem from '../form-item'
    export default {
        props: {
            data: {
                type: Object,
                default: () => {}
            },
            modify: false,
        },
        components: {
            myFormItem
        },
        data () {
            const domain = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('至少需要一个域名！'));
                }
                callback();
            };
            return {
                form: {},
                formRules: {
                    domain_name: [
                        { validator: domain, trigger: 'blur' }
                    ],
                },
            }
        },
        watch: {
            data : {
                handler(nv, ov){
                    /* 拷贝对象 */
                    this.form = this.copyJson(nv)
                },
                immediate: true
            }
        },
        computed: {

        },
        methods: {
            addDomainName () {
                if(this.form.domainName === "") return
                let arr = this.form.domain_name.split(',')
                arr.push(this.form.domainName)
                arr.map((item, index)=> {
                    if (!item) arr.splice(index,1)
                })
                console.log(arr)
                this.form.domain_name = arr.join(',')
                this.form.domainName = ''
            },
            removeTag(str) {
                let arr = this.form.domain_name.split(',')
                let index = arr.indexOf(str)
                arr.splice(index, 1)
                this.form.domain_name = arr.join(',')
            },

            /* 保存配置项 */
            saveConfig(configName) {
                // console.log(configName)
                switch (configName) {
                    case 'domain' :
                        this.$refs['form'].validateField('domain_name', (errorMsg)=>{
                            console.log(errorMsg)

                        })
                }
            },
            /* 还原配置 */
            backConfig(obj,target){
                Object.keys(obj).map(item => {
                    this.form[item] = target[item]
                })
            },
            /* 取消配置修改 */
            cancel(configName,target) {
                target = target || this.data
                switch (configName) {
                    case 'domain':
                        let obj = {
                            domain_names_state: false,
                            domain_name: ''
                        }
                        this.backConfig(obj,target)
                        break
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
