<template>
    <div class="content_wrap">
        <Aside />
        <div class="content_right" v-if="asideList.length">
            <div class="content_right_scroll">
                <div class="content_header">
                    <div class="header_title">
                        <span>
                          {{activeAside.app_service_name}}
                          <Icon class="icon" @click="openDrawer = true" type="md-settings" />
                            <Drawer :title="activeAside.app_service_name" placement="left" :closable="false" v-model="openDrawer">
                            <div>
                                <div>
                                    <Icon type="md-happy" />
                                    <span>状态</span>: {{activeAside.is_sync ? '已同步': '未同步'}}
                                </div>
                                <div>
                                    <p>configs</p>
                                </div>
                            </div>


                        </Drawer>
                        </span>
                        <span class="status">
                              <Icon type="md-happy" size="20" color="#21a37a"/>
                                    <span>状态</span>: {{activeAside.is_sync ? '已同步': '未同步'}}
                        </span>
                        <span class="publish">
                            <Button type="primary" @click="appModal = true">发布</Button>
                            <Modal v-model="appModal" width="480">
                                <p slot="header" style="color:#333;text-align:center">
                                    <span>发布APP</span>
                                </p>
                                <div>
                                    <Form ref="formValidate" :model="appForm" :rules="ruleValidate">
                                        <FormItem label="虚拟IP" prop="app_vip">
                                            <popTip content="123"></popTip>
                                             <Input v-model="appForm.app_vip"></Input>
                                        </FormItem>
                                        <FormItem label="选择绑定的实例">
                                            <popTip content="123"></popTip>
                                            <Select v-model="appForm.l7_server_ids" filterable multiple>

                                            </Select>
                                        </FormItem>
                                        <FormItem label="选择配置">
                                            <popTip content="123"></popTip>
                                            <Select v-model="appForm.nginx_conf_id" filterable >

                                            </Select>
                                        </FormItem>
                                        <FormItem label="是否开启热备份">
                                            <popTip content="123"></popTip>

                                                 <i-switch style="float: left" v-model="appForm.switch" ></i-switch>




                                        </FormItem>
                                    </Form>
                                </div>
                                <div slot="footer">
                                    <Button
                                            @click="appModal = false"
                                    >取消</Button>
                                    <Button
                                            type="primary"
                                            :loading="modal_loading"
                                    >确认</Button>

                                </div>
                            </Modal>
                        </span>

                    </div>
                    <div class="header_tab">
                        <div class="tab">

                            <router-link :to="`/app/${$route.params.app}/`" class="tab_item">overview</router-link>
                        </div>
                    </div>
                </div>
                <router-view class="content_main"></router-view>
            </div>
        </div>
        <div class="content_right" v-else>
            <div>暂无数据，请先去创建APP</div>
        </div>
    </div>
</template>
<script>
    import Aside from "@/components/aside/app-aside.vue";
    import popTip from "@/components/common/pop-tip";
    import { mapState, mapMutations, mapActions } from "vuex";
    import { pushApp } from "../../api/app";

    export default {
        name: "L4",
        data() {
            return {
                openDrawer: false,
                appModal: false,
                appForm: {

                },
                ruleValidate: {
                    app_service_name: [

                    ]
                },
                modal_loading: false,
            };
        },
        components: {
            Aside,popTip
        },
        methods: {
            ...mapMutations(["appSetActiveAside"]),
            ...mapActions(['getAppAsideList'])
        },
        watch: {
            openDrawer(val, oldVal) {
                if (val) {
                }
            }
        },
        computed: {
            ...mapState({
                asideList: state => state.app.asideList,
                activeAside: state => state.app.activeAside
            })
        },
        created() {
           // this.getAppAsideList()
        },
        beforeRouteLeave(to, from, next) {
            // 导航离开该组件的对应路由时调用
            // 可以访问组件实例 `this`
            this.appSetActiveAside(this.asideList[0]);
            next();
        }
    };
</script>
<style lang="less" scoped>
    @import "../L4/L4";
    .content_main {
        height: calc(100%);
        padding: 98px 10px 0 10px;
        //box-sizing: border-box;
    }
</style>
