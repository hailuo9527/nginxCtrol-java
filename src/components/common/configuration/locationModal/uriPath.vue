<template>
    <my-form-item  :title="title"
                   @closeConfig = "cancel"
                   @saveConfig = "saveConfig"
                   @cancel = "cancel"
                   @edit="edit"
                   :modify="modify"
                   :open = "form.access_log_state"
                   :valid="valid"
                   :info="info">
        <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">

            <Form ref="form" :model="form" :rules="formRules"    @submit.native.prevent>
                <FormItem label="" class="inline-form-item options">
                    <Select >
                        <Option value="dataready">prefix</Option>
                        <Option value="httpready">exact</Option>
                        <Option value="httpready">regex</Option>
                        <Option value="httpready">regex(case-insensitive)</Option>
                    </Select>
                    <span class="options-label">match with</span>
                    <Input placeholder="/"></Input>
                </FormItem>

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
        name: 'URI-PATH/ROUTE',
        data () {

            return {
                title: 'URI-PATH/ROUTE',
                info: 'Location definitions are central to the request routing mechanism in NGINX. Location specifies whether NGINX will proxy a particular request or serve it directly.',
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
