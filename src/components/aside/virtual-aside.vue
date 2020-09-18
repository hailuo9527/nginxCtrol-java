<template>
    <div class="aside-wrap">
        <Input suffix="ios-search" v-model.trim="searchString" placeholder="搜索虚拟机" clearable />
        <div style="display: flex; justify-content: center">
            <div class="add-list" @click="loginModal = true">
                <!--      <span>添加</span>-->
                <Tooltip content="添加虚拟机" placement="top" max-width="200" theme="light">
                    <Icon type="md-add" color="#fff" :size="25" />
                </Tooltip>
            </div>
        </div>

        <div class="aside-list">
            <div class="aside-list-wrap" v-if="filterAside.length > 0">
                <div style="display: flex;justify-content: start;" v-for="(item, index) in filterAside">
                    <div>
                        <Menu theme="light" :open-names="openName">
                            <Submenu :name="item.serverName" :key="index">
                                <template slot="title">
                                    <Icon type="ios-paper" />
                                    {{ item.serverName }}
                                </template>
                                <MenuItem name="1-1" class="aside-item" :class="
                    value.hostName === activeAside.hostName && asideIndex === 0
                      ? 'active'
                      : ''
                  " v-for="(value, key) in item.hostSystemList" :key="key">
                                <div @click="changeAside(value)">
                                    <div class="title">
                                        <!-- <span class="online" v-if="value.push_status"></span>
                  <span class="offline" v-else></span> -->
                                        {{ value.hostName }}
                                    </div>
                                    <div style="margin-left: -4px;"></div>
                                </div>
                                </MenuItem>
                                <MenuItem name="1-2" class="aside-item" :class="asideIndex === 1 ? 'active' : ''">
                                <div @click="changeAsideLast(item.customizationSpecNameList)">
                                    <div class="title">
                                        {{ "自定义虚拟机规范配置" }}
                                    </div>
                                    <div style="margin-left: -4px;"></div>
                                </div>
                                </MenuItem>
                            </Submenu>
                        </Menu>
                    </div>
                    <div style="padding-top: 14px;padding-left: 4px;cursor: pointer;">
                        <Icon type="md-close" @click="handleRemove(item, index)" />
                    </div>
                </div>
            </div>
            <div class="aside-list-wrap" style="text-align: center" v-else>
                暂无数据
            </div>
            <div class="load-wrap" style="display: flex; justify-content: center;align-items: center;" v-if="shareLoading">
                <Loading />
            </div>
        </div>

        <Modal v-model="loginModal" :mask-closable="false">
            <p slot="header" style="color:#fff;text-align:center">
                <span>添加VMware vSphere Client</span>
            </p>
            <div style="padding:1rem;">
                <Form ref="loginForm" :model="loginForm" :rules="ruleValidate">
                    <FormItem label="IP" prop="url">
                        <Input v-model="loginForm.url"></Input>
                    </FormItem>
                    <FormItem label="账号" prop="userName">
                        <Input v-model="loginForm.userName"></Input>
                    </FormItem>
                    <FormItem label="密码" prop="password">
                        <Input v-model="loginForm.password" type="password"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button @click="loginModal = false">取消</Button>
                <Button type="primary" @click="VMwareLogin('loginForm')" :loading="LoginLoading">登录</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { insVMware, selVMwareInfo, delVMConnection } from "@/api/VMware";
import { mapMutations, mapState } from "vuex";
export default {
    data() {
        return {
            searchString: "",
            loginModal: false,
            loginForm: {
                url: "",
                userName: "",
                password: "",
            },
            filterAside: [],
            LoginLoading: false,
            ruleValidate: {
                url: [{ required: true, message: "不能为空", trigger: "blur" }],
                userName: [
                    { required: true, message: "不能为空", trigger: "blur" },
                ],
                password: [
                    { required: true, message: "不能为空", trigger: "blur" },
                ],
            },
            asideNameMap: [],
            asideIndex: 0,
            openName: [],
        };
    },
    computed: {
        ...mapState({
            asideList: (state) => state.VMware.asideList,
            activeAside: (state) => state.VMware.activeAside,
            shareLoading: (state) => state.VMware.shareLoading,
        }),
        // 匹配搜索
        filterAside: function () {
            let arr = this.asideList;
            let searchString = this.searchString;

            if (!searchString) {
                return arr;
            }
            arr = arr.filter(function (item) {
                if (item.hostName.indexOf(searchString) !== -1) {
                    return item;
                }
            });

            // 返回过来后的数组
            return arr;
        },
    },
    methods: {
        ...mapMutations([
            "VMwareSetActiveAside",
            "VMwareSetAsideList",
            "VMwareSetshareLoading",
            "VMwareSetAllValue",
        ]),
        //点击主机
        changeAside(item) {
            this.asideIndex = 0;
            if (item.hostName === this.activeAside.hostName) return;
            if (this.$route.name === "Vmware-customization") {
                this.$router.push("/VMware/virtual");
            }
            this.VMwareSetActiveAside(item);
        },
        //点击自定义虚拟机规范配置
        changeAsideLast(item) {
            this.asideIndex = 1;
            this.VMwareSetActiveAside(item);
            this.$router.push("/VMware/customization");
        },
        //添加虚拟主机
        VMwareLogin(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.LoginLoading = true;
                    insVMware(this.loginForm).then((res) => {
                        this.LoginLoading = false;
                        if (res.data.code === "success") {
                            this.loginModal = false;
                            this.GetVMwareInfo();
                        } else {
                            this.$Message.error(`${res.data.result}`);
                        }
                    });
                } else {
                    this.$Message.error("请检查输入是否正确!");
                }
            });
        },
        //查询虚拟机信息
        async GetVMwareInfo() {
            this.VMwareSetActiveAside([]);
            this.VMwareSetAsideList([]);
            this.VMwareSetshareLoading(true);
            this.filterAside = [];
            let tempList = [];
            let res = await selVMwareInfo();
            if (res.data.code === "success") {
                if (res.data.result) {
                    this.VMwareSetshareLoading(false);
                    this.VMwareSetAllValue(res.data.result);
                    for (let key in res.data.result) {
                        if(res.data.result[key][0].hostSystemList !== null){
                            this.VMwareSetActiveAside(res.data.result[key][0].hostSystemList[0]);
                            break;
                        }
                    }
                    for (let key in res.data.result) {
                        if (
                            res.data.result[key][0].hostSystemList &&
                            res.data.result[key][0].hostSystemList !== null &&
                            res.data.result[key][0].customizationSpecNameList !== null
                        ) {
                            res.data.result[key][0].hostSystemList.map((item, index) => {
                                    tempList.push(item);
                                }
                            );
                            this.filterAside.push(res.data.result[key][0]);
                        }
                    }
                    this.VMwareSetAsideList(tempList);
                    this.openName = Object.keys(res.data.result);
                }
            } else {
                this.$Message.error(`${res.data.result}`);
            }
        },
        //删除服务器链接信息
        handleRemove(item, index) {
            console.log(item);
            this.$Modal.confirm({
                title: "提示",
                content: "<p>确定要删除此服务器？</p>",
                loading: true,
                onOk: async () => {
                    let res = await delVMConnection({
                        id: item.id,
                    });
                    if (res.data.code === "success") {
                        this.$Modal.remove();
                        this.$Message.success("删除成功!");
                        this.GetVMwareInfo();
                    } else {
                        this.$Modal.remove();
                        this.$Message.error(`${res.data.result}`);
                    }
                },
            });
        },
    },
    mounted() {
        if (
            this.$route.name === "VMware" ||
            this.$route.name === "Vmware-customization"
        ) {
            this.$router.replace(`/VMware/virtual`);
        }
        this.GetVMwareInfo();
    },
};
</script>

<style lang="less" scoped>
.aside-wrap {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
    flex: 0 0 245px;
    padding: 15px 15px 3px 10px;
    background: #e8eaec;
    overflow: hidden;
    /deep/.ivu-input {
        border-radius: 16px;
    }
    .aside-list {
        margin-top: 20px;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        //margin-bottom: 60px;
        position: relative;
        &::-webkit-scrollbar {
            // display: none;
        }
        .aside-list-wrap {
        }
        .load-wrap {
            position: fixed;
            top: 70px;
            left: 0;
            bottom: 0;

            width: 245px;
            background-color: hsla(0, 0%, 100%, 0.9);
            z-index: 999;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .aside-item {
            padding: 10px;
            margin-bottom: 10px;
            background: #f5f5f5;
            height: 68px;
            box-sizing: border-box;
            cursor: pointer;
            position: relative;
            .title {
                color: #000;
                height: 40px;
                font-size: 14px;
                margin: 0px 0px 3px;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 214px;
                white-space: nowrap;
                span {
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    margin-right: 10px;
                }
                .online {
                    background-color: @green;
                }
                .offline {
                    background: #e9e9e9;
                }
                .error {
                    background: #ed4014;
                }
            }
            .info {
                display: inline-block;
                box-sizing: border-box;
                max-width: 100%;
                padding-left: 26px;
                font-family: "RobotoLight", Arial, sans-serif;
                font-weight: normal;
                //line-height: 14px;
                color: #666;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            &:hover {
                background: #fff;
                .delete,
                .edit,
                .menu {
                    display: block;
                }
            }
            .edit {
                position: absolute;
                top: 16px;
                right: 0;
                display: none;
                opacity: 0.5;
                transition: all 0.2s;
                &:hover {
                    opacity: 1;
                }
            }
            .delete {
                position: absolute;
                top: 0;
                right: 0;
                display: none;
                opacity: 0.6;
                transition: all 0.2s;
                &:hover {
                    opacity: 1;
                    transform: rotate(180deg);
                }
            }
            .menu {
                position: absolute;
                top: 5px;
                right: 0;
                display: none;
                opacity: 0.7;
                transition: all 0.2s;
                &:hover {
                    opacity: 1;
                }
            }
            .replace {
                position: absolute;
                top: 20px;
                right: 0px;
                display: none;
            }
            &.active {
                border-bottom: 6px solid @green;
                background: #fff;
                &.disable {
                    border-bottom: 6px solid #ed4014;
                }
            }
            &.disable {
                .info {
                    color: #cecccc;
                }
            }
        }
    }
    .add-list {
        cursor: pointer;
        margin-top: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: @green;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
.aside-wrap {
    padding: 15px 0 0 0;
}
.aside-item {
    padding-left: 20px !important;
}
/deep/.ivu-menu-light {
    background: #e8eaec;
}
/deep/.ivu-menu {
    padding: 0 5px;
    background: #e8eaec;
    width: 220px !important;
}
/deep/.ivu-menu-vertical .ivu-menu-item,
/deep/.ivu-menu-vertical .ivu-menu-submenu-title {
    padding: 14px 5px;
}
/deep/.ivu-menu-vertical .ivu-menu-submenu-title-icon {
    right: 0;
}
/deep/.ivu-menu-light.ivu-menu-vertical
    .ivu-menu-item-active:not(.ivu-menu-submenu):after {
    display: none;
}
/deep/.ivu-menu-vertical.ivu-menu-light:after {
    width: 0;
}
/deep/.ivu-menu-submenu-title {
    width: 220px;
}
</style>
