<template>
    <my-form-item  :title="title"
                   @closeConfig = "closeConfig"
                   @saveConfig = "saveConfig"
                   @cancel = "cancel"
                   @edit="edit"
                   :modify="modify"
                   :open = "form.error_log_state"
                   :valid="valid"
                   :onlyShow="true"
                   info="Define the response that will be shown for specific errors.">
        <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
            123
        </div>
        <div slot="show">
            <div  class="ctrl-edit-item ">
                <div class="ctrl-edit-properties__row">
                    <span class="label">PATH</span>
                    <span class="value">{{form.error_log_path}}</span>
                </div>
                <div class="ctrl-edit-properties__row">
                    <span class="label">LEVEL</span>
                    <span class="value">{{form.error_log_level}}</span>
                </div>
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
                title: 'ERROR LOG',
                formRules: {

                },
            }
        },
        computed: {

        },
        methods: {
            /* 开关变化时 */
            closeConfig(data){
                this.form.error_log_state = data
                if (!data){
                    this.form.error_log_path = ''
                    this.form.error_log_level = ''
                } else {
                    this.form.error_log_path = this.data.error_log_path
                    this.form.error_log_level = this.data.error_log_level

                }
                this.$emit('readyOk', this.form)
            },
        },

        mounted() {

        }
    }
</script>
<style lang="less" scoped>
    @import "../modal-form";
</style>
