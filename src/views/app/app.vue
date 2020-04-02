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
                            <Drawer :title="activeAside.app_service_name"
                                    width="420"
                                    placement="left" class="left-drawer" :closable="false" v-model="openDrawer">
                            <div class="content">
                                <div class="row-item">
                                    <div class="status">
                                        <Icon type="md-happy" size="20" color="#21a37a"/>
                                        <span>状态</span>: {{activeAside.is_sync ? '已同步': '未同步'}}
                                    </div>
                                </div>

                                <div class="row-item" @click="collapsed = !collapsed">
                                    <div class="title" :class="collapsed? 'collapsed': ''" >
                                        <span>关联的实例</span>
                                        <Icon type="ios-arrow-forward" size="20" class="icon"/>
                                    </div>

                                </div>
                                <div class="row-item"  v-show="collapsed" v-if="detailInfo.l7ServerInfoList">
                                    <div class="info-list">
                                         <div class="list-item no-item" v-if="!detailInfo.l7ServerInfoList.length">
                                        暂无数据， 点击发布按钮关联实例
                                    </div>
                                    <div class="list-item" :key="item.l7ServerId" v-for="item in detailInfo.l7ServerInfoList">
                                        <router-link :to="`/L7/${item.l7ServerId}/chart`">
                                            <Icon type="ios-color-filter-outline" />
                                            {{item.l7ServerName}}
                                        </router-link>

                                    </div>
                                    </div>

                                </div>
                                <div class="row-item" >
                                    <div class="title"  >
                                        <span>关联的配置</span>

                                    </div>

                                </div>
                                <div class="row-item">
                                    <div class="info-list">
                                         <div class="list-item no-item" v-if="!detailInfo.nginxConf">
                                        暂无数据， 点击发布按钮关联配置
                                        </div>
                                        <div class="list-item" v-if="detailInfo.nginxConf">
                                            <router-link :to="{name: 'nginxConfig',
                                            params:{configName: detailInfo.nginxConf.config_name,},
                                            query: {nginx_conf_id: detailInfo.nginxConf.nginx_conf_id}}">

                                                <Icon type="ios-color-filter-outline" />
                                                {{detailInfo.nginxConf.config_name}}
                                            </router-link>

                                        </div>
                                    </div>

                                </div>
                            </div>


                        </Drawer>
                        </span>
                        <span class="status">
                              <Icon type="md-happy" size="20" color="#21a37a"/>
                                    <span>状态</span>: {{activeAside.is_sync ? '已同步': '未同步'}}
                        </span>
                        <span class="publish">
                            <Button type="primary" @click="publicApp">发布</Button>
                            <Modal v-model="appModal" width="480">
                                <p slot="header" style="color:#333;text-align:center">
                                    <span>发布APP</span>
                                </p>
                                <div>
                                    <Form ref="formValidate" :model="appForm" :rules="ruleValidate">
                                        <FormItem label="虚拟IP" prop="app_vip">
                                            <popTip content="对外开放的IP地址,开启热备份时必填"></popTip>
                                             <Input v-model="appForm.app_vip"></Input>
                                        </FormItem>
                                        <FormItem label="选择实例" prop="l7_server_ids">
                                            <popTip content="将APP发布到目标服务器实例"></popTip>
                                            <Select v-model="appForm.l7_server_ids" filterable multiple @on-select="selectL7">
                                                <Option v-for="item in L7List" :value="item.l7ServerId" :key="item.l7ServerId">{{ item.l7ServerName }}</Option>
                                            </Select>
                                             <div v-if="!L7List.length" class="">
                                                暂无实例，
                                                <router-link to="/L7">点击创建</router-link>

                                            </div>
                                        </FormItem>
                                        <FormItem label="选择配置" prop="nginx_conf_id">
                                            <popTip content="选择一个配置并发布到当前APP"></popTip>
                                            <Select v-model="appForm.nginx_conf_id" filterable >
                                                 <Option v-for="item in configList" :value="item.nginx_conf_id" >{{item.config_name}}</Option>
                                            </Select>
                                             <div v-if="!configList.length" class="">
                                                暂无配置，
                                                <router-link to="/newNginxConfig">点击创建</router-link>

                                            </div>
                                        </FormItem>

                                        <FormItem label="是否开启热备份" v-if="L7List.length>1">

                                            <i-switch  v-model="appForm.configure_ha" >
                                                <span slot="open">On</span>
                                                <span slot="close">Off</span>
                                            </i-switch>

                                        </FormItem>
                                    </Form>
                                </div>
                                <div slot="footer">
                                    <Button
                                            @click="appModal = false"
                                    >取消</Button>
                                    <Button
                                            type="primary"
                                            @click="pushApp('formValidate')"
                                            :loading="modal_loading"
                                    >确认</Button>

                                </div>
                            </Modal>
                        </span>

                    </div>
                    <div class="header_tab">
                        <div class="tab">

                            <router-link :to="`/app/${$route.params.app}/overview`" class="tab_item">overview</router-link>
                        </div>
                    </div>
                </div>
                <router-view class="content_main"></router-view>
            </div>
        </div>
        <div class="content_right" v-else>
            <div class="no-data">暂无数据，点击左侧“+”创建APP</div>
        </div>
    </div>
</template>
<script>
    import Aside from "@/components/aside/app-aside.vue";
    import popTip from "@/components/common/pop-tip";
    import { mapState, mapMutations, mapActions } from "vuex";
    import { pushApp, selAppDetails } from "../../api/app";
    import { getNginxConfALL, selL7ServerInfoAll, selUsableL7Server } from "../../api/L7";


    export default {

        data() {
            const selection = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error("至少选择一个实例"));
                } else {
                    callback();
                }
            }
            const Ip = (rule, value, callback) => {
                if (!value) {
                    if(this.appForm.configure_ha){
                        return callback(new Error("IP不能为空"));
                    }else {
                        callback()
                    }

                } else if (!/^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/.test(value)) {
                    callback("IP格式不正确");
                } else {
                    callback();
                }
            };
            return {
                openDrawer: false,
                appModal: false,
                appForm: {

                },
                ruleValidate: {
                    l7_server_ids: [
                        { required: true, validator: selection, trigger: 'change' }
                    ],
                    app_vip: [
                        { validator: Ip }
                    ],
                    nginx_conf_id: [
                        { required: true, message: '必须选择一个配置', trigger: 'change' }
                    ]
                },
                modal_loading: false,
                configList: [],
                L7List: [],
                detailInfo: {},
                collapsed: false,

            };
        },
        components: {
            Aside,popTip
        },
        methods: {
            ...mapMutations(["appSetActiveAside"]),
            ...mapActions(['getAppAsideList']),
            publicApp() {
              this.appModal = true
                this.appForm = this.activeAside
              this.getAllConfigInfo()
            },
            /* 发布APP */
            pushApp(name) {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        this.modal_loading = true;
                        pushApp(this.appForm)
                            .then(res => {
                                // console.log(res);
                                this.modal_loading = false;
                                if (res.data.code === 'success') {
                                    this.appModal = false;
                                    this.$Message.success('发布成功')
                                    this.getAppAsideList()
                                } else {
                                    this.$Message.error(res.data.result)
                                }
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    } else {
                        this.$Message.error("请检查输入是否正确!");
                    }
                });
            },
            /* 获取配置 */
            async getAllConfigInfo () {
                let res = await getNginxConfALL()
                console.log(res)
                if (this.asyncOk(res)) {
                    this.configList = res.data.result || []
                }
            },
            /* 获取L7实例 */
            async selUsableL7Server() {
                let res = await selUsableL7Server()
                //console.log(res)
                if (this.asyncOk(res)) {
                    this.L7List = res.data.result || []
                }
            },
            /* 选择L7实例 */
            selectL7(item) {
                //console.log(item)

            },
            /* 侧栏获取app详细信息 */
            async selAppDetails(id) {
                let res = await selAppDetails({app_server_id: this.activeAside.app_service_id})
                //console.log(res)
                if (this.asyncOk(res)) {
                    this.detailInfo = res.data.result || {}
                }
            }
        },
        watch: {
            openDrawer(val, oldVal) {
                if (val) {
                    console.log(this.activeAside.app_service_id)
                    this.selAppDetails()
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
            this.selUsableL7Server()
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
