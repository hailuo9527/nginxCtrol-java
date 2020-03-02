<template>
    <my-form-item  title="ERROR LOG"
                   @closeConfig = "cancel"
                   @saveConfig = "saveConfig"
                   @cancel = "cancel"
                   @edit="edit"
                   :modify="modify"
                   :open = "form.error_log_state"
                   :valid="valid"
                   info="Define the response that will be shown for specific errors.">

        <div slot="show">
            <div  class="ctrl-edit-item ">
                <div class="ctrl-edit-properties__row">
                    <span class="label">PATH</span>
                    <span class="value">/var/log/nginx/error.log</span>
                </div>
                <div class="ctrl-edit-properties__row">
                    <span class="label">LEVEL</span>
                    <span class="value">ERROR</span>
                </div>
            </div>

        </div>
    </my-form-item>
</template>

<script>
    import mixin from '../mixins'

    export default {
        mixins: [mixin],
        name: 'error log',
        data () {

            return {
                formRules: {

                },
            }
        },
        computed: {

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
