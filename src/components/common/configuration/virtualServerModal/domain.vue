<template>
    <my-form-item  :title="title"
                   @closeConfig = "closeConfig"
                   @saveConfig = "saveConfig"
                   @cancel = "cancel"
                   @edit="edit"
                   :modify="modify"
                   :open = "form.domain_names_state"
                   :valid="valid"
                   info="此虚拟服务器提供服务的域名。这与NGINX配置中的server_name指令相对应。">
        <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
            <Form ref="form" :model="form" :rules="formRules"    @submit.native.prevent>
                <FormItem class="input line-form-item with-button" prop="domain_name">
                    <Button  icon="md-close" class="tag"
                             :key="index"
                             v-if="item"
                             @click="removeTag(item)"
                             v-for="(item, index) in form.domain_name.split(',')">{{item}}</Button>
                    <Input  v-model.trim="form.domainName" @on-blur="addDomainName" @on-enter="addDomainName" @on-keydown="keyDown" placeholder="name"></Input>
                </FormItem>
            </Form>

            <div class="ctrl-edit-item__note">在名称前面加上 ~ 以使用正则表达式</div>
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
    import mixin from '../mixins'
    import emptyConfig from "../emptyConfig";
    export default {
        mixins: [mixin],
        name: 'domain',
        data () {
            const domain = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('至少需要一个域名！'));
                }
                callback();
            };
            return {
                title: 'server name',
                formRules: {
                    domain_name: [
                        { validator: domain, trigger: 'blur' }
                    ],
                },
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
                this.form.domain_name = arr.join(',')
                this.form.domainName = ''
            },
            removeTag(str) {
                let arr = this.form.domain_name.split(',')
                let index = arr.indexOf(str)
                arr.splice(index, 1)
                this.form.domain_name = arr.join(',')
            },
            /* 开关变化时 */
            closeConfig(data){

                if (!data){
                    this.resetConfig(emptyConfig.ngcVirtualServers[0])
                } else{
                    this.form.domain_names_state = data
                }


            },
            keyDown(e) {
                if (e.code === 'Space') {
                    this.addDomainName()
                }
            }
        },

        mounted() {
            // console.log(this.form)
        }
    }
</script>
<style lang="less" scoped>
    @import "../modal-form";
</style>
