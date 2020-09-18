<template>
    <div>
        <Table :max-height="height" :width="width" :columns="TemplateColumns" :data="activeAside.virtualMachineTemplateList">
            <template slot-scope="{ row }" slot="powerState">
                <strong>{{
          row.powerState === "poweredOn" ? "已打开电源" : "已关闭电源"
        }}</strong>
            </template>
            <template slot-scope="{ row }" slot="memoryMB">
                <strong>{{
          row.memoryMB >= 1024
            ? (row.memoryMB / 1024).toFixed(2) + "GB"
            : row.memoryMB + "MB"
        }}</strong>
            </template>
            <template slot-scope="{ row }" slot="memoryUsage">
                <strong>{{
          row.memoryUsage >= 1024
            ? (row.memoryUsage / 1024).toFixed(2) + "GB"
            : row.memoryUsage + "MB"
        }}</strong>
            </template>
            <template slot-scope="{ row }" slot="committed">
                <strong>{{
          row.committed >= 1024
            ? (row.committed / 1024 / 1024 / 1024).toFixed(2) + "GB"
            : row.committed + "MB"
        }}</strong>
            </template>
            <template slot-scope="{ row }" slot="uncommitted">
                <strong>{{
          row.uncommitted >= 1024
            ? (row.uncommitted / 1024 / 1024 / 1024).toFixed(2) + "GB"
            : row.uncommitted + "MB"
        }}</strong>
            </template>
            <!-- <template slot-scope="{ row }" slot="vmType">
        <strong>{{ row.vmType === "vm" ? "无" : row.vmType }}</strong>
      </template> -->
            <template slot-scope="{ row, index }" slot="action">
                <!-- <Button type="primary" size="small" @click="openModal(row, false)"
          >添加</Button> -->
                <Button style="margin-left: 10px" type="info" size="small" @click="openModal(row)">编辑</Button>
            </template>
        </Table>
        <Modal v-model="TemplateModal" width="40" :mask-closable="false">
            <p slot="header" style="color:#fff;text-align:center">
                <span>{{ edit ? "修改模板登录信息" : "添加模板登录信息" }}</span>
            </p>
            <div>
                <Form ref="TemplateForm" :model="TemplateForm" :rules="ruleValidate" label-position="left" :label-width="80">
                    <FormItem label="账号" prop="userName">
                        <Input v-model="TemplateForm.userName" placeholder="请输入账号"></Input>
                    </FormItem>
                    <FormItem label="密码" prop="passWord">
                        <Input type="password" v-model="TemplateForm.passWord" placeholder="请输入密码"></Input>
                    </FormItem>
                    <FormItem label="确认密码" prop="passwdCheck">
                        <Input type="password" v-model="TemplateForm.passwdCheck" placeholder="请确认密码"></Input>
                    </FormItem>
                    <FormItem label="端口" prop="port">
                        <Input v-model="TemplateForm.port" placeholder="请输入端口号"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button @click="TemplateModal = false">取消</Button>
                <Button type="primary" @click="TemplateModify('TemplateForm')" :loading="TemplateLoading">{{ edit ? "确定修改" : "确定添加" }}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import {
    uptVMwareTemplateLoginInfo,
    selVMwareInfo,
    insVMwareTemplateLoginInfo,
    selVMwareTemplateLoginInfo,
} from "@/api/VMware";
export default {
    name: "Template",
    data() {
        const validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                if (this.TemplateForm.passwdCheck !== "") {
                    // 对第二个密码框单独验证
                    this.$refs.TemplateForm.validateField("passwdCheck");
                }
                callback();
            }
        };
        const validatePassCheck = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.TemplateForm.passWord) {
                callback(new Error("两次输入的密码不相同!"));
            } else {
                callback();
            }
        };
        const validatePort = (rule, value, callback) => {
            let port = /^[1-9]$|(^[1-9][0-9]$)|(^[1-9][0-9][0-9]$)|(^[1-9][0-9][0-9][0-9]$)|(^[1-6][0-5][0-5][0-3][0-5]$)/;
            if (value === "") {
                callback(new Error("请输入端口号"));
            } else {
                if (!port.test(value)) {
                    callback(new Error("请输入正确的端口号"));
                } else {
                    callback();
                }
            }
        };
        return {
            width: window.screen.width * 0.8,
            height: window.screen.height * 0.6,
            TemplateColumns: [
                {
                    title: "名称",
                    key: "vmName",
                },
                {
                    title: "状况",
                    slot: "powerState",
                },
                {
                    title: "内存大小",
                    slot: "memoryMB",
                },
                {
                    title: "内存使用",
                    slot: "memoryUsage",
                },
                {
                    title: "CPU核数",
                    key: "numCPU",
                },
                {
                    title: "磁盘使用大小",
                    slot: "committed",
                },
                {
                    title: "磁盘剩余大小",
                    slot: "uncommitted",
                },
                {
                    title: "IP",
                    key: "ipAddress",
                },
                // {
                //   title: "模板",
                //   slot: "vmType",
                // },
                {
                    title: "操作",
                    slot: "action",
                    width: "150",
                    align: "center",
                },
            ],
            TemplateModal: false,
            TemplateForm: {
                templateName: "",
                userName: "",
                passWord: "",
                passwdCheck: "",
                port: "",
            },
            ruleValidate: {
                userName: [{ required: true, message: "请输入账号" }],
                passWord: [{ required: true, validator: validatePass }],
                passwdCheck: [{ required: true, validator: validatePassCheck }],
                port: [{ required: true, validator: validatePort }],
            },
            TemplateLoading: false,
            templateName: "",
            edit: false,
        };
    },
    computed: {
        ...mapState({
            activeAside: (state) => state.VMware.activeAside,
        }),
    },
    methods: {
        ...mapMutations([
            "VMwareSetActiveAside",
            "VMwareSetAsideList",
            "VMwareSetAllValue",
        ]),
        openModal(row) {
            this.TemplateModal = true;
            this.templateName = row.vmName;
            this.GetVMwareTemplateLoginInfo(row.vmName);
            //   if (isEdit) {
            //     this.GetVMwareTemplateLoginInfo(row.vmName);
            //   } else {
            //     this.TemplateForm.userName = "";
            //     this.TemplateForm.passWord = "";
            //     this.TemplateForm.port = "";
            //     this.TemplateForm.passwdCheck = "";
            //   }
        },
        //获取模板登录信息
        async GetVMwareTemplateLoginInfo(templateName) {
            let res = await selVMwareTemplateLoginInfo({ templateName });
            if (res.data.code === "success") {
                let data = res.data.result;
                this.TemplateForm.userName = data.userName;
                this.TemplateForm.passWord = data.passWord;
                this.TemplateForm.port = data.port;
                this.TemplateForm.passwdCheck = data.passWord;
            } else {
                this.$Message.error(`${res.data.result}`);
                this.TemplateForm.userName = "";
                this.TemplateForm.passWord = "";
                this.TemplateForm.port = "";
                this.TemplateForm.passwdCheck = "";
            }
        },
        //添加或修改模板登录信息
        TemplateModify(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.TemplateLoading = true;
                    let json = {
                        templateName: this.templateName,
                        userName: this.TemplateForm.userName,
                        passWord: this.TemplateForm.passWord,
                        port: this.TemplateForm.port,
                    };
                    if (this.edit) {
                        uptVMwareTemplateLoginInfo(json).then((res) => {
                            this.TemplateLoading = false;
                            this.TemplateModal = false;
                            if (res.data.code === "success") {
                                //   this.GetVMwareInfo();
                                this.$Message.success(`${res.data.result}`);
                            } else {
                                this.$Message.error(`${res.data.result}`);
                            }
                        });
                    } else {
                        insVMwareTemplateLoginInfo(json).then((res) => {
                            this.TemplateLoading = false;
                            this.TemplateModal = false;
                            if (res.data.code === "success") {
                                //   this.GetVMwareInfo();
                                this.$Message.success(`${res.data.result}`);
                            } else {
                                this.$Message.error(`${res.data.result}`);
                            }
                        });
                    }
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
                        res.data.result[key][0].hostSystemList.map(
                            (item, index) => {
                                tempList.push(item);
                                if (
                                    this.activeAside.hostName === item.hostName
                                ) {
                                    this.VMwareSetActiveAside(
                                        res.data.result[key][0].hostSystemList[
                                            index
                                        ]
                                    );
                                }
                            }
                        );
                    }
                    this.VMwareSetAsideList(tempList);
                }
            } else {
                this.$Message.error(`${res.data.result}`);
            }
        },
    },
};
</script>

<style lang="less" scoped>
/deep/ .ivu-table {
    background-color: #f8f8f8;
}
/deep/ .ivu-table:before {
    display: none;
}
/deep/.ivu-input {
    border: none;
    border-radius: 0;
    /*cursor: pointer;*/
    border-bottom: 1px #515a6e solid;
}
/deep/ .ivu-input-wrapper {
    overflow: hidden;
    border-radius: 0;
    /*cursor: pointer;*/
    border-bottom-color: #515a6e;
}
/deep/.ivu-input:focus {
    border-color: #f8f8f9;
    border-radius: 0;
    border-bottom-color: #515a6e;
}
</style>
