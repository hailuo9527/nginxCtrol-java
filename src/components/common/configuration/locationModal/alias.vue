<template>
    <my-form-item  :title="title"
                   @closeConfig = "closeConfig"
                   @saveConfig = "saveConfig"
                   @cancel = "cancel"
                   @edit="edit"
                   :modify="modify"
                   :disabled="disabled"
                   :open = "form.alias_state"
                   :valid="valid"
                   :info="info">
        <div slot="edit">

            <Form ref="form" :model="form" :rules="formRules"    @submit.native.prevent>

                <div  class="ctrl-edit-item ctrl-edit-item_edit">
                    <FormItem class="line-form-item" prop="alias_path">
                        <Input  placeholder="path" v-model.trim="form.alias_path"></Input>
                    </FormItem>
                </div>
            </Form>

        </div>

        <div slot="show">
            <div  class="ctrl-edit-item">
                <div class="ctrl-edit-item__string">{{form.alias_path}}</div>
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

            return {
                title: 'ALIAS',
                info: '直接为静态内容提供服务时，为文件系统上的URI路径定义一个别名。',
                formRules: {
                    alias_path: [
                        { required: true, message: '不能为空' }
                    ]
                },
            }
        },
        computed: {

        },
        methods: {
            /* 开关变化时 */
            closeConfig(data){

                if (!data){
                    this.resetConfig(emptyConfig.ngcVirtualServers[0].ngcLocations[0])
                } else{
                    this.form.alias_state = data
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
