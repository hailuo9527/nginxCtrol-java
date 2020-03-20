<template>
    <div class="aside-wrap">
        <Input suffix="ios-search" placeholder="Systems" clearable />
        <div style="display: flex; justify-content: center">
            <div class="add-list" @click="addModel">
                <!--      <span>添加</span>-->
                <Tooltip content="添加APP" placement="top" max-width="200" theme="light">
                    <Icon type="md-add" color="#fff" :size="25" />
                </Tooltip>

            </div>
        </div>

        <div class="aside-list">
            <div class="aside-list-wrap">
                <div
                        class="aside-item"
                        :class="item.app_service_id === $route.params.app ? 'active' : ''"
                        @click="changeAside(item)"
                        v-for="(item, index) in asideList"
                        :key="item.app_service_id"
                >
                    <div class="title">
                        <span class="online" v-if="item.is_sync"></span>
                        <span class="offline" v-else></span>
                        {{item.app_service_name}}
                    </div>
                    <div class="info">{{item.description}}</div>
                    <Icon
                            type="md-close"
                            title="删除此项"
                            class="delete"
                            size="18"
                            color="#555"
                            @click.stop="delApp(item.app_service_id)"
                    />
                    <Icon type="ios-create" size="18" color="#555" title="编辑" class="edit" @click="editModel(item)" />
                </div>
            </div>
            <div
                    class="load-wrap"
                    style="display: flex; justify-content: center;align-items: center;"
                    v-if="listLoading"
            >
                <Loading />
            </div>
        </div>

        <Modal v-model="appModal" width="480">
            <p slot="header" style="color:#333;text-align:center">
                <span>{{edit? '修改APP配置': '新建APP'}}</span>
            </p>
            <div>
                <Form ref="appForm" :model="appForm" :rules="ruleValidate">
                    <FormItem label="APP命名" prop="app_service_name">
                        <Input v-model="appForm.app_service_name"></Input>
                    </FormItem>
                    <FormItem label="简介" prop="description">
                        <Input v-model="appForm.description"></Input>
                    </FormItem>
                    <FormItem label="标签" prop="tags">
                        <Input v-model="appForm.tags"></Input>
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
                        v-if="!edit"
                        @click="addApp('appForm')"
                >确认</Button>
                <Button
                        type="primary"
                        :loading="modal_loading"
                        v-else
                        @click="modifyApp('appForm')"
                >确认修改</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import { mapState, mapMutations, mapActions } from "vuex";
    import { addAppInfo, updAppInfo, delAppInfo } from "../../api/app";
    export default {
        name: "MyAside",

        data() {
            const validateName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error("不能为空"));
                } else {
                    callback();
                }
            };
            return {
                appModal: false,
                appForm: {

                },
                ruleValidate: {
                    app_service_name: [
                        { required: true, validator: validateName, trigger: 'blur'}
                    ]
                },
                modal_loading: false,
                edit: false
            };
        },
        watch: {

        },
        computed: {
            ...mapState({
                asideList: state => state.app.asideList,
                appServerId: state => state.app.activeAside.app_service_id,
                listLoading: state => state.app.listLoading
            })
        },
        methods: {
            ...mapActions(["getAppAsideList"]),
            ...mapMutations(["appSetActiveAside"]),
            changeAside(item) {
                //if (item.app_service_id === this.appServerId) return;
                this.appSetActiveAside(item);
                this.$router.push(`/app/${item.app_service_id}/overview`);
            },
            //展示Model框，数据重置
            addModel() {
                this.edit = false
                this.appForm = {
                    app_service_name: "",
                    description: "",
                    tags: "",
                }
                this.appModal = true
            },
            //展示Model框，展示当前L7服务器的数据
            editModel(item) {
                //console.log(item)
                this.edit = true
                this.appForm = item
                this.appModal = true
            },
            // 新建APP
            //添加L7服务器配置信息

            addApp(name) {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        this.modal_loading = true;
                        addAppInfo(this.appForm)
                            .then(res => {
                                // console.log(res);
                                this.modal_loading = false;
                                if (res.data.code === 'success') {
                                    this.appModal = false;
                                    this.getAppAsideList().then(res => {
                                        /* 第一次添加 */
                                        if (this.asyncOk(res) && !this.$route.params.app){
                                            this.$router.push(`/app/${this.appServerId}/overview`)
                                        }
                                    });
                                } else {
                                    this.$Message.error(`${res.data.result}`)
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
            /* 删除APp */
            delApp(id) {
                this.$Modal.confirm({
                    title: "提示",
                    content: "<p>确定要移除这个APP吗？</p>",
                    loading: true,
                    onOk: async () => {
                        let res = await delAppInfo({ app_server_id: id });
                        this.$Modal.remove();
                        if (this.asyncOk(res)) {
                            this.$Message.success("删除成功！");
                            this.getAppAsideList().then(res => {
                                if (this.asyncOk(res) && !res.data.result.length){
                                    this.$router.push(`/app`)
                                }
                                if (id === this.$route.params.app){
                                    this.$router.push(`/app/${this.appServerId}/overview`)
                                }

                            });
                        } else {
                            this.$Message.error(res.data.result);
                        }
                    }
                });
            },
            /*修改APP */
            modifyApp (name) {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        this.modal_loading = true;
                        updAppInfo(this.appForm)
                            .then(res => {
                                // console.log(res);
                                this.modal_loading = false;
                                if (res.data.code === 'success') {
                                    this.appModal = false;
                                    this.getAppAsideList();
                                } else {
                                    this.$Message.error(`${res.data.result}`)
                                }
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    } else {
                        this.$Message.error("请检查输入是否正确!");
                    }
                });
            }


        },
        created() {
            this.getAppAsideList().then(res => {
                if (this.asyncOk(res) && res.data.result.length) {
                    this.$router.push(`/app/${this.appServerId}/overview`)
                }
            })
            if (this.$route.params.app) {
                this.asideList.map(item => {
                    if (item.app_service_id === this.$route.params.app) {
                        this.appSetActiveAside(item);
                    }
                });
            }
        }
    };
</script>
<style lang="less" scoped>
    @import "aside";
</style>
