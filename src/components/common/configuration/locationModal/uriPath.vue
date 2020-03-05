<template>
    <my-form-item  :title="title"
                   @closeConfig = "closeConfig"
                   @saveConfig = "saveConfig"
                   @cancel = "cancel"
                   @edit="edit"
                   :modify="modify"
                   :open="true"
                   :valid="valid"
                   :important="true"
                   :info="info">
        <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">

            <Form ref="form" :model="form" :rules="formRules" class="inlineForm"    @submit.native.prevent>
                <FormItem label="" class="inline-form-item options" prop="url_path_route_key">
                    <Select v-model="form.url_path_route_key">
                        <Option value="^~">prefix</Option>
                        <Option value="=">exact</Option>
                        <Option value="~">regex</Option>
                        <Option value="~*">regex(case-insensitive)</Option>
                    </Select>

                </FormItem>
                <span class="options-label">match with</span>
                <FormItem label="" class="inline-form-item options" prop="url_path_route_value">

                    <Input placeholder="/" v-model="form.url_path_route_value"></Input>
                </FormItem>

            </Form>

        </div>

        <div slot="show">
            <div class="ctrl-edit-item">
                <div class="ctrl-edit-item__string">{{form.url_path_route_key+form.url_path_route_value}}</div>
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
                title: 'URI-PATH/ROUTE',
                info: 'Location definitions are central to the request routing mechanism in NGINX. Location specifies whether NGINX will proxy a particular request or serve it directly.',
                formRules: {
                    url_path_route_key: [

                    ],
                    url_path_route_value: [
                        { required: true, message: '不能为空' },
                    ]
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
