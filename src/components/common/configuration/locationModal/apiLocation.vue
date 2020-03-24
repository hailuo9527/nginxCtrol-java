<template>
    <my-form-item  :title="title"
                   @closeConfig = "closeConfig"
                   @saveConfig = "saveConfig"
                   @cancel = "cancel"
                   @edit="edit"
                   :modify="modify"
                   :open = "form.apilocation_state"
                   :valid="valid"
                   :onlyShow="true"
                   :info="info">

        <div slot="show" class="ctrl-edit-item">
            <Form ref="form" :model="form" :rules="formRules"    @submit.native.prevent>
                <FormItem label="READ-ONLY" class="aline-center">
                    <i-switch v-model="form.read_only_state" @on-change="stateChange">
                    </i-switch>
                </FormItem>

            </Form>
        </div>
    </my-form-item>
</template>

<script>
    import mixin from '../mixins'

    export default {
        mixins: [mixin],
        data () {

            return {
                title: 'USE AS NGINX API LOCATION',
                info: '启用NGINX API模块提供的只读restapi。确保使用allow/deny限制对API的访问。有关更多详细信息，请参阅NGINX文档。',

                formRules: {

                },
            }
        },
        computed: {

        },
        methods: {
            /* 开关变化时 */
            closeConfig(data){
                this.form.apilocation_state = data
                this.$emit('readyOk',this.form)
                /*if (!data){
                    this.$emit('readyOk',this.form)
                }*/

            },
            stateChange(data) {
                this.$emit('readyOk',this.form)
            }

        },

        mounted() {

        }
    }
</script>
<style lang="less" scoped>
    @import "../modal-form";
</style>
