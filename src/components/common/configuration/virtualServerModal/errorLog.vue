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

        },

        mounted() {

        }
    }
</script>
<style lang="less" scoped>
    @import "../modal-form";
</style>
