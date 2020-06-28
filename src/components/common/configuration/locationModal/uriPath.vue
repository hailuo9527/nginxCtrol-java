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
                        <Option value="prefix">prefix</Option>
                        <Option value="exact">exact</Option>
                        <Option value="regex">regex</Option>
                        <Option value="regex(case-insensitive)">regex(case-insensitive)</Option>
                    </Select>

                </FormItem>
                <span class="options-label">match with</span>
                <FormItem label="" class="inline-form-item options" prop="url_path_route_value">
                    <Input placeholder="/" v-model.trim="form.url_path_route_value"></Input>
                </FormItem>

            </Form>

        </div>

        <div slot="show">
            <div class="ctrl-edit-item">
                <div class="ctrl-edit-item__string" v-if="form.url_path_route_key === ''"> {{form.url_path_route_value}}</div>
                <div class="ctrl-edit-item__string" v-if="form.url_path_route_key === 'prefix'"> ^~{{form.url_path_route_value}}</div>
                <div class="ctrl-edit-item__string" v-if="form.url_path_route_key === 'exact'"> ={{form.url_path_route_value}}</div>
                <div class="ctrl-edit-item__string" v-if="form.url_path_route_key === 'regex'"> ~{{form.url_path_route_value}}</div>
                <div class="ctrl-edit-item__string" v-if="form.url_path_route_key === 'regex(case-insensitive)'"> ~*{{form.url_path_route_value}}</div>
            </div>
        </div>
    </my-form-item>
</template>

<script>
    import mixin from '../mixins'

    export default {
        mixins: [mixin],
        data () {
            const urlPathRouteValue = (rule, value, callback) => {
                const reg = /^[^ ]+$/
                if (!value) {
                    callback(new Error('不能为空'))
                }else if (!reg.test(value)){
                        callback(new Error('不能含有空格'))
                } else {
                    callback()
                }
            }
            return {
                title: 'URI-PATH/ROUTE',
                info: 'Location定义是NGINX中请求路由机制的核心。Location指定NGINX是代理一个特定的请求还是直接服务它。',
                formRules: {
                    url_path_route_key: [

                    ],
                    url_path_route_value: [
                        { required: true, validator: urlPathRouteValue },
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
