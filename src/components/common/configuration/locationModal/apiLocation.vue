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
                info: 'Enable read-only REST API provided by the NGINX API module. Make sure to limit the access to the API using allow/deny. For more details, please refer to the NGINX documentation.',

                formRules: {

                },
            }
        },
        computed: {

        },
        methods: {
            closeConfig(data){
                 console.log(data)
                //this.form.apilocation_state = data
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
