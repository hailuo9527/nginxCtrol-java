<template>
    <div class="content_wrap">
        <Aside />
        <div class="content_right">
            <div class="content_right_scroll">
                <div class="content_header">
                    <div class="header_title">
                        <span v-if="!shareLoading">
                            {{ activeAside instanceof Array ? "配置" : activeAside.hostName }}
                            <!-- <Icon
                class="icon"
                @click="openDrawer = true"
                type="md-settings"
              /> -->
                        </span>
                        <!-- <Button type="primary" v-if="$route.name === 'VMware-virtual' && !shareLoading" @click="openCopyModal">克隆</Button> -->
                        <Button type="primary" @click="clickRefurbishVCenterVoInfo" icon="md-refresh" v-if="!shareLoading">同步信息</Button>
                        <!-- <span class="status">
              <Icon
                type="md-happy"
                size="20"
                color="#21a37a"
                v-if="activeAside.is_sync"
              />
              <Icon
                type="md-sad"
                size="20"
                color="#fb1010"
                v-if="!activeAside.is_sync"
              />
              <span>状态</span>: {{ activeAside.is_sync ? "已同步" : "未同步" }}
            </span> -->
                        <!-- <div
              style="display: inline-block; margin-left: 10px"
              class="Pop-tip"
             >
              <Icon
                type="md-git-compare"
                size="20"
                style="cursor: pointer"
                v-if="!activeAside.is_sync"
                @click="showModal()"
              />
              <Modal
                v-model="compareModal"
                :mask="true"
                width="80"
                :mask-closable="false"
              >
                <span slot="close"></span>
                <div v-if="!Compareloading">
                  <div
                    slot="close"
                    style="text-align: right;margin: -10px -6px 10px 0;"
                  >
                    <Icon
                      type="md-close"
                      size="22"
                      style="cursor: pointer;"
                      @click="compareModal = false"
                    />
                  </div>
                  <code-diff
                    :old-string="oldStr"
                    :new-string="newStr"
                    :context="1000"
                    outputFormat="side-by-side"
                    v-if="popTip_status"
                  />
                  <div
                    v-if="!popTip_status"
                    style="font-size: 18px;padding: 10px 10px 10px 50px"
                  >
                    您还没修改过APP配置或还未发布
                  </div>
                </div>
                <div class="loading-spin">
                  <Loading color="#01c864" v-if="Compareloading" />
                </div>
                <div slot="footer">
                  <Button
                    @click="compareModal = false"
                    style="margin-right: 10px"
                    >取消</Button
                  >
                  <Poptip
                    confirm
                    title="是否确定回滚?"
                    ok-text="确定"
                    @on-ok="RollBack"
                    cancel-text="取消"
                    style="color: #000"
                  >
                    <Button type="primary" :disabled="!popTip_status"
                      >回滚</Button
                    >
                  </Poptip>
                </div>
              </Modal>
            </div> -->
                    </div>
                    <div class="header_tab">
                        <div class="tab" v-if="(activeAside instanceof Array) && !shareLoading">
                            <router-link :to="`/VMware/customization`" class="tab_item">自定义虚拟机规范配置</router-link>
                        </div>
                        <div class="tab" v-if="!(activeAside instanceof Array) && !shareLoading">
                            <router-link :to="`/VMware/virtual`" class="tab_item">虚拟机</router-link>
                            <router-link :to="`/VMware/resourcepool`" class="tab_item">资源池</router-link>
                            <router-link :to="`/VMware/datastorage`" class="tab_item">数据存储</router-link>
                            <router-link :to="`/VMware/template`" class="tab_item">模板</router-link>
                            <!-- <router-link
                :to="`/app/${$route.params.app}/config`"
                class="tab_item"
                >配置</router-link
              > -->
                        </div>
                    </div>
                </div>
                <router-view class="content_main"></router-view>
            </div>
        </div>
        <!-- <div class="content_right" v-else>
      <div class="no-data">暂无数据，点击左侧“+”创建APP</div>
    </div> -->
        <Modal v-model="CopyModal" width="40" :mask-closable="false">
            <p slot="header" style="color:#333;text-align:center">
                <span>克隆虚拟机</span>
            </p>
            <div>
                <Form ref="CopyForm" :model="CopyForm" :rules="ruleValidate">
                    <FormItem label="资源池名称" prop="resourcePoolName">
                        <Select v-model="CopyForm.resourcePoolName" clearable>
                            <Option v-for="item in activeAside.resourcePoolNameList" :value="item.vm_name" :key="item.vm_name">{{ item.vm_name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="数据存储名称" prop="dataStoreName">
                        <Select v-model="CopyForm.dataStoreName" clearable>
                            <Option v-for="item in activeAside.datastoreNameList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                    <div style="margin-bottom: 8px;">
                        <span style="color: #ed4014;font-family: SimSun;font-size: 14px;margin-right: 4px;">*</span><span style="font-size: 14px;color: #515a6e;">规则</span>
                        <popTip content="自定义虚拟机规范配置" style="margin-left: 5px;"></popTip>
                    </div>
                    <FormItem label="" prop="customizationSpecName">
                        <Select v-model="CopyForm.customizationSpecName" clearable @on-select="select">
                            <Option v-for="item in customizationSpecNameList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                    <div style="margin-bottom: 8px;">
                        <span style="font-size: 14px;color: #515a6e;">IP地址</span>
                        <popTip content="输入未使用的IP地址若不输入默认使用DHCP自动分配" style="margin-left: 5px;"></popTip>
                    </div>
                    <FormItem label="" prop="ipAddress">
                        <Input v-model="CopyForm.ipAddress" placeholder="请输入IP地址"></Input>
                    </FormItem>
                    <div style="margin-bottom: 8px;" v-if="CopyForm.customizationSpecName">
                        <span style="font-size: 14px;color: #515a6e;">DNS服务列表</span>
                        <popTip content="可选择或者手动输入" style="margin-left: 5px;"></popTip>
                    </div>
                    <FormItem label="" prop="dnsServerList" v-if="CopyForm.customizationSpecName">
                        <Select v-model="CopyForm.dnsServerList" filterable multiple allow-create @on-create="handleDnsServerList">
                            <Option v-for="(item, index) in dnsServerList" :value="item" :key="index">{{ item }}</Option>
                        </Select>
                    </FormItem>
                    <div style="margin-bottom: 8px;" v-if="CopyForm.customizationSpecName">
                        <span style="font-size: 14px;color: #515a6e;">网关列表</span>
                        <popTip content="可选择或者手动输入" style="margin-left: 5px;"></popTip>
                    </div>
                    <FormItem label="" prop="gatewayList" v-if="CopyForm.customizationSpecName">
                        <Select v-model="CopyForm.gatewayList" filterable multiple allow-create @on-create="handleGatewayList">
                            <Option v-for="item in gatewayList" :value="item" :key="index">{{
                item
              }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="子网掩码" prop="subnetMask" v-if="CopyForm.customizationSpecName">
                        <Input v-model="CopyForm.subnetMask" placeholder="请输入子网掩码"></Input>
                    </FormItem>
                    <FormItem label="域名" prop="domain" v-if="CopyForm.customizationSpecName">
                        <Input v-model="CopyForm.domain" placeholder="请输入域名"></Input>
                    </FormItem>
                    <FormItem label="模板" prop="templateName">
                        <Select v-model="CopyForm.templateName">
                            <Option v-for="item in templateName" :value="item.vmName" :key="item.vmName">{{ item.vmName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="CPU核数" prop="numCPU">
                        <Input v-model="CopyForm.numCPU" placeholder="请输入CPU核数"></Input>
                    </FormItem>
                    <FormItem label="内存大小(GB)" prop="memoryGB">
                        <Input v-model="CopyForm.memoryGB" placeholder="请输入内存大小"></Input>
                    </FormItem>
                    <FormItem label="磁盘大小(GB)" prop="diskSizeGB">
                        <Input v-model="CopyForm.diskSizeGB" placeholder="请输入磁盘大小"></Input>
                    </FormItem>
                    <FormItem label="虚拟机名称" prop="vmName">
                        <Input v-model="CopyForm.vmName" placeholder="请输入虚拟机名称"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button @click="CopyModal = false">取消</Button>
                <Button type="primary" @click="CopyModify('CopyForm')" :loading="CopyLoading">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import Aside from "@/components/aside/virtual-aside.vue";
import PopTip from "@/components/common/pop-tip";
import { mapState, mapMutations } from "vuex";
import {
    cloneVMwareInfo,
    selVMwareInfo,
    refurbishVCenterVoInfo,
} from "@/api/VMware";
import { resetToNullValue } from '../../libs/vue-expand';
export default {
    name: "VMware",
    components: { Aside, PopTip },
    data() {
        const validateIP = (rule, value, callback) => {
            const reg = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
            if (value === "") {
                callback();
            } else {
                if (!reg.test(value)) {
                    callback(new Error("请输入正确的IP地址"));
                } else {
                    callback();
                }
            }
        };
        const validatesubnetMask = (rule, value, callback) => {
            const reg = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
            if (value) {
                if (!reg.test(value)) {
                    callback(new Error("请输入正确的子网掩码"));
                } else {
                    callback();
                }
            } else {
                callback(new Error("子网掩码不能为空"));
            }
        };
        const validateCommon = (rule, value, callback) => {
            const reg = /^\+?[0-9]\d*$/;
            if (value === "") {
                callback(new Error("不能为空"));
            } else {
                if (!reg.test(value)) {
                    callback(new Error("请输入正确的数值"));
                } else {
                    callback();
                }
            }
        };
        return {
            CopyModal: false,
            CopyForm: {
                customizationSpecName: "",
                dataStoreName: "",
                diskSizeGB: 0,
                dnsServerList: [],
                domain: "localhost",
                gatewayList: [],
                hostName: "",
                id: "",
                ipAddress: "",
                memoryGB: 0,
                numCPU: 0,
                resourcePoolName: "",
                serverName: "",
                subnetMask: "255.255.255.0",
                templateName: "",
                vmName: "",
            },
            customizationSpecNameList: [],
            dnsServerList: [],
            gatewayList: [],
            templateName: [],
            CopyLoading: false,
            ruleValidate: {
                resourcePoolName: [
                    { required: true, message: "请选择一个资源池名称" },
                ],
                dataStoreName: [
                    { required: true, message: "请选择一个数据存储名称" },
                ],
                customizationSpecName: [
                    { required: true, message: "请选择一个规则" },
                ],
                ipAddress: [{ required: true, validator: validateIP }],
                subnetMask: [{ required: true, validator: validatesubnetMask }],
                domain: [{ required: true, message: "域名不能为空" }],
                templateName: [{ required: true, message: "请选择一个模板" }],
                vmName: [{ required: true, message: "虚拟机名称不能为空" }],
                numCPU: [{ validator: validateCommon }],
                memoryGB: [{ validator: validateCommon }],
                diskSizeGB: [{ validator: validateCommon }],
            },
        };
    },
    computed: {
        ...mapState({
            activeAside: (state) => state.VMware.activeAside,
            AllValue: (state) => state.VMware.AllValue,
            shareLoading: (state) => state.VMware.shareLoading,
            taskbarList: (state) => state.taskbar.taskbarList,
        }),
    },
    watch: {
        $route: function (val, oldVal) {
            if (val.name === "VMware") {
                this.$router.push(`${oldVal.path}`);
            }
        },
    },
    methods: {
        ...mapMutations([
            "VMwareSetActiveAside",
            "VMwareSetAsideList",
            "VMwareSetAllValue",
        ]),
        openCopyModal() {
            this.CopyModal = true;
            for (let k in this.AllValue) {
                this.AllValue[k][0].hostSystemList.map((item) => {
                    if (this.activeAside.hostName === item.hostName) {
                        this.customizationSpecNameList = this.AllValue[
                            k
                        ][0].customizationSpecNameList;
                        this.CopyForm.id = this.AllValue[k][0].id;
                    }
                });
            }
            this.templateName = this.activeAside.virtualMachineVoList.filter(
                (key) => {
                    if (key.vmType !== "vm") {
                        return key;
                    }
                }
            );
            this.CopyForm.customizationSpecName = "";
            this.CopyForm.dataStoreName = "";
            this.CopyForm.diskSizeGB = 0;
            this.CopyForm.dnsServerList = [];
            this.CopyForm.domain = "localhost";
            this.CopyForm.gatewayList = [];
            this.CopyForm.subnetMask = "255.255.255.0";
            this.CopyForm.templateName = "";
            this.CopyForm.ipAddress = "";
            this.CopyForm.memoryGB = 0;
            this.CopyForm.numCPU = 0;
            this.CopyForm.resourcePoolName = "";
            this.CopyForm.vmName = "";
            this.dnsServerList = [];
            this.gatewayList = [];
        },
        //手动添加DNS服务列表
        handleDnsServerList(val) {
            this.dnsServerList.push(val);
        },
        //手动添加网关列表
        handleGatewayList(val) {
            this.gatewayList.push(val);
        },
        //规则选择值
        select(item) {
            this.CopyForm.dnsServerList = [];
            this.CopyForm.gatewayList = [];
            JSON.parse(JSON.stringify(this.customizationSpecNameList)).map(
                (key) => {
                    if (item.label === key.name) {
                        this.dnsServerList = key.dnsServerList || [];
                        this.gatewayList = key.gateway || [];
                        this.CopyForm.subnetMask =
                            key.subnetMask || "255.255.255.0";
                        this.CopyForm.domain = key.domain || "localhost";
                        if (key.dnsServerList) {
                            key.dnsServerList.map((i) => {
                                this.CopyForm.dnsServerList.push(i);
                            });
                        }
                        if (key.gateway) {
                            key.gateway.map((i) => {
                                this.CopyForm.gatewayList.push(i);
                            });
                        }
                    }
                }
            );
        },
        //克隆虚拟机
        CopyModify(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.CopyForm.hostName = this.activeAside.hostName;
                    this.CopyLoading = true;
                    cloneVMwareInfo(this.CopyForm).then((res) => {
                        this.CopyLoading = false;
                        if (res.data.code === "success") {
                            this.$Message.success(`${res.data.result}`);
                            this.GetVMwareInfo();
                            this.CopyModal = false;
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
            let res = await selVMwareInfo();
            let tempList = [];
            if (res.data.code === "success") {
                if (res.data.result) {
                    this.VMwareSetAllValue(res.data.result);
                    for (let key in res.data.result) {
                        if(res.data.result[key][0].hostSystemList !== null){
                            res.data.result[key][0].hostSystemList.map((item, index) => {
                                    tempList.push(item);
                                    if (this.activeAside.hostName === item.hostName) {
                                        this.VMwareSetActiveAside(res.data.result[key][0].hostSystemList[index]);
                                    }
                                }
                            );
                        }
                    }
                    this.VMwareSetAsideList(tempList);
                }
            } else {
                this.$Message.error(`${res.data.result}`);
            }
        },
        //  刷新所有虚拟机信息
        clickRefurbishVCenterVoInfo() {
            this.$Modal.confirm({
                title: "提示",
                content: "<p>是否同步信息？</p>",
                loading: true,
                onOk: () => {
                    if(this.taskbarList.length > 0){
                        this.$Modal.remove();
                        this.$Message.error({
                            content:`新建实例正在进行中，无法同步信息，请稍后再试...`,
                            duration:5
                        });
                    }else{
                        refurbishVCenterVoInfo().then((res) => {
                            let tempList = [];
                            if (res.data.code === "success") {
                                if (res.data.result) {
                                    this.VMwareSetAllValue(res.data.result);
                                    for (let key in res.data.result) {
                                        res.data.result[key][0].hostSystemList.map(
                                            (item, index) => {
                                                tempList.push(item);
                                                if (
                                                    this.activeAside.hostName ===
                                                    item.hostName
                                                ) {
                                                    this.VMwareSetActiveAside(
                                                        res.data.result[key][0]
                                                            .hostSystemList[index]
                                                    );
                                                }
                                            }
                                        );
                                    }
                                    this.VMwareSetAsideList(tempList);
                                    this.$Message.success(`同步成功`);
                                }
                            } else {
                                this.$Message.error(`${res.data.result}`);
                            }
                            this.$Modal.remove();
                        });
                    }
                },
            });
        },
    },
};
</script>

<style lang="less" scoped>
@import "./VMware";

.content_main {
    height: calc(100%);
    padding: 98px 10px 0 10px;
}
</style>
