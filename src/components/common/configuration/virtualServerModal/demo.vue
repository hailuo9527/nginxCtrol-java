<template>
    <my-form-item  :title="title"
                   @closeConfig = "closeConfig"
                   @saveConfig = "saveConfig"
                   @cancel = "cancel"
                   @edit="edit"
                   :modify="modify"
                   :disabled="disabled"
                   :open = "form.access_log_state"
                   :valid="valid"
                   :info="info">
        <div slot="edit">

            <Form ref="form" :model="form" :rules="formRules"    @submit.native.prevent>


            </Form>

        </div>

        <div slot="show">

        </div>
    </my-form-item>
</template>

<script>
    import mixin from '../mixins'

    export default {
        mixins: [mixin],
        data () {

            return {
                title: '',
                info: '',
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
