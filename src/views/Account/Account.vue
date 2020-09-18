<template>
    <div class="content">
        <Layout :style="{ minHeight: '100vh' }">
            <!-- 侧边栏 -->
            <Sider collapsible :collapsed-width="78" v-model="isCollapsed" :width="245">
                <Menu active-name="user" width="auto" :class="menuitemClasses" @on-select="GetMenuValue">
                    <MenuItem name="user">
                    <Icon type="md-contacts" size="22" />
                    <span>用戶</span>
                    </MenuItem>
                    <MenuItem name="role">
                    <Icon type="md-person" size="22" />
                    <span>角色</span>
                    </MenuItem>
                </Menu>
            </Sider>
            <Layout>
                <!-- 主体内容 -->
                <Content :style="{ padding: '0 32px' }">
                    <div class="add-button">
                        <Button type="primary" icon="md-add" @click="add_user()" v-if="status === 1 && userInfo.role_id === 2">添加</Button>
                    </div>
                    <Breadcrumb :style="{ margin: '32px 0' }">
                        <BreadcrumbItem v-if="status === 1">用户</BreadcrumbItem>
                        <BreadcrumbItem v-if="status === 2">角色</BreadcrumbItem>
                    </Breadcrumb>
                    <Card>
                        <div>
                            <!-- 用户的表格 -->
                            <Table :columns="UserTableColumns" :data="UserTableData" :loading="loading" :max-height="400" v-if="status === 1">
                                <template slot-scope="{ row }" slot="tag">
                                    <Tag color="#292932">{{ row.tag }}</Tag>
                                </template>
                                <template slot-scope="{ row }" slot="role_name">
                                    <Tag color="#292932">{{ row.role_name }}</Tag>
                                </template>

                                <template slot-scope="{ row, index }" slot="operation">
                                    <Icon type="ios-trash" style="margin-right: 5px" size="22" title="删除" v-if="userInfo.role_id === 2 && row.role_id !== 2" @click="DeleteUser(row.id)" />
                                    <Icon type="ios-create" size="22" title="编辑" @click="edit_user(row)" />
                                    <Icon type="md-settings" size="22" title="操作权限" @click="EditOperation(row)" />
                                </template>
                            </Table>
                            <!-- 角色的表格 -->
                            <Table :columns="RoleTableColumns" :data="RoleTableData" :loading="loading" :max-height="400" v-if="status === 2"></Table>
                            <div class="under-table" v-if="status === 1">
                                目前有
                                <span>{{ user_length }}</span>
                                个用户
                            </div>
                            <div class="under-table" v-if="status === 2">
                                目前有
                                <span>{{ role_length }}</span>
                                个角色
                            </div>
                        </div>
                    </Card>
                </Content>
            </Layout>
        </Layout>
        <!-- 添加用户信息的Modal -->
        <Modal v-model="AddModel" :mask-closable="false" width="40">
            <p slot="header" style="color:#fff;text-align:center">
                <span>添加</span>
            </p>
            <Form :model="formCustom" :rules="ruleCustom" :label-width="90" ref="formCustom">
                <FormItem label="用户名称" prop="username">
                    <Input type="text" v-model="formCustom.username" autocomplete></Input>
                </FormItem>
                <FormItem label="账号" prop="usernumber">
                    <Input type="text" v-model="formCustom.usernumber" autocomplete></Input>
                </FormItem>
                <FormItem label="密码" prop="passwd">
                    <Input type="password" v-model="formCustom.passwd" autocomplete></Input>
                </FormItem>
                <FormItem label="确认密码" prop="passwordCheck">
                    <Input type="password" v-model="formCustom.passwordCheck" autocomplete></Input>
                </FormItem>
                <FormItem label="标签" prop="tag">
                    <Input type="text" v-model="formCustom.tag"></Input>
                </FormItem>
                <!-- <FormItem label="角色" prop="role">
          <Select v-model="formCustom.role" placeholder="Select your role">
            <Option
              v-for="item in RoleTableData"
              :value="item.id"
              :key="item.id"
              >{{ item.role_name }}</Option
            >
          </Select>
        </FormItem> -->
            </Form>
            <div slot="footer">
                <Button type="primary" :long="true" @click="handleSubmit('formCustom')" v-if="num == 1">确认添加</Button>
            </div>
        </Modal>
        <!-- 修改用户的Modal -->
        <Modal v-model="EditModel" :mask-closable="false" width="40">
            <p slot="header" style="color:#fff;text-align:center">
                <span>修改</span>
            </p>
            <Form :model="formCustom" :rules="ruleCustom" :label-width="90" ref="formCustoms">
                <FormItem label="用户名称" prop="username">
                    <Input type="text" v-model="formCustom.username" autocomplete></Input>
                </FormItem>
                <FormItem label="账号" prop="usernumber">
                    <Input type="text" v-model="formCustom.usernumber" autocomplete></Input>
                </FormItem>
                <FormItem label="密码" prop="passwd">
                    <Input type="password" v-model="formCustom.passwd" autocomplete></Input>
                </FormItem>
                <FormItem label="确认密码" prop="passwordCheck">
                    <Input type="password" v-model="formCustom.passwordCheck" autocomplete></Input>
                </FormItem>
                <!-- <FormItem label="角色" prop="role">
          <Select v-model="formCustom.role" placeholder="Select your role">
            <Option
              v-for="item in RoleTableData"
              :value="item.id"
              :key="item.id"
              >{{ item.role_name }}</Option
            >
          </Select>
        </FormItem> -->
            </Form>
            <div slot="footer">
                <Button type="primary" :long="true" @click="handleSubmit('formCustoms')" v-if="num == 2">确认修改</Button>
            </div>
        </Modal>
        <!-- 用户操作权限的Modal -->
        <Modal v-model="operationModel" :mask-closable="false" width="40" :styles="{top:0}">
            <p slot="header" style="color:#fff;text-align:center">
                <span>用户操作权限</span>
            </p>
            <div class="modal-body" :class="{'modal-body-show':isTaskbarShow}">
                <Form ref="formValidate" :model="formValidate" :label-width="80" v-if="app.length > 0 || config.length > 0 || L7Instance.length > 0">
                    <div>
                        <div>
                            <Checkbox :value="checkAllAPP" :disabled="userInfo.role_id === 1 ? true : false" @click.prevent.native="handleCheckAllAPP" v-if="userInfo.role_id === 2"><span>APP全选</span></Checkbox>
                            <Checkbox :value="checkAllAPP" :disabled="userInfo.role_id === 1 ? true : false" v-if="userInfo.role_id === 1"><span>APP全选</span></Checkbox>
                        </div>
                        <FormItem label="" prop="apps" v-if="app.length > 0">
                            <CheckboxGroup v-model="formValidate.apps" @on-change="checkAllGroupChangeAPP">
                                <Checkbox :label="value.app_id" border :disabled="userInfo.role_id === 1 ? true : false" v-for="value in app" style="margin-top: 4px;">
                                    <span>{{ value.app_name }}</span>
                                </Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                    </div>
                    <div>
                        <div>
                            <Checkbox :value="checkAllL7" :disabled="userInfo.role_id === 1 ? true : false" @click.prevent.native="handleCheckAllL7" v-if="userInfo.role_id === 2"><span>实例全选</span></Checkbox>
                            <Checkbox :value="checkAllL7" :disabled="userInfo.role_id === 1 ? true : false" v-if="userInfo.role_id === 1"><span>实例全选</span></Checkbox>
                        </div>
                        <FormItem label="" prop="l7ServerInfos" v-if="L7Instance.length > 0">
                            <CheckboxGroup v-model="formValidate.l7ServerInfos" @on-change="checkAllGroupChangeL7">
                                <Checkbox :label="value.l7ServerId" border :disabled="userInfo.role_id === 1 ? true : false" v-for="value in L7Instance" style="margin-top: 4px;">
                                    <span>{{ value.l7ServerName }}</span>
                                </Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                    </div>
                    <div>
                        <div>
                            <Checkbox :value="checkAllConfig" :disabled="userInfo.role_id === 1 ? true : false" @click.prevent.native="handleCheckAllConfig" v-if="userInfo.role_id === 2"><span>配置全选</span></Checkbox>
                            <Checkbox :value="checkAllConfig" :disabled="userInfo.role_id === 1 ? true : false" v-if="userInfo.role_id === 1"><span>配置全选</span></Checkbox>
                        </div>
                        <FormItem label="" v-if="config.length > 0">
                            <CheckboxGroup v-model="formValidate.confs" @on-change="checkAllGroupChangeConfig">
                                <Checkbox :label="value.nginx_conf_id" border :disabled="userInfo.role_id === 1 ? true : false" v-for="value in config" style="margin-top: 4px;">
                                    <span>{{ value.config_name }}</span>
                                </Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                    </div>
                    <FormItem label="VMware">
                        <RadioGroup v-model="formValidate.vm_permission">
                            <Radio border :label="0">只读</Radio>
                            <Radio border :label="1">读写</Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
                <div style="text-align: center;font-size: 16px;margin: 28px 0;" v-if="
          app.length === 0 || config.length === 0 || L7Instance.length === 0
        ">
                    暂无权限操作,请添加APP,实例,或者配置
                </div>
            </div>

            <div slot="footer">
                <Button type="primary" :loading="operationLoading" :long="true" @click="uptUserPermission()" :disabled="userInfo.role_id === 1 ? true : false" v-if="app.length > 0 || config.length > 0 || L7Instance.length > 0">确认修改</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {
    insSysUersInso,
    selSysUersInfoAll,
    delSysUersInso,
    uptSysUersInso,
    selRoleInfo,
    selUserPermission,
    uptUserPermission,
    delUserPermission,
    insUserPermission,
    selPermissionByApp,
} from "@/api/account";
import { selAppInfoList } from "@/api/app";
import { selL7ServerInfoAll, getNginxConfALL } from "@/api/L7";
import { mapState } from "vuex";
export default {
    data() {
        const validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                if (this.formCustom.passwordCheck !== "") {
                    // 对第二个密码框单独验证
                    this.$refs.formCustom.validateField("passwordCheck");
                }
                callback();
            }
        };
        const validatePassCheck = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.formCustom.passwd) {
                callback(new Error("两次输入的密码不相同"));
            } else {
                callback();
            }
        };
        const validateRole = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("角色不能为空"));
            } else {
                callback();
            }
        };
        return {
            isCollapsed: false,
            AddModel: false,
            EditModel: false,
            formCustom: {
                username: "",
                usernumber: "",
                tag: "",
                role: "",
                passwd: "",
                passwordCheck: "",
            },
            ruleCustom: {
                username: [
                    {
                        required: true,
                        message: "名称不能为空",
                        trigger: "blur",
                    },
                ],
                usernumber: [
                    {
                        required: true,
                        message: "账号不能为空",
                        trigger: "blur",
                    },
                ],
                passwd: [
                    {
                        required: true,
                        validator: validatePass,
                        trigger: "blur",
                    },
                ],
                passwordCheck: [
                    {
                        required: true,
                        validator: validatePassCheck,
                        trigger: "blur",
                    },
                ],
                tag: [
                    {
                        required: true,
                        message: "标签不能为空",
                        trigger: "blur",
                    },
                ],
                role: [
                    {
                        required: true,
                        validator: validateRole,
                        trigger: "blur",
                    },
                ],
            },
            UserTableColumns: [
                {
                    title: "用户名称",
                    key: "user_name",
                },
                {
                    title: "标签",
                    slot: "tag",
                },
                {
                    title: "角色",
                    slot: "role_name",
                },
                {
                    title: "创建时间",
                    key: "ctime",
                },
                // {
                //   title: "最后一次登录时间",
                //   key: "last_login",
                // },
                {
                    slot: "operation",
                },
            ],
            UserTableData: [],
            loading: false,
            user_length: "",
            num: "",
            user_id: "",
            status: 1,
            role_length: "",
            RoleTableColumns: [
                {
                    title: "角色名称",
                    key: "role_name",
                },
                {
                    title: "角色ID",
                    key: "id",
                },
                {
                    title: "备注",
                    key: "remark",
                },
            ],
            RoleTableData: [],
            formValidate: {
                user_name: "",
                apps: [],
                l7ServerInfos: [],
                confs: [],
                id: "",
                user_id: "",
                vm_permission: 0,
            },
            app: [],
            L7Instance: [],
            config: [],
            operationModel: false,
            operationLoading: false,
            checkAllAPP: false,
            checkAllL7: false,
            checkAllConfig: false,
        };
    },
    computed: {
        menuitemClasses: function () {
            return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
        },
        ...mapState({
            userInfo: (state) => state.login.userInfo,
            isTaskbarShow: (state) => state.taskbar.isTaskbarShow,
        }),
    },
    methods: {
        //判断'添加Model'或者'修改Model'输入的内容是否正确
        handleSubmit(name) {
            if (this.num == 1) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.AddModel = false;
                        this.AddUesr();
                    } else {
                        this.$Message.error("Fail!");
                    }
                });
            } else {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.EditModel = false;
                        this.EditUser();
                    } else {
                        this.$Message.error("Fail!");
                    }
                });
            }
        },
        //弹出添加Model
        add_user() {
            this.AddModel = true;
            this.num = 1;
            this.formCustom.username = "";
            this.formCustom.tag = "";
            this.formCustom.role = "";
            this.formCustom.usernumber = "";
            this.formCustom.passwd = "";
            this.formCustom.passwordCheck = "";
            //   this.GetRole();
        },
        //弹出修改Model
        edit_user(row) {
            // console.log(row);
            this.EditModel = true;
            this.num = 2;
            this.formCustom.username = row.user_name;
            this.formCustom.tag = row.tag;
            this.formCustom.role = row.role_id;
            this.formCustom.usernumber = row.user_no;
            this.user_id = row.id;
            this.formCustom.passwd = row.password;
            this.formCustom.passwordCheck = row.password;
            //   this.GetRole();
        },
        //侧边栏切换更换相应内容
        GetMenuValue(name) {
            if (name === "user") {
                this.status = 1;
                this.GetAllUser();
            } else {
                this.status = 2;
                this.GetRole();
            }
        },
        //添加用户信息
        async AddUesr() {
            let json = {
                user_name: this.formCustom.username,
                user_no: this.formCustom.usernumber,
                password: this.formCustom.passwd,
                tag: this.formCustom.tag,
                role_id: this.formCustom.role,
            };
            let res = await insSysUersInso(json);
            if (res.data.code === "success") {
                this.$Message.info("添加成功");
                this.GetAllUser();
            } else {
                this.$Message.error(`${res.data.result}`);
            }
        },
        //查询所有用户信息
        async GetAllUser() {
            this.loading = true;
            let res = await selSysUersInfoAll();
            if (res.data.code === "success") {
                this.loading = false;
                this.user_length = res.data.result.length;
                this.UserTableData = res.data.result;
                this.selectList = res.data.result;
            } else {
                this.loading = false;
            }
        },
        //删除用户信息
        async DeleteUser(id) {
            this.$Modal.confirm({
                title: "警告",
                content: "确定删除该用户？",
                onOk: async () => {
                    let res = await delSysUersInso(id);
                    if (res.data.code === "success") {
                        this.$Message.info("删除成功");
                        // this.$Modal.remove();
                        this.GetAllUser();
                    } else {
                        this.$Message.error(`${res.data.result}`);
                    }
                },
            });
        },
        //修改用户信息
        async EditUser() {
            let json = {
                user_name: this.formCustom.username,
                user_no: this.formCustom.usernumber,
                password: this.formCustom.passwd,
                tag: this.formCustom.tag,
                role_id: this.formCustom.role,
                id: this.user_id,
            };
            let res = await uptSysUersInso(json);
            if (res.data.code === "success") {
                this.$Message.info("修改成功");
                this.GetAllUser();
            } else {
                this.$Message.error(`${res.data.result}`);
            }
        },
        //获取角色信息
        async GetRole() {
            this.loading = true;
            let res = await selRoleInfo();
            //   console.log(res.data.result);
            this.loading = false;
            this.role_length = res.data.result.length;
            this.RoleTableData = res.data.result;
        },
        //弹出用户操作权限Modal
        EditOperation(row) {
            this.operationModel = true;
            this.formValidate.apps = [];
            this.formValidate.l7ServerInfos = [];
            this.formValidate.confs = [];
            this.checkAllAPP = false;
            this.checkAllL7 = false;
            this.checkAllConfig = false;
            this.selUserPermission(row.id);
        },
        //获取所有app
        // async GetApp() {
        //   let res = await selAppInfoList();
        //   if (res.data.code === "success") {
        //     this.app = res.data.result;
        //   }
        // },
        //获取所有实例
        async GetInstance() {
            let res = await selL7ServerInfoAll();
            if (res.data.code === "success") {
                if (res.data.result) {
                    for (let k in res.data.result) {
                        res.data.result[k].map(function (item) {
                            this.L7Instance.push({
                                l7ServerName: item.l7ServerName,
                                l7ServerId: item.l7ServerId,
                            });
                        }, this);
                    }
                }
            }
        },
        //获取所有配置
        async GetConfig() {
            let res = await getNginxConfALL();
            if (res.data.code === "success") {
                this.config = res.data.result || [];
            }
        },
        //查询所有APP绑定权限信息
        async GetselPermissionByApp() {
            let res = await selPermissionByApp();
            if (res.data.code === "success") {
                this.app = res.data.result || [];
            }
        },
        //查询用户操作权限
        async selUserPermission(id) {
            let res = await selUserPermission({ user_id: id });
            if (res.data.code === "success") {
                this.formValidate = res.data.result || [];
                this.formValidate.vm_permission = 0;
                if (this.formValidate) {
                    if (this.formValidate.apps) {
                        if (this.formValidate.apps[0] === "") {
                            this.formValidate.apps.splice(0, 1);
                        }
                    }
                    if (this.formValidate.l7ServerInfos) {
                        if (this.formValidate.l7ServerInfos[0] === "") {
                            this.formValidate.l7ServerInfos.splice(0, 1);
                        }
                    }
                    if (this.formValidate.confs) {
                        if (this.formValidate.confs[0] === "") {
                            this.formValidate.confs.splice(0, 1);
                        }
                    }
                    if (this.formValidate.apps) {
                        if (this.formValidate.apps.length === this.app.length) {
                            this.checkAllAPP = true;
                        }
                    }
                    if (this.formValidate.l7ServerInfos) {
                        if (
                            this.formValidate.l7ServerInfos.length ===
                            this.L7Instance.length
                        ) {
                            this.checkAllL7 = true;
                        }
                    }
                    if (this.formValidate.confs) {
                        if (
                            this.formValidate.confs.length ===
                            this.config.length
                        ) {
                            this.checkAllConfig = true;
                        }
                    }
                }
            }
        },
        //修改用户操作权限
        async uptUserPermission() {
            this.operationLoading = true;
            if (this.formValidate && this.formValidate.apps) {
                if (this.formValidate.apps[0] === "") {
                    this.formValidate.apps.splice(0, 1);
                }
            }
            if (this.formValidate && this.formValidate.l7ServerInfos) {
                if (this.formValidate.l7ServerInfos[0] === "") {
                    this.formValidate.l7ServerInfos.splice(0, 1);
                }
            }
            if (this.formValidate && this.formValidate.confs) {
                if (this.formValidate.confs[0] === "") {
                    this.formValidate.confs.splice(0, 1);
                }
            }
            let res = await uptUserPermission(this.formValidate);
            this.operationLoading = false;
            if (res.data.code === "success") {
                this.$Message.success("修改成功!");
            } else {
                this.$Message.error(`${res.data.result}`);
            }
        },
        //APP全选
        handleCheckAllAPP() {
            if (this.checkAllAPP) {
                this.checkAllAPP = false;
            } else {
                this.checkAllAPP = !this.checkAllAPP;
            }
            if (this.checkAllAPP) {
                this.formValidate.apps = this.app.map((i) => {
                    return i.app_id;
                });
                this.app.map((i) => {
                    if (this.formValidate.confs) {
                        if (this.formValidate.confs.indexOf(i.conf_id) === -1) {
                            this.formValidate.confs.push(i.conf_id);
                        }
                    }
                    i.instanceParamList.map((v) => {
                        if (this.formValidate.l7ServerInfos) {
                            if (
                                this.formValidate.l7ServerInfos.indexOf(
                                    v.instance_id
                                ) === -1
                            ) {
                                this.formValidate.l7ServerInfos.push(
                                    v.instance_id
                                );
                            }
                        }
                    });
                });
                if (this.formValidate.l7ServerInfos) {
                    if (
                        this.formValidate.l7ServerInfos.length ===
                        this.L7Instance.length
                    ) {
                        this.checkAllL7 = true;
                    }
                }
                if (this.formValidate.confs) {
                    if (this.formValidate.confs.length === this.config.length) {
                        this.checkAllConfig = true;
                    }
                }
            } else {
                this.formValidate.apps = [];
            }
        },
        //勾选单个APP
        checkAllGroupChangeAPP(data) {
            if (data[0] === "") {
                data.splice(0, 1);
            }
            if (
                data.length ===
                this.app.map((i) => {
                    return i.app_id;
                }).length
            ) {
                this.checkAllAPP = true;
            } else if (data.length > 0) {
                this.checkAllAPP = false;
            } else {
                this.checkAllAPP = false;
            }
            if (data.length > 0) {
                this.app.map((v) => {
                    if (data.indexOf(v.app_id) !== -1) {
                        if (this.formValidate.confs) {
                            if (
                                this.formValidate.confs.indexOf(v.conf_id) ===
                                -1
                            ) {
                                this.formValidate.confs.push(v.conf_id);
                            }
                        }
                        v.instanceParamList.map((x) => {
                            if (this.formValidate.l7ServerInfos) {
                                if (
                                    this.formValidate.l7ServerInfos.indexOf(
                                        x.instance_id
                                    ) === -1
                                ) {
                                    this.formValidate.l7ServerInfos.push(
                                        x.instance_id
                                    );
                                }
                            }
                        });
                    }
                });
                if (this.formValidate.l7ServerInfos) {
                    if (
                        this.formValidate.l7ServerInfos.length ===
                        this.L7Instance.length
                    ) {
                        this.checkAllL7 = true;
                    }
                }
                if (this.formValidate.confs) {
                    if (this.formValidate.confs.length === this.config.length) {
                        this.checkAllConfig = true;
                    }
                }
            }
        },
        //实例全选
        handleCheckAllL7() {
            if (this.checkAllL7) {
                this.checkAllL7 = false;
            } else {
                this.checkAllL7 = !this.checkAllL7;
            }
            if (this.checkAllL7) {
                this.formValidate.l7ServerInfos = this.L7Instance.map((i) => {
                    return i.l7ServerId;
                });
            } else {
                this.formValidate.l7ServerInfos = [];
                if (this.formValidate.apps) {
                    if (this.formValidate.apps.length > 0) {
                        this.app.map((i) => {
                            if (
                                this.formValidate.apps.indexOf(i.app_id) !== -1
                            ) {
                                i.instanceParamList.map((v) => {
                                    if (this.formValidate.l7ServerInfos) {
                                        if (
                                            this.formValidate.l7ServerInfos.indexOf(
                                                v.instance_id
                                            ) === -1
                                        ) {
                                            this.formValidate.l7ServerInfos.push(
                                                v.instance_id
                                            );
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            }
        },
        //勾选单个实例
        checkAllGroupChangeL7(data) {
            if (data[0] === "") {
                data.splice(0, 1);
            }
            if (this.formValidate.apps) {
                if (this.formValidate.apps.length > 0) {
                    this.app.map((i) => {
                        if (this.formValidate.apps.indexOf(i.app_id) !== -1) {
                            i.instanceParamList.map((v) => {
                                if (this.formValidate.l7ServerInfos) {
                                    if (
                                        this.formValidate.l7ServerInfos.indexOf(
                                            v.instance_id
                                        ) === -1
                                    ) {
                                        this.formValidate.l7ServerInfos.push(
                                            v.instance_id
                                        );
                                    }
                                }
                            });
                        }
                    });
                }
            }
            if (
                data.length ===
                this.L7Instance.map((i) => {
                    return i.l7ServerId;
                }).length
            ) {
                this.checkAllL7 = true;
            } else if (data.length > 0) {
                this.checkAllL7 = false;
            } else {
                this.checkAllL7 = false;
            }
        },
        //配置全选
        handleCheckAllConfig() {
            if (this.checkAllConfig) {
                this.checkAllConfig = false;
            } else {
                this.checkAllConfig = !this.checkAllConfig;
            }
            if (this.checkAllConfig) {
                this.formValidate.confs = this.config.map((i) => {
                    return i.nginx_conf_id;
                });
            } else {
                this.formValidate.confs = [];
                if (this.formValidate.apps) {
                    if (this.formValidate.apps.length > 0) {
                        this.app.map((i) => {
                            if (
                                this.formValidate.apps.indexOf(i.app_id) !== -1
                            ) {
                                if (this.formValidate.confs) {
                                    if (
                                        this.formValidate.confs.indexOf(
                                            i.conf_id
                                        ) === -1
                                    ) {
                                        this.formValidate.confs.push(i.conf_id);
                                    }
                                }
                            }
                        });
                    }
                }
            }
        },
        //勾选单个配置
        checkAllGroupChangeConfig(data) {
            if (data[0] === "") {
                data.splice(0, 1);
            }
            if (this.formValidate.apps) {
                if (this.formValidate.apps.length > 0) {
                    this.app.map((i) => {
                        if (this.formValidate.apps.indexOf(i.app_id) !== -1) {
                            if (this.formValidate.confs) {
                                if (
                                    this.formValidate.confs.indexOf(
                                        i.conf_id
                                    ) === -1
                                ) {
                                    this.formValidate.confs.push(i.conf_id);
                                }
                            }
                        }
                    });
                }
            }
            if (
                data.length ===
                this.config.map((i) => {
                    return i.nginx_conf_id;
                }).length
            ) {
                this.checkAllConfig = true;
            } else if (data.length > 0) {
                this.checkAllConfig = false;
            } else {
                this.checkAllConfig = false;
            }
        },
    },
    mounted() {
        this.GetAllUser();
        // this.GetApp();
        this.GetselPermissionByApp();
        this.GetInstance();
        this.GetConfig();
    },
};
</script>

<style lang="less" scoped>
.menu-item span {
    display: inline-block;
    overflow: hidden;
    width: 86px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width 0.2s ease 0.2s;
}
.menu-item i {
    transform: translateX(0px);
    transition: font-size 0.2s ease, transform 0.2s ease;
    vertical-align: middle;
    font-size: 16px;
}
.collapsed-menu span {
    width: 0px;
    transition: width 0.2s ease;
}
.collapsed-menu i {
    transform: translateX(5px);
    transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
    vertical-align: middle;
    font-size: 22px;
}
/deep/ .ivu-layout-sider-trigger,
.ivu-menu-light,
.ivu-layout-sider {
    background-color: #e8eaec;
}
/deep/ .ivu-icon-ios-arrow-back {
    color: #000;
}
/deep/ .ivu-menu {
    color: #000;
}
/deep/ .ivu-menu-item {
    height: 80px;
    line-height: 45px;
}
.add-button {
    position: absolute;
    right: 32px;
    top: 96px;
}
/deep/ .ivu-table-row:hover {
    cursor: pointer;
}
.under-table {
    margin: 10px 0 0 20px;
}
.under-table > span {
    color: red;
    font-weight: bolder;
}
/deep/.ivu-table-row {
    height: 80px;
}
/deep/.ivu-table-header th:nth-child(5) {
    color: #f8f8f9;
}
/deep/.ivu-table-header th {
    height: 60px;
}
/deep/.ivu-modal-footer {
    border: #fff;
}
</style>
