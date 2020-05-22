<template>
    <div class="aside-wrap">
        <Input suffix="ios-search" v-model.trim="searchString" placeholder="搜索APP" clearable />
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
                        v-for="(item, index) in filterAside"
                        :key="item.app_service_id"
                >
                    <div class="title">
                        <span class="online" v-if="item.push_status"></span>
                        <span class="offline" v-else></span>
                        {{item.app_service_name}}
                    </div>
                    <div class="info">{{item.description}}</div>
                    <!--<Icon
                            type="md-close"
                            title="删除此项"
                            class="delete"
                            size="18"
                            color="#555"
                            @click.stop="delApp(item.app_service_id)"
                    />-->
                    <!--<Icon type="ios-create" size="18" color="#555" title="编辑" class="edit" @click.stop="editModel(item)" />-->
                    <Icon type="md-more" size="20" color="#000" title="编辑" class="menu" @click="editModel(item, index)"/>
                </div>
            </div>
            <div class="aside-list-wrap" style="text-align: center" v-if="!filterAside.length">
                暂无数据
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
                    <FormItem label="是否开启热备份" >

                        <i-switch  v-model="appForm.configure_ha" >
                            <span slot="open">On</span>
                            <span slot="close">Off</span>
                        </i-switch>

                    </FormItem>
                    <FormItem label="虚拟ip" prop="AppVip" v-if="appForm.configure_ha" >
                        <popTip content="对外开放的IP地址"></popTip>
                        <Button  icon="md-close" class="tag"
                             :key="index"
                             v-if="item"
                             @click="removeTag(item)"
                             v-for="(item, index) in appForm.app_vip.split(',')">{{item}}</Button>
                        <Input v-model.trim="appForm.AppVip" @on-enter="addAppVip" @on-blur="addAppVip" placeholder="IP" ></Input>
                    </FormItem>
                    <FormItem label="监听端口" prop="listen">
                        <popTip content="对外开放的端口"></popTip>
                        <Input v-model="appForm.listen" placeholder="PORT"></Input>
                    </FormItem>
                    <FormItem label="选择实例" prop="l7_server_ids" v-if="L7List">
                        <popTip content="实例为部署NGINX代理的服务器，开启热备份时至少选择两台实例"></popTip>
                        <Select v-model="appForm.l7_server_ids" filterable multiple>
                            <Option v-for="item in L7List" :value="item.l7ServerId" :key="item.l7ServerId">{{ item.l7ServerName }}</Option>
                        </Select>
                        <div v-if="!L7List.length" class="">
                            暂无实例，
                            <router-link to="/L7">点击创建</router-link>

                        </div>
                    </FormItem>
                    <div class="label"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              >服务器地址
                        <PopTip content="添加服务器地址后可以使用一键发布功能" style="margin-left: 5px;" placement="bottom">
                        </PopTip>
                    </div>
                    <div class="scroll-warp">
                        <Row v-for="(item, index) in appForm.appDefaultPublishConfList" :key="index">
                            <Col span="10">
                                <FormItem
                                label=""
                                :prop="'appDefaultPublishConfList.' + index + '.upstream_server'"
                                :rules="{ validator: ipPort}">
                                    <Input type="text" v-model="item.upstream_server" placeholder="IP | IP:PORT | PORT"></Input>
                                </FormItem>
                            </Col>
                            <Col span="8" :offset="1">
                                <FormItem :prop="'appDefaultPublishConfList.' + index + '.weight'" :rules="{ validator: validaterule}">
                                    <Input type="text" v-model="item.weight" placeholder="权重"></Input>
                                </FormItem>
                            </Col>
                            <Col span="4" style="text-align: right">
                                <Icon type="ios-trash" class="remove-icon" @click="handleRemove(index)" size="20"/>
                            </Col>
                        </Row>
                    </div>

                    <FormItem>

                        <Button type="dashed" @click="handleAdd" icon="md-add">添加</Button>

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
                <Button class="fl" v-if="edit" ghost type="error"
                        @click.stop="delApp(appForm.app_service_id)"
                >删除</Button>
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
    import {mapActions, mapMutations, mapState} from "vuex";
    import {addAppInfo, delAppInfo, updAppInfo, selAppDetails} from "../../api/app";
    import {selUsableL7Server,} from "../../api/L7";
    import { selAppInfoList } from "../../api/app";
    import PopTip from '@/components/common/pop-tip'

    export default {
        name: "MyAside",
        components: {
            PopTip
        },
        data() {
             this.ipPort = (rule, value, callback) =>{

                if (value){
                    let ip = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
                    // let port = /^[1-9]$|(^[1-9][0-9]$)|(^[1-9][0-9][0-9]$)|(^[1-9][0-9][0-9][0-9]$)|(^[1-6][0-5][0-5][0-3][0-5]$)/
                    // let ipAndPort = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/
                    // if(ip.test(value) || port.test(value) || ipAndPort.test(value) ){
                    if(ip.test(value)){
                        callback()
                    }else {
                        callback(new Error('格式错误'))
                    }
                }else{
                    callback()
                }
            }
            const selection = (rule, value, callback) => {

                if (!value) {
                    return callback(new Error("至少选择一个实例"));
                } else {
                    if (this.appForm.configure_ha && value.length<2){
                        return callback(new Error("已开启热备份，至少选择两个实例"));
                    }
                    callback();
                }
            }
            this.validaterule = (rule, value, callback) => {
                let reg = /^\d*[1-9]$/;
                if (value === "") {
                    callback(new Error("权重不能为空"));
                } else if (!reg.test(value)) {
                    callback(new Error("请输入大于零的整数"));
                } else {
                    callback();
                }
            };
            const port = (rule, value, callback) => {
                let P = /^[1-9]$|(^[1-9][0-9]$)|(^[1-9][0-9][0-9]$)|(^[1-9][0-9][0-9][0-9]$)|(^[1-6][0-5][0-5][0-3][0-5]$)/
                if (value) {
                    if (P.test(value)) {
                        callback()
                    } else {
                        callback(new Error("格式错误"))
                    }
                } else {
                    callback(new Error("不能为空"))
                }
            };
            return {
                appModal: false,
                appForm: {
                    app_vip: "",
                    appDefaultPublishConfList: [],
                    l7_server_ids: [],
                    listen: 80,
                    AppVip: ''
                },
                ruleValidate: {
                    app_service_name: [
                        { required: true, message: '不能为空', trigger: 'blur'}
                    ],
                    l7_server_ids: [
                        {  validator: selection, trigger: 'change' }
                    ],
                    AppVip: [
                        { validator: this.ipPort }
                    ],
                    listen: [
                        {validator: port, trigger: 'blur'}
                    ]
                },
                L7List: [],
                modal_loading: false,
                edit: false,
                searchString: '',
                activeItem: {},
                timer: null
            };
        },
        watch: {
            '$route'(nv, ov){
                if(nv.path === '/app'){
                    this.$router.replace(ov)
                }
            }
        },
        computed: {
            ...mapState({
                asideList: state => state.app.asideList,
                appServerId: state => state.app.activeAside.app_service_id,
                listLoading: state => state.app.listLoading,
                activeAside: state => state.app.activeAside
            }),
            // 匹配搜索
            filterAside: function () {
                let arr = this.asideList
                let searchString = this.searchString

                if(!searchString){
                    return arr;
                }
                arr = arr.filter(function(item){
                    if(item.app_service_name.indexOf(searchString) !== -1){
                        return item;
                    }
                })

                // 返回过来后的数组
                return arr;
            }
        },
        methods: {
            ...mapActions(["getAppAsideList"]),
            ...mapMutations(["appSetActiveAside",'appSetAsideList']),
            changeAside(item) {
                if (item.app_service_id === this.appServerId) return;
                this.appSetActiveAside(item);

                this.$router.replace(`/app/${item.app_service_id}/overview`);
            },
            //展示Model框，数据重置
            addModel() {
                this.edit = false
                this.appForm = {
                    app_vip: "",
                    appDefaultPublishConfList: [],
                    l7_server_ids: [],
                    listen: 80
                },
                this.selUsableL7Server(this.appForm).then(()=> {
                    let arr = []
                    arr.push(this.L7List[0].l7ServerId)
                    this.$set(this.appForm, 'l7_server_ids',arr)
                })

                this.appModal = true
            },
            //展示Model框，展示当前实例的数据
            editModel(item, index) {
                this.edit = true
                this.appForm = this.copyJson(item)
                this.appModal = true
                this.selUsableL7Server(item).then(()=> {
                    this.$set(this.appForm, 'l7_server_ids',item.l7_server_ids)
                    if (!item.l7_server_ids.length){
                        let arr = []
                        arr.push(this.L7List[0].l7ServerId)
                        this.$set(this.appForm, 'l7_server_ids',arr)
                    }
                })
            },
            // 新建APP
            //添加实例配置信息

            addApp(name) {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        this.modal_loading = true;
                        // let ip = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
                        // if (ip.test(this.appForm.app_vip)){
                        //     this.appForm.app_vip += ':80'
                        // }
                        addAppInfo(this.appForm)
                            .then(res => {
                                // console.log(res);
                                this.modal_loading = false;
                                if (res.data.code === 'success') {
                                    this.appModal = false;
                                    this.getAppAsideList().then(res => {
                                        /* 第一次添加 */
                                        if (this.asyncOk(res) && !this.$route.params.app){
                                            this.appSetActiveAside(res.data.result[0] || {});
                                            this.$router.replace(`/app/${this.appServerId}/overview`)
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
                        this.appModal = false
                        if (this.asyncOk(res)) {
                            this.$Message.success("删除成功！");
                            this.getAppAsideList(true).then(res => {
                                if (this.asyncOk(res) && !res.data.result.length){
                                    this.$router.push(`/app`)
                                }
                                if (id === this.$route.params.app){
                                    this.$router.replace(`/app/${this.appServerId}/overview`)
                                }

                            });
                        } else {
                            this.$Message.error(res.data.result);
                        }
                    }
                });
            },
            /* 重置activeAside */
            resetAside(){
                this.getAppAsideList('update')
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
                                    this.$Message.success('修改成功')
                                    /* 重置当前app信息 */
                                    this.resetAside()
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
            /* 新增服务器表单项 */
            handleAdd () {
                this.appForm.appDefaultPublishConfList.push(
                        {
                            upstream_server: '',
                            weight: 1,
                        }
                )
            },
            handleRemove (index) {
                this.appForm.appDefaultPublishConfList.splice(index, 1)
            },
            /* 获取L7实例 */
            async selUsableL7Server(item) {
                let res = await selUsableL7Server({ app_service_id: this.edit ? item.app_service_id : null })
                if (this.asyncOk(res)) {
                    this.L7List = res.data.result || []
                }
            },
            //添加虚拟ip
            addAppVip () {
                if(this.appForm.AppVip === "") return
                if (this.appForm.AppVip !== "") {
                    let reg = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
                    if (reg.test(this.appForm.AppVip)) {
                        let arr = this.appForm.app_vip.split(',')
                        arr.push(this.appForm.AppVip)
                        arr.map((item, index)=> {
                            if (!item) arr.splice(index,1)
                        })
                        this.appForm.app_vip = arr.join(',')
                        this.appForm.AppVip = ''
                    }
                }
            },
            //移除虚拟ip
            removeTag(str) {
                let arr = this.appForm.app_vip.split(',')
                let index = arr.indexOf(str)
                arr.splice(index, 1)
                this.appForm.app_vip = arr.join(',')
                // console.log(this.appForm.app_vip)
            },
        },
         /* 更新组件 */
        created() {
            this.getAppAsideList(true).then(res => {
                if (this.asyncOk(res) && res.data.result.length) {
                    if(!this.$route.params.app){
                        this.$router.replace(`/app/${this.appServerId}/overview`)
                    } else{
                        this.asideList.map(item => {
                            if (item.app_service_id === this.$route.params.app) {
                                this.appSetActiveAside(item);
                            }
                        });
                    }

                }
            })

        },
        mounted() {
            this.timer = setInterval(() => {
                this.getAppAsideList('update')
            }, 1000* 60)
        },
        beforeDestroy() {
            clearInterval(this.timer)
        }
    };
</script>
<style lang="less" scoped>
    @import "aside";
    //@import "../../components/common/configuration/modal-form";
    .tag{
  margin-right: 10px;
  display: inline-block;
  padding: 5px 10px;
  background: #f3f3f3;
  color: #333;
  margin-top: 10px;
}
</style>
