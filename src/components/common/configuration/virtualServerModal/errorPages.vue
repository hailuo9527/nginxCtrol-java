<template>
    <my-form-item  title="ERROR PAGES"
                   @closeConfig = "cancel"
                   @saveConfig = "saveConfig"
                   @cancel = "cancel"
                   @edit="edit"
                   :modify="modify"
                   :open = "form.error_pages_state"
                   :valid="valid"
                   info="Define the response that will be shown for specific errors.">
        <div slot="edit">
            <div  class="ctrl-edit-item ctrl-edit-item_edit mulity">

                <div class="item-body">
                    <Form ref="form" :model="form" :rules="formRules"    @submit.native.prevent>
                        <FormItem label="HTTP CODES" class="inline-form-item full-input">
                            <Input  placeholder="code"></Input>
                        </FormItem>
                        <FormItem label="REDIRECT TO" class="inline-form-item full-input">
                            <Input placeholder="URL | URI | variable"></Input>
                        </FormItem>
                        <FormItem label="RESPONSE CODE" class="inline-form-item full-input">
                            <Input placeholder="=code"></Input>
                        </FormItem>
                    </Form>


                </div>
                <div class="item-body-remove" >
                    <Icon type="ios-trash" class="remove-icon" @click="removeList(serverForm.listening_m.listening,index)" size="20"/>
                </div>
            </div>
            <div class="add-listen" @click="addErrorPage">
                <Icon class="icon" size="22" type="ios-add-circle-outline" />
                <span class="tip">Add error page</span>
            </div>



        </div>

        <div slot="show">
            <div  class="ctrl-edit-item error-pages">
                <span class="error-pages-codes">404</span> will show <span class="error-pages-redirect">111</span> with response <span class="error-pages-response">404</span>
            </div>

        </div>
    </my-form-item>
</template>

<script>
    import mixin from '../mixins'

    export default {
        mixins: [mixin],
        name: 'error pages',
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
