<template>
  <div class="aside-wrap">
    <div class="search">
      <Input
        suffix="ios-search"
        placeholder="实例名"
        v-model.trim="searchString"
        clearable
      />
    </div>

    <div style="display: flex; justify-content: center">
      <div class="add-list" @click="addModel">
        <!--      <span>添加</span>-->
        <Tooltip
          content="添加L7设备"
          placement="top"
          max-width="200"
          theme="light"
        >
          <Icon type="md-add" color="#fff" :size="25" />
        </Tooltip>
        <!--<Icon type="md-add" color="#fff" :size="25"/>-->
      </div>
    </div>
    <div class="aside-list">
      <div
        class="aside-list-wrap"
        v-if="!isEmptyObject(asideList) && !searchString"
      >
        <Menu :theme="theme2" :open-names="Object.keys(asideList)">
          <Submenu
            :name="index"
            v-for="(item, index) in asideList"
            :key="index"
          >
            <template slot="title">
              <Icon type="ios-paper" />
              {{ index }}
            </template>
            <MenuItem
              name="1-1"
              class="aside-item"
              :class="{
                active: value.l7ServerId === $route.params.L7,
                disable: !value.run_status,
              }"
              v-for="(value, key) in item"
              :key="value.l7ServerId"
            >
              <div @click="changeAside(value)">
                <div class="title">
                  <span
                    :class="value.usable_status ? 'online' : 'error'"
                  ></span>
                  {{ value.l7ServerName }}
                </div>
                <div style="display: flex;margin-left: -4px;">
                  <div>
                    <span>
                      <Icon
                        type="md-lock"
                        size="20"
                        color="#fb1010"
                        style="cursor: pointer;"
                        @click="LockAndUnlock(value)"
                        v-if="value.lock_status"
                      />
                      <Icon
                        type="md-unlock"
                        size="20"
                        color="#21a37a"
                        style="cursor: pointer;"
                        @click="LockAndUnlock(value)"
                        v-if="!value.lock_status"
                      />
                    </span>
                  </div>
                  <div style="overflow: hidden;">
                    <div
                      style="padding-left: 12px;"
                      class="info"
                      v-if="value.nginxVersion"
                    >
                      {{ value.nginxVersion }}
                    </div>
                    <div
                      :class="value.ha_status ? 'ha-on' : 'ha-off'"
                      v-if="value.ha_version !== 'null'"
                    >
                      {{ value.ha_version }}
                    </div>
                  </div>
                </div>
                <Icon
                  type="md-more"
                  size="20"
                  color="#000"
                  title="编辑"
                  class="menu"
                  @click.stop="editModel(value)"
                />
              </div>
            </MenuItem>
          </Submenu>
        </Menu>
      </div>

      <div class="aside-list-wrap" style="padding: 0 10px;" v-if="searchString">
        <div
          class="aside-item"
          :class="{
            active: item.l7ServerId === $route.params.L7,
            disable: !item.run_status,
          }"
          @click="changeAside(item)"
          v-for="(item, index) in filterAside"
          :key="item.l7ServerId"
        >
          <div class="title">
            <span :class="item.usable_status ? 'online' : 'error'"></span>
            {{ item.l7ServerName }}
          </div>
          <div style="display: flex:margin-left: -4px;">
            <div>
              <span>
                <Icon
                  type="md-lock"
                  size="20"
                  color="#fb1010"
                  style="cursor: pointer;"
                  @click="LockAndUnlock(item)"
                  v-if="item.lock_status"
                />
                <Icon
                  type="md-unlock"
                  size="20"
                  color="#21a37a"
                  style="cursor: pointer;"
                  @click="LockAndUnlock(item)"
                  v-if="!item.lock_status"
                />
              </span>
            </div>
            <div style="overflow: hidden;">
              <div
                style="padding-left: 12px;"
                class="info"
                v-if="item.nginxVersion"
              >
                {{ item.nginxVersion }}
              </div>
              <div
                :class="item.ha_status ? 'ha-on' : 'ha-off'"
                v-if="item.ha_version !== 'null'"
              >
                {{ item.ha_version }}
              </div>
            </div>
          </div>

          <Icon
            type="md-more"
            size="20"
            color="#000"
            title="编辑"
            class="menu"
            @click.stop="editModel(item)"
          />
        </div>
        <div v-if="!filterAside.length" style="text-align: center">
          暂无数据
        </div>
      </div>
      <div
        class="aside-list-wrap"
        style="text-align: center"
        v-if="isEmptyObject(asideList) && !searchString"
      >
        暂无数据
      </div>
      <div class="load-wrap" v-if="listLoading">
        <Loading />
      </div>
    </div>

    <Modal v-model="l7_model_add" width="40" :mask-closable="false">
      <p slot="header" style="color:#333;text-align:center">
        <span v-if="edit">{{ "修改服务器配置" }}</span>
        <span v-else>{{
          titleNameTabPane === 1 ? "添加NGINX服务器" : "克隆虚拟机"
        }}</span>
      </p>
      <Tabs v-model="titleNameTabPane" :animated="false" @on-click="changeTabs">
        <TabPane label="添加NGINX服务器" :name="1">
          <div style="text-align:center">
            <Form ref="formValidate" :model="add_l7_form" :rules="ruleValidate">
              <FormItem label="实例别名" prop="l7ServerName">
                <Input v-model="add_l7_form.l7ServerName"></Input>
              </FormItem>
              <FormItem label="ssh连接实例的IP" prop="l7ServerSSHIp">
                <Input v-model="add_l7_form.l7ServerSSHIp"></Input>
              </FormItem>
              <FormItem label="ssh连接实例的用户" prop="l7ServerSSHName">
                <Input
                  v-model="add_l7_form.l7ServerSSHName"
                  autocomplete
                ></Input>
              </FormItem>
              <FormItem label="ssh连接实例的密码" prop="l7ServerSSHPwd">
                <Input
                  type="password"
                  v-model="add_l7_form.l7ServerSSHPwd"
                  autocomplete
                ></Input>
              </FormItem>
              <FormItem label="ssh连接实例的端口" prop="l7ServerSSHPort">
                <Input v-model="add_l7_form.l7ServerSSHPort"></Input>
              </FormItem>
              <FormItem label="导入原配置" v-if="addMoment">
                <i-switch
                  v-model="add_l7_form.impConfFlag"
                  style="margin-right: 300px"
                >
                  <span slot="open">On</span>
                  <span slot="close">Off</span>
                </i-switch>
              </FormItem>
              <FormItem label="备注">
                <Input v-model="add_l7_form.remark"></Input>
              </FormItem>
            </Form>
          </div>
        </TabPane>
        <TabPane label="克隆虚拟机" :name="2" v-if="!edit">
          <div>
            <Form ref="CopyForm" :model="CopyForm" :rules="copyRuleValidate">
              <div>
                <div
                  style="display: flex;"
                  v-for="(item, index) in CopyForm.vmParams"
                >
                  <div
                    style="width: 400px;padding-right: 20px;margin-bottom: 20px;"
                    :class="vmParamsNotSingle ? 'vmParams-border' : ''"
                  >
                    <FormItem
                      label="虚拟机名称"
                      :prop="'vmParams.' + index + '.vmName'"
                      :rules="{ required: true, message: '虚拟机名称不能为空' }"
                    >
                      <Input
                        v-model="item.vmName"
                        placeholder="请输入虚拟机名称"
                      ></Input>
                    </FormItem>
                    <div style="margin-bottom: 8px;">
                      <span style="font-size: 14px;color: #515a6e;"
                        >IP地址</span
                      >
                      <popTip
                        content="输入未使用的IP地址若不输入默认使用DHCP自动分配"
                        style="margin-left: 5px;"
                      ></popTip>
                    </div>
                    <FormItem
                      label=""
                      :prop="'vmParams.' + index + '.ipAddress'"
                      :rules="{ validator: validateIP }"
                    >
                      <Input
                        v-model="item.ipAddress"
                        placeholder="请输入IP地址"
                      ></Input>
                    </FormItem>
                  </div>
                  <div style="line-height: 180px;margin-left: 40px;">
                    <Icon
                      type="ios-trash"
                      size="20"
                      style="cursor: pointer;"
                      @click="removeIpAndName(index)"
                      v-if="CopyForm.vmParams.length > 1"
                    />
                  </div>
                </div>
                <div>
                  <Button type="dashed" icon="md-add" @click="addIpAndName()"
                    >添加IP地址和虚拟机名称</Button
                  >
                </div>
              </div>
              <FormItem label="服务器" prop="id">
                <Select v-model="CopyForm.id" @on-select="serverSelect">
                  <Option
                    v-for="item in hostData"
                    :value="item.id"
                    :key="item.id"
                    >{{ item.serverName }}</Option
                  >
                </Select>
              </FormItem>
              <FormItem label="主机" prop="hostName">
                <Select v-model="CopyForm.hostName" @on-select="hostSelect">
                  <Option
                    v-for="item in hostName"
                    :value="item.hostName"
                    :key="item.hostName"
                    >{{ item.hostName }}</Option
                  >
                </Select>
              </FormItem>
              <FormItem label="资源池名称" prop="resourcePoolName">
                <Select v-model="CopyForm.resourcePoolName">
                  <Option
                    v-for="item in resourcePoolNameList"
                    :value="item.vm_name"
                    :key="item.vm_name"
                    >{{ item.vm_name }}</Option
                  >
                </Select>
              </FormItem>
              <FormItem label="数据存储名称" prop="dataStoreName">
                <Select v-model="CopyForm.dataStoreName">
                  <Option
                    v-for="item in datastoreNameList"
                    :value="item.name"
                    :key="item.name"
                    >{{ item.name }}</Option
                  >
                </Select>
              </FormItem>
              <div style="margin-bottom: 8px;">
                <span
                  style="color: #ed4014;font-family: SimSun;font-size: 14px;margin-right: 4px;"
                  >*</span
                ><span style="font-size: 14px;color: #515a6e;">规则</span>
                <popTip
                  content="自定义虚拟机规范配置"
                  style="margin-left: 5px;"
                ></popTip>
              </div>
              <FormItem label="" prop="customizationSpecName">
                <Select
                  v-model="CopyForm.customizationSpecName"
                  @on-select="customizationSelect"
                >
                  <Option
                    v-for="item in customizationSpecNameList"
                    :value="item.name"
                    :key="item.name"
                    >{{ item.name }}</Option
                  >
                </Select>
              </FormItem>
              <div
                style="margin-bottom: 8px;"
                v-if="CopyForm.customizationSpecName"
              >
                <span style="font-size: 14px;color: #515a6e;">DNS服务列表</span>
                <popTip
                  content="可选择或者手动输入"
                  style="margin-left: 5px;"
                ></popTip>
              </div>
              <FormItem
                label=""
                prop="dnsServerList"
                v-if="CopyForm.customizationSpecName"
              >
                <Select
                  v-model="CopyForm.dnsServerList"
                  filterable
                  multiple
                  allow-create
                  @on-create="handleDnsServerList"
                >
                  <Option
                    v-for="(item, index) in dnsServerList"
                    :value="item"
                    :key="index"
                    >{{ item }}</Option
                  >
                </Select>
              </FormItem>
              <div
                style="margin-bottom: 8px;"
                v-if="CopyForm.customizationSpecName"
              >
                <span style="font-size: 14px;color: #515a6e;">网关列表</span>
                <popTip
                  content="可选择或者手动输入"
                  style="margin-left: 5px;"
                ></popTip>
              </div>
              <FormItem
                label=""
                prop="gatewayList"
                v-if="CopyForm.customizationSpecName"
              >
                <Select
                  v-model="CopyForm.gatewayList"
                  filterable
                  multiple
                  allow-create
                  @on-create="handleGatewayList"
                >
                  <Option
                    v-for="item in gatewayList"
                    :value="item"
                    :key="index"
                    >{{ item }}</Option
                  >
                </Select>
              </FormItem>
              <FormItem
                label="子网掩码"
                prop="subnetMask"
                v-if="CopyForm.customizationSpecName"
              >
                <Input
                  v-model="CopyForm.subnetMask"
                  placeholder="请输入子网掩码"
                ></Input>
              </FormItem>
              <FormItem
                label="域名"
                prop="domain"
                v-if="CopyForm.customizationSpecName"
              >
                <Input
                  v-model="CopyForm.domain"
                  placeholder="请输入域名"
                ></Input>
              </FormItem>

              <FormItem label="模板" prop="templateName">
                <Select v-model="CopyForm.templateName">
                  <Option
                    v-for="item in templateName"
                    :value="item.vmName"
                    :key="item.vmName"
                    >{{ item.vmName }}</Option
                  >
                </Select>
              </FormItem>
              <div
                style="margin-bottom: 8px;"
                v-if="CopyForm.customizationSpecName"
              >
                <span style="font-size: 14px;color: #515a6e;">CPU核数</span>
                <popTip
                  content="请输入正整数值,若为0时,则默认分配"
                  style="margin-left: 5px;"
                ></popTip>
              </div>
              <FormItem label="" prop="numCPU">
                <Input
                  v-model="CopyForm.numCPU"
                  placeholder="请输入CPU核数"
                ></Input>
              </FormItem>
              <div
                style="margin-bottom: 8px;"
                v-if="CopyForm.customizationSpecName"
              >
                <span style="font-size: 14px;color: #515a6e;"
                  >内存大小(GB)</span
                >
                <popTip
                  content="请输入正整数值,若为0时,则默认分配"
                  style="margin-left: 5px;"
                ></popTip>
              </div>
              <FormItem label="" prop="memoryGB">
                <Input
                  v-model="CopyForm.memoryGB"
                  placeholder="请输入内存大小"
                ></Input>
              </FormItem>
              <div
                style="margin-bottom: 8px;"
                v-if="CopyForm.customizationSpecName"
              >
                <span style="font-size: 14px;color: #515a6e;"
                  >磁盘大小(GB)</span
                >
                <popTip
                  content="请输入正整数值,若为0时,则默认分配"
                  style="margin-left: 5px;"
                ></popTip>
              </div>
              <FormItem label="" prop="diskSizeGB">
                <Input
                  v-model="CopyForm.diskSizeGB"
                  placeholder="请输入磁盘大小"
                ></Input>
              </FormItem>
            </Form>
          </div>
        </TabPane>
      </Tabs>
      <div slot="footer">
        <Button
          class="fl"
          v-if="!addMoment"
          ghost
          type="error"
          @click.stop="delL7ServerInfo(add_l7_form.l7ServerId)"
          >删除</Button
        >
        <Button @click="l7_model_add = false">取消</Button>
        <Button
          type="primary"
          :loading="modal_loading"
          @click="addL7('formValidate')"
          v-if="addMoment && titleNameTabPane === 1"
          >确认添加</Button
        >
        <Button
          type="primary"
          :loading="modal_loading"
          @click="CopyModify('CopyForm')"
          v-if="addMoment && titleNameTabPane === 2"
          >确认克隆</Button
        >
        <Button
          type="primary"
          :loading="modal_loading"
          @click="updL7ServerInfo('formValidate')"
          v-if="!addMoment"
          >确认</Button
        >
      </div>
    </Modal>
    <Modal v-model="initModal" :mask-closable="false" width="416">
      <span slot="close"></span>
      <div style="padding: 12px 0 0 12px;">
        <Icon type="ios-help-circle" style="color: #ff9900; font-size: 28px" />
        <span style="font-size: 16px;margin-left: 12px">提示</span>
        <div style="margin-left: 40px;margin-top: 12px">
          是否初始化实例配置？
        </div>
      </div>
      <div slot="footer">
        <Button
          @click="cancleInit()"
          :loading="disinitloading"
          style="border: 0;"
          >否</Button
        >
        <Button type="primary" @click="confirmInit()" :loading="initloading"
          >是</Button
        >
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from "vuex";
import PopTip from "@/components/common/pop-tip";
import {
  addL7ServerInfo,
  delL7ServerInfo,
  updL7ServerInfo,
  locking,
  unLock,
  selL7ServerInfoAll,
} from "../../api/L7";
import { cloneVMwareInfo, selVMwareInfo } from "@/api/VMware";

export default {
  name: "MyAside",
  components: { PopTip },
  data() {
    const validatel7ServerName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("别名不能为空"));
      } else {
        callback();
      }
    };
    const validatel7ServerSSHIp = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("IP不能为空"));
      } else if (
        !/^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/.test(
          value
        )
      ) {
        callback("IP格式不正确");
      } else {
        callback();
      }
    };
    const validatel7ServerSSHName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户不能为空"));
      } else {
        callback();
      }
    };
    const validatel7ServerSSHPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    const validatel7ServerSSHPort = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("端口不能为空"));
      } else if (
        !/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(
          value
        )
      ) {
        callback("端口号格式不正确");
      } else {
        callback();
      }
    };
    this.validateIP = (rule, value, callback) => {
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
      addMoment: true,
      l7_model_add: false,
      l7_form: {},
      add_l7_form: {
        l7ServerId: "",
        l7ServerName: "",
        l7ServerSSHIp: "",
        l7ServerSSHName: "",
        l7ServerSSHPwd: "",
        l7ServerSSHPort: 22,
        impConfFlag: false,
        remark: "",
      },
      ruleValidate: {
        l7ServerId: [
          { required: true, message: "序列号不能为空", trigger: "blur" },
        ],
        l7ServerName: [
          { required: true, validator: validatel7ServerName, trigger: "blur" },
        ],
        l7ServerSSHIp: [
          { required: true, validator: validatel7ServerSSHIp, trigger: "blur" },
        ],
        l7ServerSSHName: [
          {
            required: true,
            validator: validatel7ServerSSHName,
            trigger: "blur",
          },
        ],
        l7ServerSSHPwd: [
          {
            required: true,
            validator: validatel7ServerSSHPwd,
            trigger: "blur",
          },
        ],
        l7ServerSSHPort: [
          {
            required: true,
            validator: validatel7ServerSSHPort,
            trigger: "blur",
          },
        ],
      },
      modal_loading: false,
      edit: false,
      searchString: "",
      timer: null,
      openMenu: [],
      initModal: false,
      code: "",
      initloading: false,
      disinitloading: false,
      rollBackValue: {},
      CopyForm: {
        customizationSpecName: "",
        dataStoreName: "",
        diskSizeGB: 0,
        dnsServerList: [],
        domain: "localhost",
        gatewayList: [],
        hostName: "",
        id: "",
        memoryGB: 0,
        numCPU: 0,
        resourcePoolName: "",
        serverName: "",
        subnetMask: "255.255.255.0",
        templateName: "",
        vmParams: [
          {
            ipAddress: "",
            vmName: "",
          },
        ],
      },
      customizationSpecNameList: [],
      dnsServerList: [],
      gatewayList: [],
      templateName: [],
      CopyLoading: false,
      copyRuleValidate: {
        resourcePoolName: [{ required: true, message: "请选择一个资源池名称" }],
        dataStoreName: [{ required: true, message: "请选择一个数据存储名称" }],
        customizationSpecName: [{ required: true, message: "请选择一个规则" }],
        // ipAddress: [{ required: true, validator: validateIP }],
        subnetMask: [{ required: true, validator: validatesubnetMask }],
        domain: [{ required: true, message: "域名不能为空" }],
        templateName: [{ required: true, message: "请选择一个模板" }],
        // vmName: [{ required: true, message: "虚拟机名称不能为空" }],
        numCPU: [{ validator: validateCommon }],
        memoryGB: [{ validator: validateCommon }],
        diskSizeGB: [{ validator: validateCommon }],
      },
      hostData: [],
      hostName: [],
      resourcePoolNameList: [],
      datastoreNameList: [],
      vmParamsNotSingle: false,
      copyData: [],
      titleNameTabPane: 1,
    };
  },
  watch: {
    asideList(newVal, oldVal) {
      //console.log(...arguments);
    },
    l7_model_add(newVal, oldVal) {
      if (this.l7_model_add === false) {
        this.addMoment = true;
      }
    },
    $route(nv, ov) {
      if (nv.path === "/L7") {
        this.$router.replace(ov);
      }
    },
  },
  computed: {
    ...mapState({
      asideList: (state) => state.L7.asideList,
      l7ServerId: (state) => state.L7.activeAside.l7ServerId,
      listLoading: (state) => state.L7.listLoading,
    }),
    // 匹配搜索
    filterAside: function() {
      let asideList = [];
      Object.keys(this.asideList).map((item) => {
        asideList.push(...this.asideList[item]);
      });

      let searchString = this.searchString;

      if (!searchString) {
        return [];
      }
      asideList = asideList.filter(function(item) {
        if (item.l7ServerName.indexOf(searchString) !== -1) {
          return item;
        }
      });

      // 返回过来后的数组
      return asideList;
    },
  },
  methods: {
    ...mapActions(["getL7AsideList"]),
    ...mapMutations(["L7setActiveAside", "L7setAsideList"]),
    changeAside(item) {
      //   console.log(this.l7ServerId);
      if (item.l7ServerId === this.l7ServerId) return;
      this.L7setActiveAside(item);
      this.$router.replace(`/L7/${item.l7ServerId}/chart`);
    },
    //展示Model框，数据重置
    addModel() {
      this.edit = false;
      this.titleNameTabPane = 1;
      this.vmParamsNotSingle = false;
      this.l7_model_add = true;

      /** add_l7_form表单重置数据  start*/
      this.add_l7_form.l7ServerName = "";
      this.add_l7_form.l7ServerSSHIp = "";
      this.add_l7_form.l7ServerSSHName = "";
      this.add_l7_form.l7ServerSSHPwd = "";
      this.add_l7_form.l7ServerSSHPort = 22;
      this.add_l7_form.impConfFlag = false;
      this.add_l7_form.remark = "";
      /** add_l7_form表单重置数据  end*/

      /** CopyForm表单重置数据  start */
      this.CopyForm.vmParams = [
        {
          ipAddress: "",
          vmName: "",
        },
      ];
      this.CopyForm.id = this.copyData.id;
      if (this.copyData.hostSystemList !== null) {
        if (this.copyData.hostSystemList.length > 0) {
          this.CopyForm.hostName = this.copyData.hostSystemList[0].hostName; //默认选中第一个主机
          if (this.copyData.hostSystemList[0].datastoreNameList.length > 0) {
            this.datastoreNameList = this.copyData.hostSystemList[0].datastoreNameList;
            this.CopyForm.dataStoreName = this.copyData.hostSystemList[0].datastoreNameList[0].name; //默认选中第一个数据存储名称
          } else {
            this.datastoreNameList = [];
            this.CopyForm.dataStoreName = "";
          }
          if (this.copyData.hostSystemList[0].resourcePoolNameList.length > 0) {
            this.resourcePoolNameList = this.copyData.hostSystemList[0].resourcePoolNameList;
            this.CopyForm.resourcePoolName = this.copyData.hostSystemList[0].resourcePoolNameList[0].vm_name; //默认选中第一个资源池名称
          } else {
            this.resourcePoolNameList = [];
            this.CopyForm.resourcePoolName = "";
          }
          if (this.copyData.hostSystemList[0].virtualMachineTemplateList) {
            if (
              this.copyData.hostSystemList[0].virtualMachineTemplateList
                .length > 0
            ) {
              this.templateName = this.copyData.hostSystemList[0].virtualMachineTemplateList;
              this.CopyForm.templateName = this.copyData.hostSystemList[0].virtualMachineTemplateList[0].vmName; //默认选中第一个模板
            } else {
              this.templateName = [];
              this.CopyForm.templateName = "";
            }
          } else {
            this.templateName = [];
            this.CopyForm.templateName = "";
          }
        } else {
          this.CopyForm.hostName = "";
        }
      } else {
        this.CopyForm.hostName = "";
        this.copyData.hostSystemList = [];
      }
      if (this.copyData.customizationSpecNameList !== null) {
        if (this.copyData.customizationSpecNameList.length > 0) {
          this.CopyForm.customizationSpecName = this.copyData.customizationSpecNameList[0].name; //默认选中第一个规则
          if (
            this.copyData.customizationSpecNameList[0].dnsServerList !== null
          ) {
            this.CopyForm.dnsServerList =
              this.copyData.customizationSpecNameList[0].dnsServerList || []; //DNS服务列表有值时展示所有值
          } else {
            this.dnsServerList = [];
            this.CopyForm.dnsServerList = [];
          }
          if (this.copyData.customizationSpecNameList[0].gateway !== null) {
            this.CopyForm.gatewayList =
              this.copyData.customizationSpecNameList[0].gatewayList || []; //网关列表有值时展示所有值
          } else {
            this.gatewayList = [];
            this.CopyForm.gatewayList = [];
          }
          this.CopyForm.subnetMask =
            this.copyData.customizationSpecNameList[0].subnetMask ||
            "255.255.255.0";
          this.CopyForm.domain =
            this.copyData.customizationSpecNameList[0].domain || "localhost";
        } else {
          this.CopyForm.customizationSpecName = "";
        }
      } else {
        this.copyData.customizationSpecNameList = [];
        this.CopyForm.customizationSpecName = "";
      }
      /** CopyForm表单重置数据  end */
    },
    //添加实例配置信息
    addL7(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.modal_loading = true;
          addL7ServerInfo(this.add_l7_form)
            .then((res) => {
              // console.log(res);
              this.modal_loading = false;
              if (res.data.code === "success") {
                this.l7_model_add = false;
                this.getL7AsideList().then((res) => {
                  /* 第一次添加 */
                  if (this.asyncOk(res) && !this.$route.params.L7) {
                    let item =
                      res.data.result[Object.keys(res.data.result)[0][0]];
                    this.L7setActiveAside(item);
                    this.$router.replace(`/L7/${this.l7ServerId}/chart`);
                  }
                });
              } else {
                this.$Message.error(`${res.data.result}`);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    //删除实例配置信息
    async delL7ServerInfo(code) {
      this.code = code;
      this.$Modal.confirm({
        title: "提示",
        content: "<p>确定要删除这条吗？删除后该设备信息将会丢失！</p>",
        loading: true,
        onOk: async () => {
          this.$Modal.remove();
          this.initModal = true;
        },
      });
    },
    //取消初始化实例配置
    async cancleInit() {
      this.disinitloading = true;
      let temp = false;
      let res = await delL7ServerInfo({
        l7ServerId: this.code,
        is_init_conf: temp,
      });
      this.disinitloading = false;
      this.initModal = false;
      this.l7_model_add = false;
      if (this.asyncOk(res)) {
        this.$Message.success("删除成功！");
        this.getL7AsideList(true).then((res) => {
          if (this.asyncOk(res) && !res.data.result.length) {
            this.$router.push(`/L7`);
          }
          if (this.code === this.$route.params.L7) {
            this.$router.replace(`/L7/${this.l7ServerId}/chart`);
          }
        });
      } else {
        this.$Message.error({ content: res.data.result, duration: 5 });
      }
    },
    //确定初始化实例配置
    async confirmInit() {
      this.initloading = true;
      let temp = true;
      let res = await delL7ServerInfo({
        l7ServerId: this.code,
        is_init_conf: temp,
      });
      this.initloading = false;
      this.initModal = false;
      this.l7_model_add = false;
      if (this.asyncOk(res)) {
        this.$Message.success("删除成功！");
        this.getL7AsideList(true).then((res) => {
          if (this.asyncOk(res) && !res.data.result.length) {
            this.$router.push(`/L7`);
          }
          if (this.code === this.$route.params.L7) {
            this.$router.replace(`/L7/${this.l7ServerId}/chart`);
          }
        });
      } else {
        this.$Message.error({ content: res.data.result, duration: 5 });
      }
    },
    //修改实例配置信息
    async updL7ServerInfo(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.modal_loading = true;
          this.l7_form.l7ServerId = this.add_l7_form.l7ServerId;
          this.l7_form.l7ServerName = this.add_l7_form.l7ServerName;
          this.l7_form.l7ServerSSHIp = this.add_l7_form.l7ServerSSHIp;
          this.l7_form.l7ServerSSHName = this.add_l7_form.l7ServerSSHName;
          this.l7_form.l7ServerSSHPwd = this.add_l7_form.l7ServerSSHPwd;
          this.l7_form.l7ServerSSHPort = this.add_l7_form.l7ServerSSHPort;
          this.l7_form.remark = this.add_l7_form.remark;
          updL7ServerInfo(this.add_l7_form)
            .then((res) => {
              //console.log(res);
              this.modal_loading = false;
              if (res.data.code === "success") {
                this.l7_model_add = false;
                this.$Message.success("修改成功");
                this.getL7AsideList();
                this.L7setActiveAside(this.l7_form);
                if (this.l7_form.l7ServerId === this.$route.params.L7) return;
                this.$router.replace(`/L7/${this.l7_form.l7ServerId}/chart`);
              } else {
                this.$Message.error(`${res.data.result}`);
                this.getL7AsideList();
                this.L7setActiveAside(this.rollBackValue);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    //展示Model框，展示当前实例的数据
    editModel(item) {
      //   console.log(item);
      this.edit = true;
      this.titleNameTabPane = 1;
      this.l7_form = item;
      this.add_l7_form.l7ServerId = item.l7ServerId;
      this.add_l7_form.l7ServerName = item.l7ServerName;
      this.add_l7_form.l7ServerSSHIp = item.l7ServerSSHIp;
      this.add_l7_form.l7ServerSSHName = item.l7ServerSSHName;
      this.add_l7_form.l7ServerSSHPwd = item.l7ServerSSHPwd;
      this.add_l7_form.l7ServerSSHPort = item.l7ServerSSHPort;
      this.add_l7_form.remark = item.remark;
      this.addMoment = false;
      this.l7_model_add = true;
      this.rollBackValue = JSON.parse(JSON.stringify(item));
    },
    //加锁和解锁
    LockAndUnlock(item) {
      if (item.lock_status) {
        let temp = JSON.parse(JSON.stringify(item));
        temp.lock_status = false;
        this.$Modal.confirm({
          title: "提示",
          content: "<p>确定要解锁？</p>",
          loading: true,
          onOk: async () => {
            let res = await unLock({
              lock_id: item.lock_id,
            });
            if (res.data.code === "success") {
              this.$Modal.remove();
              this.$Message.success("解锁成功!");
              this.getL7AsideList();
              this.L7setActiveAside(temp);
            } else {
              this.$Modal.remove();
              this.$Message.error(`${res.data.result}`);
            }
          },
        });
      } else {
        let temp = JSON.parse(JSON.stringify(item));
        temp.lock_status = true;
        this.$Modal.confirm({
          title: "提示",
          content: "<p>确定要锁定？</p>",
          loading: true,
          onOk: async () => {
            let res = await locking({
              primaryKey: item.l7ServerId,
              type: "L7",
            });
            if (res.data.code === "success") {
              this.$Modal.remove();
              this.$Message.success("锁定成功!");
              this.getL7AsideList();
              this.L7setActiveAside(item);
            } else {
              this.$Modal.remove();
              this.$Message.error(`${res.data.result}`);
            }
          },
        });
      }
    },
    //查询虚拟机信息
    async GetVMwareInfo() {
      let res = await selVMwareInfo();
      if (res.data.code === "success") {
        if (res.data.result) {
          this.copyData = JSON.parse(
            JSON.stringify(res.data.result[Object.keys(res.data.result)[0]][0])
          ); //深度拷贝第一个数据
          for (let key in res.data.result) {
            this.hostData.push(res.data.result[key][0]);
          }
          this.hostName =
            res.data.result[Object.keys(res.data.result)[0]][0]
              .hostSystemList || [];
          this.customizationSpecNameList =
            res.data.result[Object.keys(res.data.result)[0]][0]
              .customizationSpecNameList || [];
          this.datastoreNameList =
            res.data.result[Object.keys(res.data.result)[0]][0]
              .hostSystemList[0].datastoreNameList || [];
          this.resourcePoolNameList =
            res.data.result[Object.keys(res.data.result)[0]][0]
              .hostSystemList[0].resourcePoolNameList || [];
          this.dnsServerList =
            res.data.result[Object.keys(res.data.result)[0]][0]
              .customizationSpecNameList[0].dnsServerList || [];
          this.gatewayList =
            res.data.result[Object.keys(res.data.result)[0]][0]
              .customizationSpecNameList[0].gatewayList || [];
          this.templateName =
            res.data.result[Object.keys(res.data.result)[0]][0]
              .hostSystemList[0].virtualMachineTemplateList || [];
        }
      } else {
        this.$Message.error(`${res.data.result}`);
      }
    },
    //克隆虚拟机
    CopyModify(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          //   this.CopyForm.hostName = this.activeAside.hostName;
          this.modal_loading = true;
          cloneVMwareInfo(this.CopyForm)
            .then((res) => {
              this.modal_loading = false;
              if (res.data.code === "success") {
                this.$Message.success(`${res.data.result}`);
                this.l7_model_add = false;
                this.getL7AsideList().then((res) => {
                  /* 第一次添加 */
                  if (this.asyncOk(res) && !this.$route.params.L7) {
                    let item =
                      res.data.result[Object.keys(res.data.result)[0][0]];
                    this.L7setActiveAside(item);
                    this.$router.replace(`/L7/${this.l7ServerId}/chart`);
                  }
                });
              } else {
                this.$Message.error(`${res.data.result}`);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$Message.error("请检查输入是否正确!");
        }
      });
    },
    //新增IP地址和虚拟机名称
    addIpAndName() {
      this.CopyForm.vmParams.push({
        ipAddress: "",
        vmName: "",
      });
      this.vmParamsNotSingle = true;
    },
    //删除IP地址和虚拟机名称
    removeIpAndName(index) {
      this.CopyForm.vmParams.splice(index, 1);
      if (this.CopyForm.vmParams.length === 1) {
        this.vmParamsNotSingle = false;
      }
    },
    //手动添加DNS服务列表
    handleDnsServerList(val) {
      this.dnsServerList.push(val);
    },
    //手动添加网关列表
    handleGatewayList(val) {
      this.gatewayList.push(val);
    },
    //选择服务器
    serverSelect(val) {
      this.hostData.map((item) => {
        if (item.id === val.value) {
          if (item.hostSystemList.length > 0) {
            this.hostName = item.hostSystemList;
            this.CopyForm.hostName = this.hostName[0].hostName; //默认选中第一个主机
            if (this.hostName[0].resourcePoolNameList.length > 0) {
              this.resourcePoolNameList = this.hostName[0].resourcePoolNameList;
              this.CopyForm.resourcePoolName = this.resourcePoolNameList[0].vm_name; //默认选中第一个资源池名称
            } else {
              this.resourcePoolNameList = [];
              this.CopyForm.resourcePoolName = "";
            }
            if (this.hostName[0].datastoreNameList.length > 0) {
              this.datastoreNameList = this.hostName[0].datastoreNameList;
              this.CopyForm.dataStoreName = this.datastoreNameList[0].name; //默认选中第一个数据存储名称
            } else {
              this.datastoreNameList = [];
              this.CopyForm.dataStoreName = "";
            }
            if (this.hostName[0].virtualMachineTemplateList.length > 0) {
              this.templateName = this.hostName[0].virtualMachineTemplateList;
              this.CopyForm.templateName = this.templateName[0].vmName; //默认选中第一个模板
            } else {
              this.templateName = [];
              this.CopyForm.templateName = "";
            }
          } else {
            this.hostName = [];
            this.CopyForm.hostName = "";
          }
          if (item.customizationSpecNameList.length > 0) {
            this.customizationSpecNameList = item.customizationSpecNameList;
            this.CopyForm.customizationSpecName = this.customizationSpecNameList[0].name; //默认选中第一个规则
            if (this.customizationSpecNameList[0].dnsServerList.length > 0) {
              this.dnsServerList = this.customizationSpecNameList[0].dnsServerList;
              this.CopyForm.dnsServerList = this.dnsServerList; //DNS服务列表有值时展示所有值
            } else {
              this.dnsServerList = [];
              this.CopyForm.dnsServerList = [];
            }
            if (this.customizationSpecNameList[0].gateway.length > 0) {
              this.gatewayList = this.customizationSpecNameList[0].gateway;
              this.CopyForm.gatewayList = this.gatewayList; //网关列表有值时展示所有值
            } else {
              this.gatewayList = [];
              this.CopyForm.gatewayList = [];
            }
          } else {
            this.customizationSpecNameList = [];
            this.CopyForm.customizationSpecName = "";
          }
        }
      });
    },
    //选择主机
    hostSelect(val) {
      this.hostName.map((item) => {
        if (item.hostName === val.value) {
          if (item.datastoreNameList.length > 0) {
            this.datastoreNameList = item.datastoreNameList;
            this.CopyForm.dataStoreName = this.datastoreNameList[0].name; //默认选中第一个数据存储名称
          } else {
            this.datastoreNameList = [];
            this.CopyForm.dataStoreName = "";
          }
          if (item.resourcePoolNameList.length > 0) {
            this.resourcePoolNameList = item.resourcePoolNameList;
            this.CopyForm.resourcePoolName = this.resourcePoolNameList[0].vm_name; //默认选中第一个资源池名称
          } else {
            this.resourcePoolNameList = [];
            this.CopyForm.resourcePoolName = "";
          }
          if (item.virtualMachineTemplateList.length > 0) {
            this.templateName = item.virtualMachineTemplateList;
            this.CopyForm.templateName = this.templateName[0].vmName; //默认选中第一个模板
          } else {
            this.templateName = [];
            this.CopyForm.templateName = "";
          }
        }
      });
    },
    //选择规则
    customizationSelect(val) {
      this.customizationSpecNameList.map((item) => {
        if (item.name === val.value) {
          if (item.dnsServerList !== null) {
            if (item.dnsServerList.length > 0) {
              this.dnsServerList = item.dnsServerList;
              this.CopyForm.dnsServerList = item.dnsServerList; //DNS服务列表有值时展示所有值
            } else {
              this.dnsServerList = [];
              this.CopyForm.dnsServerList = [];
            }
          } else {
            this.dnsServerList = [];
            this.CopyForm.dnsServerList = [];
          }
          if (item.gateway !== null) {
            if (item.gateway.length > 0) {
              this.gatewayList = item.gateway;
              this.CopyForm.gatewayList = item.gateway; //网关列表有值时展示所有值
            } else {
              this.gatewayList = [];
              this.CopyForm.gatewayList = [];
            }
          } else {
            this.gatewayList = [];
            this.CopyForm.gatewayList = [];
          }
          this.CopyForm.subnetMask = item.subnetMask || "255.255.255.0";
          this.CopyForm.domain = item.domain || "localhost";
        }
      });
    },
    //切换标签页
    changeTabs(name) {
      this.titleNameTabPane = name;
    },
  },
  created() {
    this.getL7AsideList(true).then((res) => {
      if (this.asyncOk(res)) {
        if (!this.$route.params.L7) {
          if (this.l7ServerId) {
            this.$router.replace(`/L7/${this.l7ServerId}/chart`);
          }
        } else {
          let keys = Object.keys(this.asideList);
          let arr = [];
          keys.map((item) => {
            arr.push(...this.asideList[item]);
          });
          //   console.log(arr);
          arr.map((item) => {
            if (item.l7ServerId === this.$route.params.L7) {
              this.L7setActiveAside(item);
            }
          });
        }
      }
    });
    this.GetVMwareInfo();
  },
  mounted() {
    this.timer = setInterval(() => {
      this.getL7AsideList();
    }, 1000 * 60);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="less" scoped>
@import "aside";
.search {
  padding: 0 10px;
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
/deep/.ivu-modal-footer {
  border: #fff;
}
.ha-off {
  color: #cecccc;
  display: block;
  margin-left: 12px;
}
.ha-on {
  color: #666;
  display: block;
  margin-left: 12px;
}
/deep/.ivu-modal {
  top: 0;
}
.vmParams-border {
  border-right: 1px #01c864 solid;
}
</style>
