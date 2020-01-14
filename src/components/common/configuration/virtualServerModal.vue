<template>
    <Modal
            width="790"
            v-model="model"
            :transfer="true"
            @on-visible-change="change"
            title="新建虚拟服务器"
    >
        <div class="virtual_server_form" >

            <Alert type="error" class="err-tip" v-if="errorTip.show" closable >
                您需要确认每个部分的更改: {{errorTip.value}}
                <Icon type="md-close"  class="close" slot="close"/>
            </Alert>
            <Form ref="serverForm" :model="serverForm" :label-width="0">

                <FormItem>
                    <div class="form-item" :class="serverForm.domain.switch ? 'form-item-edit': ''">
                        <div class="form-item-header" >
                            <i-switch v-model="serverForm.domain.switch" ></i-switch>
                            <span class="title">DOMAIN NAMES</span>
                            <PopTip content="123"  placement="right"></PopTip>
                            <div class="actions">
                                <Button shape="circle" icon="md-close"></Button>
                                <Button  shape="circle" ghost type="primary" icon="md-checkmark"></Button>
                            </div>
                        </div>
                        <div class="ctrl-edit-item ctrl-edit-item_edit" v-show="serverForm.domain.switch">
                            <Form ref="formValidate">
                                <FormItem>
                                    <div class="form-item-wrap" >
                                        <Input type="text" v-model="serverForm.domain.name" placeholder="example.com *.example.com">
                                        </Input>
                                    </div>

                                </FormItem>
                            </Form>
                            <div class="ctrl-edit-item__note">Prefix the name with ~ to use a regular expression</div>
                        </div>
                    </div>

                </FormItem>

            </Form>
        </div>
        <div slot="footer">
            <Button @click="model = false">取消</Button>
            <Button type="primary"  :loading="modal_loading" @click="handleSubmit">保存</Button>

        </div>
    </Modal>
</template>
<script>
    import PopTip from '@/components/common/pop-tip'
    export default {
        props: {
            show: false,
        },
        components: {
          PopTip
        },
        watch: {
            show (newVal, oldVal) {
                this.model = newVal
            }
        },
        data () {
            return {
                modal_loading: false,
                model: true,
                serverForm: {

                    domain: {
                        switch: false,
                        name: ''
                    }
                },
                serverFormRules: {

                },
                errorTip: {
                    show: false,
                    value: ''
                }
            }
        },
        computed: {

        },
        methods: {
            change(data) {
                this.$emit('change', {data: data, name: 'serverModal'})
            },

            handleSubmit () {
                // 验证是否有未确认的更改
                Object.keys(this.serverForm).map((item) => {
                    if (this.serverForm[item].switch){
                        this.errorTip = {
                            show: true,
                            value: item
                        }
                        return
                    }
                })
                console.log(this.serverForm.domain.name)

            },
        }
    }
</script>
<style lang="less" scoped>
    /deep/ .ivu-modal-close{
        .ivu-icon-ios-close{
            color: #fff;
            opacity: .6;
            font-size: 38px;
            transition: all .2s;
            &:hover{
                opacity: 1;
                transform: rotate(180deg);
            }
        }
    }
    /deep/.ivu-modal-body{
        //padding: 0 40px 20px;
        padding: 0;
    }
    /deep/.ivu-form-item-content{
       /* margin-top: 0 !important;
        position: relative;

        padding: 10px 40px 10px;
        border-bottom: 1px solid #e2e2e2!important;
        background-color: #f3f3f3;
        transition: border-color 0.1s linear, background-color 0.1s linear;*/
        margin-top: 0!important;
        border-bottom: none!important;
        padding-bottom: 0 !important;
       // margin: 0px -40px !important;
    }
    .form-item{
        width: 100%;
        position: relative;
        padding: 10px 40px 10px;
        border-bottom: 1px solid #e2e2e2;
        background-color: #f3f3f3;
        .form-item-header{
            display: flex;
            align-items: center;
            transition: border-color 0.1s linear, background-color 0.1s linear;
        }
        .title{
            margin: 0 10px;
        }
        .actions{
            flex: 1;
            text-align: right;
            .ivu-btn-circle.ivu-btn-icon-only, .ivu-btn-circle-outline.ivu-btn-icon-only{
                width: 40px;
                height: 30px;
                border-radius: 15px;
                margin-left: 10px;
            }
        }
        &.form-item-edit{
            background: #fff;
        }
        .form-item-wrap{
            flex: 1;
            /deep/.ivu-input{

                border-bottom: 1px solid #ccc;
                border-radius: 0;
                &:focus{
                    border-bottom: 1px solid #666;
                }
            }

        }
    }
    .ctrl-edit-item {
        position: relative;
        margin: 10px 40px;

        padding: 5px 28px 5px 28px;
        border-left: 2px solid #d8d8d8;
        transition: border-color 0.1s linear;
    }
    .ctrl-edit-item_edit {
        border-left-color: @green;
    }
    .ctrl-edit-item__note {
        padding: 10px 0px;
        font: 12px 'RobotoItalic', Arial, sans-serif;
        font-weight: normal;
        color: #888888;
    }
   .err-tip{
       margin-bottom: 0!important;
       background: #ff5559;
       opacity: .95;
       border: none;
       border-radius: 0;
       font-size: 14px;
       color: #fff;
       padding: 10px 40px;
       position: sticky;
       top: 0;
       .close{
           font-size: 18px;
           color: #fff;
           margin-right: 10px;
       }
   }
    /deep/.ivu-modal-header {
        border-bottom: none;
    }
</style>
