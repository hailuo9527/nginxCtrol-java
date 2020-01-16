<template>
    <Modal
            width="840"
            v-model="domainModel"
            :transfer="true"
            @on-visible-change="change"
            :mask-closable="false"
            class-name="vertical-center-modal "
    >
        <div class="ctrl-wizard">
            <div class="ctrl-wizard__head">
                <div class="ctrl-wizard__tabs " v-show="step<5">
                    <div :class="tab1" class="ctrl-wizard__tab">Names and Addresses</div>
                    <div :class="tab2" class="ctrl-wizard__tab">Pool Configuration</div>
                    <div :class="step === 4 ? 'ctrl-wizard__tab_active': ''"  class="ctrl-wizard__tab">Route</div>
                </div>
            </div>
            <div v-show="step===0">
                <div class="ctrl-wizard__title">Listening Address and Port</div>
                <div class="ctrl-wizard__description">
                    <div><!-- react-text: 893 -->Specify the inbound IP address and port for this load balancer. This should be one of the system’s IP addresses (or a "wildcard" listen). Please refer to the <!-- /react-text -->
                        <i>listen</i><!-- react-text: 895 --> directive in NGINX documentation.<!-- /react-text -->
                    </div>
                </div>
                <!--<div class="ctrl-edit-item ctrl-edit-item_edit">
                    <Button  icon="md-close" class="tag">Default</Button>
                    <Input v-model="domainName" placeholder="example.com *.example.com" style="width: 300px" />
                </div>-->
            </div>
            <div v-show="step===1">
                <div class="ctrl-wizard__title">Listening Address and Port</div>
                <div class="ctrl-wizard__description">
                    <div>
                        Specify the inbound IP address and port for this load balancer.
                        This should be one of the system’s IP addresses (or a "wildcard" listen).
                        Please refer to the listen directive in NGINX documentation.
                    </div>
                </div>

            </div>
            <div v-show="step===2">
                <div class="ctrl-wizard__title">Pool Servers</div>
                <div class="ctrl-wizard__description">
                    <div>
                        Specify the backend servers of the load balancing pool.
                        A backend server is identified by an IP address or FQDN.
                        An optional port may be specified by appending :port to the address or FQDN.
                        If no port is provided, the default is port 80.
                        By default, traffic to this load balancer will be evenly distributed across the backend servers.
                        This corresponds with the server directive in an upstream group in NGINX configuration.
                    </div>
                </div>

            </div>
            <div v-show="step===3">
                <div class="ctrl-wizard__title">Pool Name</div>
                <div class="ctrl-wizard__description">
                    <div>
                        Please specify a name for the load balancing pool.
                        This corresponds with the group name in the upstream directive in NGINX configuration.

                    </div>
                </div>

            </div>
            <div v-show="step===4">
                <div class="ctrl-wizard__title">Route</div>
                <div class="ctrl-wizard__description">
                    <div>
                        This load balancer can be limited to service a specific URI pattern.
                        The default behavior is to match any request URI by using the "/" prefix.
                        Please refer to the location directive in NGINX documentation.

                    </div>
                </div>

            </div>
            <div v-show="step===5">
                <div class="ctrl-wizard__title">Completed</div>
                <div class="ctrl-wizard__description">
                    <div>
                        You have successfully created a load balancer configuration for the selected system.
                        Please remember to push the configuration when you are ready to bring it online.

                        Please familiarize yourself with the Virtual Server, Location, Upstream Group,
                        and Upstream Server that were created to support this load balancer.
                        If you need to make changes, you can edit them as necessary after closing this dialog box.

                    </div>
                </div>

            </div>
            <Form ref="balanceForm" :model="balanceForm" :rules="balanceFormRules">
                <FormItem prop="user" class="border-bottom" v-show="step === 0">
                    <Button  icon="md-close" class="tag">Default</Button>
                    <Input type="text" v-model="balanceForm.domain" placeholder="example.com *.example.com">
                    </Input>
                </FormItem>
                <FormItem class="border-bottom" prop="user" v-show="step === 1">
                    <Input type="text" v-model="balanceForm.domain" placeholder="192.168.101.1:80">
                    </Input>
                </FormItem>
                <FormItem  class="border-bottom" prop="user" v-show="step === 2">
                    <Button  icon="md-close" class="tag">Default</Button>
                    <Input type="text" v-model="balanceForm.domain" placeholder="IP address or FQDN">
                    </Input>
                </FormItem>
                <FormItem class="border-bottom" prop="user" v-show="step === 3">
                    <Input type="text" v-model="balanceForm.domain" placeholder="name">
                    </Input>
                </FormItem>
                <FormItem class="border-bottom" prop="user" v-show="step === 4">
                    <Input v-model="balanceForm.route" placeholder="/">
                        <Select v-model="balanceForm.match" slot="prepend" style="width: 80px">
                            <Option value="prefix">prefix</Option>
                            <Option value="exact">exact</Option>
                            <Option value="regex">regex</Option>
                            <Option value="regex(case-insensitive)">regex(case-insensitive)</Option>

                        </Select>
                        <span style="padding-left: 15px; color: #888" slot="prepend">match with</span>

                    </Input>
                </FormItem>

            </Form>
            <div class="tip">

            </div>


        </div>
        <div class="ctrl-wizard__actions" slot="footer">
            <Button @click="step--" class="prev" v-show="step && step !==5 ">后退</Button>
            <Button type="primary" class="next" @click="step++" v-show="step<5">下一步</Button>
            <Button type="primary" class="next" @click="complete" v-show="step===5">完成</Button>
        </div>

    </Modal>
</template>
<script>
    export default {
        props: {
            show: false,
        },
        watch: {
            show (newVal, oldVal) {
                console.log(...arguments)
                this.domainModel = newVal
            }
        },
        data () {
            return {
                step: 0,
                domainModel: false,
                balanceForm: {
                    match: 'prefix'
                },
                balanceFormRules: {

                }
            }
        },
        computed: {
            tab1 : function () {
                switch (this.step) {
                    case 0:
                        return 'ctrl-wizard__tab_active '
                    case 1:
                        return 'ctrl-wizard__tab_ready_1 ctrl-wizard__tab_valid'
                    case 2:
                        return 'ctrl-wizard__tab_ready_2 ctrl-wizard__tab_valid'
                    default:
                        return 'ctrl-wizard__tab_ready_2 ctrl-wizard__tab_valid'
                }
            },
            tab2 : function () {
                switch (this.step) {
                    case 2:
                        return 'ctrl-wizard__tab_active '
                    case 3:
                        return 'ctrl-wizard__tab_ready_1 ctrl-wizard__tab_valid'
                    case 4:
                        return 'ctrl-wizard__tab_ready_2 ctrl-wizard__tab_valid'
                }
            }
        },
        methods: {
            change(data) {
                this.$emit('change', {data: data, name: 'domainModal'})
            },
            complete() {
                this.step = 0
                this.$emit('complete')
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "L7-config";
    /deep/ .ivu-modal-close{
        .ivu-icon-ios-close{
            color: #333;
            font-size: 50px;
            transition: all .2s;
            &:hover{
                transform: rotate(180deg);
            }
        }

    }
    /deep/.ivu-form-item-content{
        display: flex;
        flex-wrap: wrap;
        position: relative;
        margin-top: 20px;
        padding-bottom: 10px;
        transition: border-color .1s linear;
        // border-bottom: 1px solid #ababab;
        .ivu-input-wrapper{
            flex: 1 1 0px;
        }
    }
    /deep/ .ivu-form-item{
        margin-bottom: 0;

    }
    .border-bottom /deep/.ivu-form-item-content{


        padding-bottom: 6px;
        border-bottom: 1px solid #ccc;
        display: flex;
    }
</style>
