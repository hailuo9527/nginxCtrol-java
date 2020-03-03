<template>
    <my-form-item  :title="title"
                   @closeConfig = "cancel"
                   @saveConfig = "saveConfig"
                   @cancel = "cancel"
                   @edit="edit"
                   :modify="modify"
                   :open = "form.access_log_state"
                   :valid="valid"
                   nfo="Enables access log for this virtual server. Log can be found at /var/log/nginx/access.log">
        <div slot="edit">
            <div  class="ctrl-edit-item ctrl-edit-item_edit">

                <div class="item-body">
                    <Form ref="form" :model="form" :rules="formRules"    @submit.native.prevent>
                        <FormItem label="USE DEFAULT FORMAT" class="aline-center">
                            <i-switch >
                            </i-switch>
                        </FormItem>
                        <FormItem class="line-form-item">

                            <Input placeholder="name"></Input>
                        </FormItem>
                        <FormItem class="line-form-item">
                            <Input placeholder="format"></Input>
                        </FormItem>

                    </Form>

                </div>

            </div>
        </div>

        <div slot="show">
            <div  class="ctrl-edit-item ">
                <div class="ctrl-edit-properties__row">
                    <span class="label">PATH</span>
                    <span class="value">/var/log/nginx/access.log</span>
                </div>
                <div class="ctrl-edit-properties__row">
                    <span class="label">LEVEL</span>
                    <span class="">324</span>
                </div>
            </div>
        </div>
    </my-form-item>
</template>

<script>
    import mixin from '../mixins'
    import draggable from 'vuedraggable'
    export default {
        mixins: [mixin],
        data () {

            return {
                title: 'ACCESS LOG',
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
