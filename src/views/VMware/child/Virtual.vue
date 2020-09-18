<template>
    <div>
        <Table :loading="shareLoading" :max-height="height" :width="width" :columns="VitrualColumns" :data="activeAside.virtualMachineVoList">
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
                <span>
                    <Icon type="ios-create-outline" size="20" style="cursor: pointer;" @click="openModal(row)" />
                </span>
            </template>
        </Table>
        <Modal v-model="VirtualModal" width="40" :mask-closable="false">
            <p slot="header" style="color:#fff;text-align:center">
                <span>修改CPU和内存</span>
            </p>
            <div style="padding:1rem;">
                <Form ref="VirtualForm" :model="VirtualForm" :rules="ruleValidate" label-position="left" :label-width="80">
                    <FormItem label="内存大小(GB)" prop="memorySize">
                        <Input v-model="VirtualForm.memorySize"></Input>
                    </FormItem>
                    <FormItem label="CPU核数" prop="numCPU">
                        <Input v-model="VirtualForm.numCPU"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button @click="VirtualModal = false">取消</Button>
                <Button type="primary" @click="virtualModify('VirtualForm')" :loading="VirtualLoading">确定修改</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { updateVMwareInfo, selVMwareInfo } from "@/api/VMware";
export default {
    name: "Virtual",
    data() {
        const validateMemorySize = (rule, value, callback) => {
            const reg = /^\+?[0-9]\d*$/;
            if (value) {
                if (!reg.test(value)) {
                    callback(new Error("请输入正确的数值"));
                } else {
                    callback();
                }
            } else {
                callback(new Error("内存大小不能为空"));
            }
        };
        const validateNumCPU = (rule, value, callback) => {
            const reg = /^\+?[0-9]\d*$/;
            if (value) {
                if (!reg.test(value)) {
                    callback(new Error("请输入正确的数值"));
                } else {
                    callback();
                }
            } else {
                callback(new Error("CPU核数不能为空"));
            }
        };
        return {
            VitrualColumns: [
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
                    width: "80",
                },
            ],
            width: window.screen.width * 0.8,
            height: window.screen.height * 0.6,
            VirtualModal: false,
            VirtualForm: {
                memorySize: "",
                numCPU: "",
            },
            VirtualLoading: false,
            vmName: "",
            VMwareID: null,
            ruleValidate: {
                memorySize: [{ validator: validateMemorySize }],
                numCPU: [{ validator: validateNumCPU }],
            },
        };
    },
    computed: {
        ...mapState({
            activeAside: (state) => state.VMware.activeAside,
            shareLoading: (state) => state.VMware.shareLoading,
            AllValue: (state) => state.VMware.AllValue,
        }),
    },
    methods: {
        ...mapMutations([
            "VMwareSetActiveAside",
            "VMwareSetAsideList",
            "VMwareSetAllValue",
        ]),
        openModal(row) {
            this.VirtualModal = true;
            this.VirtualForm.memorySize = parseInt(row.memoryMB / 1024);
            this.VirtualForm.numCPU = row.numCPU;
            this.vmName = row.vmName;
        },
        //修改虚拟机信息
        virtualModify(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.VirtualLoading = true;
                    for (let k in this.AllValue) {
                        this.AllValue[k][0].hostSystemList.map((item) => {
                            if (this.activeAside.hostName === item.hostName) {
                                this.VMwareID = this.AllValue[k][0].id;
                            }
                        });
                    }
                    let json = {
                        id: this.VMwareID,
                        memorySize: this.VirtualForm.memorySize,
                        numCpu: this.VirtualForm.numCPU,
                        hostName: this.activeAside.hostName,
                        vmname: this.vmName,
                    };
                    updateVMwareInfo(json).then((res) => {
                        this.VirtualLoading = false;
                        if (res.data.code === "success") {
                            this.GetVMwareInfo();
                            this.$Message.success(`${res.data.result}`);
                            this.VirtualModal = false;
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
