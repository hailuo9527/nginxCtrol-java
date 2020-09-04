<template>
  <div class="aside-wrap">
    <Input
      suffix="ios-search"
      v-model.trim="searchString"
      placeholder="搜索APP"
      clearable
    />
    <div style="display: flex; justify-content: center">
      <div class="add-list" @click="addModel">
        <!--      <span>添加</span>-->
        <Tooltip
          content="添加APP"
          placement="top"
          max-width="200"
          theme="light"
        >
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
            {{ item.app_service_name }}
          </div>
          <div style="margin-left: -4px;">
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
          <div class="info">{{ item.description }}</div>
          <Icon
            type="md-more"
            size="20"
            color="#000"
            title="编辑"
            class="menu"
            @click="editModel(item, index)"
          />
        </div>
      </div>
      <div
        class="aside-list-wrap"
        style="text-align: center"
        v-if="!filterAside.length"
      >
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
    <div>
      <Button type="dashed" icon="md-add" long @click="ImportModal()"
        >导入</Button
      >
    </div>

    <Modal v-model="appModal" width="40" :mask-closable="false">
      <p slot="header" style="color:#333;text-align:center">
        <span>{{ edit ? "修改APP配置" : "新建APP" }}</span>
      </p>
      <div>
        <Form ref="appForm" :model="appForm" :rules="ruleValidate">
          <FormItem label="APP命名" prop="app_service_name">
            <Input v-model="appForm.app_service_name"></Input>
          </FormItem>
          <FormItem label="是否开启热备份">
            <i-switch v-model="appForm.configure_ha" @on-change="switchChange">
              <span slot="open">On</span>
              <span slot="close">Off</span>
            </i-switch>
          </FormItem>
          <div class="label" v-if="appForm.configure_ha">
            虚拟ip<popTip
              content="对外开放的IP地址"
              style="margin-left: 5px;"
            ></popTip>
          </div>
          <Row
            v-if="appForm.configure_ha"
            v-for="(item, index) in appForm.vips"
            :key="index"
          >
            <Col span="19">
              <FormItem
                label=""
                :prop="'vips.' + index"
                :rules="{ validator: ip }"
              >
                <Input
                  v-model.trim="appForm.vips[index]"
                  placeholder="IP"
                ></Input>
              </FormItem>
            </Col>
            <Col span="4" style="text-align: right">
              <Icon
                type="ios-trash"
                class="remove-icon"
                @click="handleRemoveVip(index)"
                size="20"
              />
            </Col>
          </Row>
          <FormItem v-if="appForm.configure_ha">
            <Button type="dashed" @click="handleAddVip" icon="md-add"
              >添加</Button
            >
          </FormItem>
          <FormItem label="选择实例" prop="l7_server_ids" v-if="L7List">
            <popTip
              content="实例为部署NGINX代理的服务器，开启热备份时至少选择两台实例"
            ></popTip>
            <div
              style="float: right;"
              class="custom-ha"
              v-if="appForm.configure_ha"
            >
              <FormItem label="自定义HA优先级">
                <i-switch v-model="appForm.custom_priority">
                  <span slot="open">On</span>
                  <span slot="close">Off</span>
                </i-switch>
              </FormItem>
            </div>
            <Select v-model="appForm.l7_server_ids" multiple>
              <Option
                v-for="item in L7List"
                :value="item.l7ServerId"
                :key="item.l7ServerId"
                >{{ item.l7ServerName }}</Option
              >
            </Select>
            <div v-if="!L7List.length" class="">
              暂无实例，
              <router-link to="/L7">点击创建</router-link>
            </div>
          </FormItem>
          <div class="listen-and-servegroups">
            <div
              :class="ServerandLocationarrowStatus ? 'arrow-down' : 'arrow-up'"
              class="listen-and-servegroups-top"
            >
              <Button
                @click="addAppServerBlock()"
                type="dashed"
                icon="md-add"
                v-if="appForm.appServerBlockList.length === 0"
                >server</Button
              >
              <Tabs
                type="card"
                closable
                @on-tab-remove="removeAppServerBlock"
                :animated="false"
                v-model="serverTabPane"
                v-if="appForm.appServerBlockList.length > 0"
              >
                <TabPane
                  :label="'server' + (indexServe + 1)"
                  v-for="(itemServe, indexServe) in appForm.appServerBlockList"
                  :key="indexServe"
                  :name="indexServe + 1"
                  v-if="serverRefresh"
                >
                  <div class="listen-and-servegroups-top-content">
                    <div class="top-content-leftcontent">
                      <FormItem
                        label="serve name"
                        :prop="
                          'appServerBlockList.' + indexServe + '.server_name'
                        "
                        :rules="{ validator: domain }"
                      >
                        <popTip
                          content="此虚拟服务器提供服务的域名。这与NGINX配置中的server_name指令相对应。"
                        ></popTip>
                        <Input
                          v-model="itemServe.server_name"
                          placeholder="name"
                        ></Input>
                      </FormItem>
                      <FormItem
                        label="监听端口"
                        :prop="'appServerBlockList.' + indexServe + '.listen'"
                        :rules="{ validator: port }"
                      >
                        <popTip content="对外开放的端口"></popTip>
                        <Input
                          v-model="itemServe.listen"
                          placeholder="PORT"
                        ></Input>
                      </FormItem>
                      <div>
                        <span class="top-content-leftcontent-title"
                          >location</span
                        >
                        <div
                          class="top-content-leftcontent-location"
                          v-for="(itemLocation,
                          indexLocation) in itemServe.appLocationBlockList"
                        >
                          <div>
                            <div class="label">
                              URI-PATH/ROUTE
                              <PopTip
                                content="Location定义是NGINX中请求路由机制的核心。Location指定NGINX是代理一个特定的请求还是直接服务它。"
                                style="margin-left: 5px;"
                                placement="bottom"
                              >
                              </PopTip>
                            </div>
                            <Row>
                              <Col span="8">
                                <FormItem
                                  label=""
                                  class="inline-form-item options"
                                  prop="url_path_route_key"
                                >
                                  <Select
                                    v-model="itemLocation.url_path_route_key"
                                  >
                                    <Option value="prefix">prefix</Option>
                                    <Option value="exact">exact</Option>
                                    <Option value="regex">regex</Option>
                                    <Option value="regex(case-insensitive)"
                                      >regex(case-insensitive)</Option
                                    >
                                  </Select>
                                </FormItem>
                              </Col>
                              <Col span="6" style="padding: 4px">
                                <span style="margin-left: 8px">match with</span>
                              </Col>
                              <Col span="10">
                                <FormItem
                                  label=""
                                  class="inline-form-item options"
                                  :prop="
                                    'appServerBlockList.' +
                                      indexServe +
                                      '.appLocationBlockList.' +
                                      indexLocation +
                                      '.url_path_route_value'
                                  "
                                  :rules="{ validator: urlPathRouteValue }"
                                >
                                  <Input
                                    v-model="itemLocation.url_path_route_value"
                                    placeholder="/"
                                  ></Input>
                                </FormItem>
                              </Col>
                            </Row>
                            <FormItem
                              label="proxy"
                              :prop="
                                'appServerBlockList.' +
                                  indexServe +
                                  '.appLocationBlockList.' +
                                  indexLocation +
                                  '.proxy_url'
                              "
                              :rules="{ validator: proxyUrl }"
                            >
                              <popTip
                                content="向upstream servers发送代理请求。"
                              ></popTip>
                              <Input
                                v-model="itemLocation.proxy_url"
                                placeholder="URL"
                              ></Input>
                            </FormItem>
                          </div>
                          <div class="location-right">
                            <Icon
                              type="ios-trash"
                              size="22"
                              class="location-right-icon"
                              title="删除location"
                              @click="
                                removeAppLocationBlock(
                                  indexLocation,
                                  indexServe
                                )
                              "
                            />
                          </div>
                        </div>
                      </div>

                      <FormItem>
                        <Button
                          @click="addAppLocationBlock(indexServe)"
                          type="dashed"
                          icon="md-add"
                          style="margin-top: 6px;"
                          >添加location</Button
                        >
                      </FormItem>
                    </div>
                  </div>
                </TabPane>
                <Button
                  @click="addAppServerBlock()"
                  type="dashed"
                  icon="md-add"
                  slot="extra"
                  >server</Button
                >
              </Tabs>
            </div>
            <div
              :class="
                appForm.appServerBlockList.length > 0
                  ? 'listen-and-servegroups-bottom-r'
                  : 'listen-and-servegroups-bottom-l'
              "
            >
              <Button
                type="dashed"
                icon="ios-arrow-down"
                class="bottom-content-button-common-style"
                v-if="
                  appForm.appServerBlockList.length > 0 &&
                    ServerandLocationarrowStatus
                "
                @click="ServerandLocationarrowDown()"
                >展开</Button
              >
              <Button
                type="dashed"
                icon="ios-arrow-up"
                class="bottom-content-button-common-style"
                @click="ServerandLocationarrowUp()"
                v-if="
                  appForm.appServerBlockList.length > 0 &&
                    !ServerandLocationarrowStatus
                "
                >收起</Button
              >
            </div>
          </div>
          <div class="listen-and-servegroups">
            <div
              :class="UpgrouparrowStatus ? 'arrow-down' : 'arrow-up'"
              class="listen-and-servegroups-top"
            >
              <Button
                @click="addAppUpgroupBlock()"
                type="dashed"
                icon="md-add"
                v-if="appForm.appUpgroupBlockList.length === 0"
                >应用服务群组</Button
              >
              <Tabs
                type="card"
                closable
                @on-tab-remove="removeAppUpgroupBlock"
                :animated="false"
                v-model="upstreamTabPane"
                v-if="appForm.appUpgroupBlockList.length > 0"
              >
                <TabPane
                  :label="'应用服务群组' + (indexUpgroup + 1)"
                  v-for="(itemUpgroup,
                  indexUpgroup) in appForm.appUpgroupBlockList"
                  :key="indexUpgroup"
                  :name="indexUpgroup + 1"
                  v-if="upstreamRefresh"
                >
                  <div class="listen-and-servegroups-top-content">
                    <div class="top-content-leftcontent">
                      <FormItem
                        label="应用服务名称"
                        :prop="
                          'appUpgroupBlockList.' +
                            indexUpgroup +
                            '.upstream_name'
                        "
                        :rules="{ validator: validateName }"
                      >
                        <popTip
                          content="定义要与代理过程一起使用的一组服务器的名称。"
                        ></popTip>
                        <Input
                          v-model.trim="itemUpgroup.upstream_name"
                          placeholder="name"
                        ></Input>
                      </FormItem>
                      <div class="label">
                        应用服务成员
                        <PopTip
                          content="添加默认应用服务成员后可以使用发布功能"
                          style="margin-left: 5px;"
                          placement="bottom"
                        >
                        </PopTip>
                      </div>
                      <div class="scroll-warp">
                        <Row
                          v-for="(itemUpServer,
                          indexUpServer) in itemUpgroup.appUpServerBlockList"
                        >
                          <Col span="10">
                            <FormItem
                              label=""
                              :prop="
                                'appUpgroupBlockList.' +
                                  indexUpgroup +
                                  '.appUpServerBlockList.' +
                                  indexUpServer +
                                  '.upstream_server'
                              "
                              :rules="{ validator: ipPort }"
                            >
                              <Input
                                type="text"
                                v-model="itemUpServer.upstream_server"
                                placeholder="IP | IP:PORT | PORT"
                              ></Input>
                            </FormItem>
                          </Col>
                          <Col span="8" :offset="1">
                            <FormItem
                              :prop="
                                'appUpgroupBlockList.' +
                                  indexUpgroup +
                                  '.appUpServerBlockList.' +
                                  indexUpServer +
                                  '.weight'
                              "
                              :rules="{ validator: validaterule }"
                            >
                              <Input
                                type="text"
                                v-model="itemUpServer.weight"
                                placeholder="权重"
                              ></Input>
                            </FormItem>
                          </Col>
                          <Col span="4" style="text-align: right">
                            <Icon
                              type="ios-trash"
                              class="remove-icon"
                              size="22"
                              title="删除应用服务成员"
                              @click="
                                removeAppUpServer(indexUpServer, indexUpgroup)
                              "
                            />
                          </Col>
                        </Row>
                      </div>
                      <FormItem>
                        <Button
                          @click="addAppUpServer(indexUpgroup)"
                          type="dashed"
                          icon="md-add"
                          >应用服务成员</Button
                        >
                      </FormItem>
                    </div>
                  </div>
                </TabPane>
                <Button
                  @click="addAppUpgroupBlock()"
                  type="dashed"
                  icon="md-add"
                  slot="extra"
                  >应用服务群组</Button
                >
              </Tabs>
            </div>
            <div
              :class="
                appForm.appUpgroupBlockList.length > 0
                  ? 'listen-and-servegroups-bottom-r'
                  : 'listen-and-servegroups-bottom-l'
              "
              :style=""
            >
              <Button
                type="dashed"
                icon="ios-arrow-down"
                class="bottom-content-button-common-style"
                v-if="
                  appForm.appUpgroupBlockList.length > 0 && UpgrouparrowStatus
                "
                @click="UpgrouparrowDown()"
                >展开</Button
              >
              <Button
                type="dashed"
                icon="ios-arrow-up"
                class="bottom-content-button-common-style"
                @click="UpgrouparrowUp()"
                v-if="
                  appForm.appUpgroupBlockList.length > 0 && !UpgrouparrowStatus
                "
                >收起</Button
              >
            </div>
          </div>
          <FormItem label="选择配置" prop="nginx_conf_id">
            <popTip content="选择一个配置并发布到当前APP"></popTip>
            <Select v-model="appForm.nginx_conf_id" clearable>
              <Option v-for="item in configList" :value="item.nginx_conf_id">{{
                item.config_name
              }}</Option>
            </Select>
            <!-- <div v-if="!configList.length" class="">
              暂无配置，
              <router-link to="/newNginxConfig">点击创建</router-link>
            </div> -->
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
          class="fl"
          v-if="edit"
          ghost
          type="error"
          @click.stop="delApp(appForm.app_service_id)"
          >删除</Button
        >
        <Button @click="appModal = false">取消</Button>
        <Button
          type="primary"
          :loading="modal_loading"
          v-if="!edit"
          @click="addApp('appForm')"
          >确认</Button
        >
        <Button
          type="primary"
          :loading="modal_loading"
          v-else
          @click="modifyApp('appForm')"
          >确认修改</Button
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
    <Modal v-model="importModal" width="40" :mask-closable="false">
      <p slot="header" style="color:#333;text-align:center">
        <span>导入</span>
      </p>
      <div>
        <Form ref="formValidate" :model="importForm" :rules="ruleValidate">
          <FormItem label="APP命名" prop="app_service_name">
            <Input v-model="importForm.app_service_name"></Input>
          </FormItem>
          <FormItem label="选择实例">
            <popTip
              content="实例为部署NGINX代理的服务器，开启热备份时至少选择两台实例"
            ></popTip>
            <Select v-model="importForm.l7IDS" multiple>
              <Option
                v-for="item in L7IDLists"
                :value="item.l7ServerId"
                :key="item.l7ServerId"
                >{{ item.l7ServerName }}</Option
              >
            </Select>
          </FormItem>
          <div style="text-align: left;">
            <Button
              @click="addImport()"
              type="dashed"
              icon="md-add"
              v-if="importForm.l7ServerInfoList.length === 0"
              >新增实例</Button
            >
          </div>
          <Tabs
            type="card"
            closable
            @on-tab-remove="removeAppImport"
            :animated="false"
            v-model="importTabPane"
            v-if="importForm.l7ServerInfoList.length > 0"
          >
            <TabPane
              :label="
                item.l7ServerName === ''
                  ? '实例' + (index + 1)
                  : item.l7ServerName
              "
              v-for="(item, index) in importForm.l7ServerInfoList"
              :key="index"
              :name="index + 1"
              v-if="importRefresh"
            >
              <div style="padding: 0 16px">
                <FormItem
                  label="实例别名"
                  :prop="'l7ServerInfoList.' + index + '.l7ServerName'"
                  :rules="{
                    required: true,
                    validator: validatel7ServerName,
                  }"
                >
                  <Input v-model="item.l7ServerName"></Input>
                </FormItem>
                <FormItem
                  label="ssh连接实例的IP"
                  :prop="'l7ServerInfoList.' + index + '.l7ServerSSHIp'"
                  :rules="{
                    required: true,
                    validator: validatel7ServerSSHIp,
                    trigger: 'blur',
                  }"
                >
                  <Input v-model="item.l7ServerSSHIp"></Input>
                </FormItem>
                <FormItem
                  label="ssh连接实例的用户"
                  :prop="'l7ServerInfoList.' + index + '.l7ServerSSHName'"
                  :rules="{
                    required: true,
                    validator: validatel7ServerSSHName,
                    trigger: 'blur',
                  }"
                >
                  <Input v-model="item.l7ServerSSHName" autocomplete></Input>
                </FormItem>
                <FormItem
                  label="ssh连接实例的密码"
                  :prop="'l7ServerInfoList.' + index + '.l7ServerSSHPwd'"
                  :rules="{
                    required: true,
                    validator: validatel7ServerSSHPwd,
                    trigger: 'blur',
                  }"
                >
                  <Input
                    type="password"
                    v-model="item.l7ServerSSHPwd"
                    autocomplete
                  ></Input>
                </FormItem>
                <FormItem
                  label="ssh连接实例的端口"
                  :prop="'l7ServerInfoList.' + index + '.l7ServerSSHPort'"
                  :rules="{
                    required: true,
                    validator: validatel7ServerSSHPort,
                    trigger: 'blur',
                  }"
                >
                  <Input v-model="item.l7ServerSSHPort"></Input>
                </FormItem>
              </div>
            </TabPane>
            <Button
              type="dashed"
              icon="md-add"
              slot="extra"
              @click="addImport()"
              >新增实例</Button
            >
          </Tabs>
          <FormItem label="简介" prop="description">
            <Input v-model="importForm.description"></Input>
          </FormItem>
          <FormItem label="标签" prop="tags">
            <Input v-model="importForm.tags"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="importModal = false">取消</Button>
        <Button
          type="primary"
          @click="appImport('formValidate')"
          :loading="importLoading"
          >导入</Button
        >
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from "vuex";
import {
  addAppInfo,
  delAppInfo,
  updAppInfo,
  selAppDetails,
} from "../../api/app";
import {
  selUsableL7Server,
  getNginxConfALL,
  ListL7ServerInfoByImpApp,
  locking,
  unLock,
  getNginxConfALLForPremission,
} from "../../api/L7";
import { selAppInfoList, impApp } from "../../api/app";
import PopTip from "@/components/common/pop-tip";

export default {
  name: "MyAside",
  components: {
    PopTip,
  },
  data() {
    this.ipPort = (rule, value, callback) => {
      if (value) {
        let ip = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
        let port = /^[1-9]$|(^[1-9][0-9]$)|(^[1-9][0-9][0-9]$)|(^[1-9][0-9][0-9][0-9]$)|(^[1-6][0-5][0-5][0-3][0-5]$)/;
        let ipAndPort = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
        if (ip.test(value) || port.test(value) || ipAndPort.test(value)) {
          callback();
        } else {
          callback(new Error("格式错误"));
        }
      } else {
        callback(new Error("不能为空"));
      }
    };
    this.ip = (rule, value, callback) => {
      if (value) {
        let ip = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
        if (ip.test(value)) {
          callback();
        } else {
          callback(new Error("格式错误"));
        }
      } else {
        callback(new Error("不能为空"));
      }
    };
    const selection = (rule, value, callback) => {
      if (value.length === 0) {
        return callback(new Error("至少选择一个实例"));
      } else {
        if (this.appForm.configure_ha && value.length < 2) {
          return callback(new Error("已开启热备份，至少选择两个实例"));
        }
        callback();
      }
    };
    this.validaterule = (rule, value, callback) => {
      let reg = /^\+?[1-9][0-9]*$/;
      if (value === "") {
        callback(new Error("权重不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入大于零的整数"));
      } else {
        callback();
      }
    };
    this.port = (rule, value, callback) => {
      let P = /^[1-9]$|(^[1-9][0-9]$)|(^[1-9][0-9][0-9]$)|(^[1-9][0-9][0-9][0-9]$)|(^[1-6][0-5][0-5][0-3][0-5]$)/;
      if (value) {
        if (P.test(value)) {
          callback();
        } else {
          callback(new Error("格式错误"));
        }
      } else {
        callback(new Error("不能为空"));
      }
    };
    this.domain = (rule, value, callback) => {
      callback();
    };
    this.urlPathRouteValue = (rule, value, callback) => {
      const reg = /^[^ ]+$/;
      if (!value) {
        callback(new Error("不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("不能含有空格"));
      } else {
        callback();
      }
    };
    this.proxyUrl = (rule, value, callback) => {
      let reg = /(http|https):\/\/([\w.]+\/?)\S*/;
      const regexp = /^[^ ]+$/;
      if (!value) {
        callback();
      } else if (!reg.test(value) || !regexp.test(value)) {
        callback(new Error("请输入正确的URL"));
      } else {
        callback();
      }
    };
    this.validateName = (rule, value, callback) => {
      const reg = /^(?!(\d+)$)[\u4e00-\u9fffa-zA-Z\d\-_]+$/;
      let temp = [];
      temp = this.appForm.appUpgroupBlockList.map(function(item) {
        return item.upstream_name;
      });
      const items = new Set(this.copyJson(temp));
      if (!value) {
        callback(new Error("不能为空"));
      } else {
        if (!reg.test(value)) {
          callback(new Error("不能全数字或者存在空格"));
        } else if (temp.length !== items.size) {
          callback(new Error("该值已存在"));
        } else {
          callback();
        }
      }
    };
    this.validatel7ServerName = (rule, value, callback) => {
      let temp = [];
      temp = this.importForm.l7ServerInfoList.map(function(item) {
        return item.l7ServerName;
      });
      const items = new Set(this.copyJson(temp));
      if (!value) {
        callback(new Error("别名不能为空"));
      } else {
        if (temp.length !== items.size) {
          callback(new Error("该值已存在"));
        } else {
          callback();
        }
      }
    };
    this.validatel7ServerSSHIp = (rule, value, callback) => {
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
    this.validatel7ServerSSHName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户不能为空"));
      } else {
        callback();
      }
    };
    this.validatel7ServerSSHPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    this.validatel7ServerSSHPort = (rule, value, callback) => {
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
    return {
      appModal: false,
      appForm: {
        vips: [],
        appServerBlockList: [
          {
            listen: 80,
            server_name: "",
            appLocationBlockList: [
              {
                url_path_route_key: "",
                url_path_route_value: "/",
                proxy_url: "",
              },
            ],
          },
        ],
        appUpgroupBlockList: [
          {
            upstream_name: "",
            appUpServerBlockList: [
              {
                upstream_server: "",
                weight: 1,
              },
            ],
          },
        ],
        l7_server_ids: [],
      },
      ruleValidate: {
        app_service_name: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        l7_server_ids: [{ validator: selection, trigger: "change" }],
      },
      L7List: [],
      modal_loading: false,
      edit: false,
      searchString: "",
      activeItem: {},
      timer: null,
      configList: null,
      initModal: false,
      id: "",
      initloading: false,
      disinitloading: false,
      ServerandLocationarrowStatus: true,
      UpgrouparrowStatus: true,
      serverRefresh: true,
      serverTabPane: 0,
      upstreamRefresh: true,
      upstreamTabPane: 0,
      importModal: false,
      importForm: {
        app_service_name: "",
        description: "",
        l7IDS: [],
        l7ServerInfoList: [
          {
            impConfFlag: false,
            l7ServerName: "",
            l7ServerSSHIp: "",
            l7ServerSSHName: "",
            l7ServerSSHPort: 22,
            l7ServerSSHPwd: "",
            remark: "",
          },
        ],
        tags: "",
      },
      importTabPane: 0,
      importRefresh: true,
      importLoading: false,
      L7IDLists: [],
    };
  },
  watch: {
    $route(nv, ov) {
      if (nv.path === "/app") {
        this.$router.replace(ov);
      }
    },
  },
  computed: {
    ...mapState({
      asideList: (state) => state.app.asideList,
      appServerId: (state) => state.app.activeAside.app_service_id,
      listLoading: (state) => state.app.listLoading,
      activeAside: (state) => state.app.activeAside,
    }),
    // 匹配搜索
    filterAside: function() {
      let arr = this.asideList;
      let searchString = this.searchString;

      if (!searchString) {
        return arr;
      }
      arr = arr.filter(function(item) {
        if (item.app_service_name.indexOf(searchString) !== -1) {
          return item;
        }
      });

      // 返回过来后的数组
      return arr;
    },
  },
  methods: {
    ...mapActions(["getAppAsideList"]),
    ...mapMutations(["appSetActiveAside", "appSetAsideList"]),
    changeAside(item) {
      if (item.app_service_id === this.appServerId) return;
      this.appSetActiveAside(item);

      this.$router.replace(`/app/${item.app_service_id}/overview`);
    },
    //展示Model框，数据重置
    addModel() {
      this.edit = false;
      (this.appForm = {
        vips: [],
        appServerBlockList: [],
        appUpgroupBlockList: [],
        l7_server_ids: [],
      }),
        this.selUsableL7Server(this.appForm).then(() => {
          if (this.L7List.length>0) {
            let arr = [];
            arr.push(this.L7List[0].l7ServerId);
            this.$set(this.appForm, "l7_server_ids", arr);
          }
        });
      this.ServerandLocationarrowStatus = false;
      this.UpgrouparrowStatus = false;
      this.appModal = true;
      //   this.getAllConfigInfo();
      this.getNginxConfALLForPremissions();
    },
    //展示Model框，展示当前实例的数据
    editModel(item, index) {
      this.edit = true;
      this.appForm = this.copyJson(item);
      if (this.appForm.appServerBlockList.length > 0) {
        this.ServerandLocationarrowStatus = true;
      } else {
        this.ServerandLocationarrowStatus = false;
      }
      if (this.appForm.appUpgroupBlockList.length > 0) {
        this.UpgrouparrowStatus = true;
      } else {
        this.UpgrouparrowStatus = false;
      }
      this.serverTabPane = 1;
      this.upstreamTabPane = 1;
      this.appModal = true;
      this.selUsableL7Server(item).then(() => {
        this.$set(this.appForm, "l7_server_ids", item.l7_server_ids);
        if (!item.l7_server_ids.length) {
          let arr = [];
          arr.push(this.L7List[0].l7ServerId);
          this.$set(this.appForm, "l7_server_ids", arr);
        }
      });
      //   this.getAllConfigInfo();
      this.getNginxConfALLForPremissions();
    },
    // 新建APP
    //添加实例配置信息

    addApp(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.appForm.vips.length <= this.appForm.l7_server_ids.length) {
            if (
              this.appForm.nginx_conf_id ||
              this.appForm.appServerBlockList.length > 0
            ) {
              this.modal_loading = true;
              // let ip = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
              // if (ip.test(this.appForm.vips)){
              //     this.appForm.vips += ':80'
              // }
              addAppInfo(this.appForm)
                .then((res) => {
                  // console.log(res);
                  this.modal_loading = false;
                  if (res.data.code === "success") {
                    this.appModal = false;
                    this.getAppAsideList().then((res) => {
                      /* 第一次添加 */
                      if (this.asyncOk(res) && !this.$route.params.app) {
                        this.appSetActiveAside(res.data.result[0] || {});
                        this.$router.replace(
                          `/app/${this.appServerId}/overview`
                        );
                      }
                    });
                  } else {
                    this.$Message.error({
                      content: res.data.result,
                      duration: 3,
                    });
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              this.$Message.error({
                content: "请添加一个或多个server或者选择一份配置文件",
                duration: 3,
              });
            }
          } else {
            this.$Message.error({
              content: "虚拟ip数量不能大于实例数量",
              duration: 3,
            });
          }
        } else {
          this.$Message.error("请检查输入是否正确!");
        }
      });
    },
    /* 删除APp */
    delApp(id) {
      this.id = id;
      this.$Modal.confirm({
        title: "提示",
        content: "<p>确定要移除这个APP吗？</p>",
        loading: true,
        onOk: () => {
          this.$Modal.remove();
          this.initModal = true;
        },
      });
    },
    //取消初始化实例配置
    async cancleInit() {
      this.disinitloading = true;
      let temp = false;
      let res = await delAppInfo({
        app_server_id: this.id,
        is_init_conf: temp,
      });
      this.disinitloading = false;
      this.initModal = false;
      this.appModal = false;
      if (this.asyncOk(res)) {
        this.$Message.success("删除成功！");
        this.getAppAsideList(true).then((res) => {
          if (this.asyncOk(res) && !res.data.result.length) {
            this.$router.push(`/app`);
          }
          if (this.id === this.$route.params.app) {
            this.$router.replace(`/app/${this.appServerId}/overview`);
          }
        });
      } else {
        this.$Message.error({ content: res.data.result, duration: 3 });
      }
    },
    //确定初始化实例配置
    async confirmInit() {
      this.initloading = true;
      let temp = true;
      let res = await delAppInfo({
        app_server_id: this.id,
        is_init_conf: temp,
      });
      this.initloading = false;
      this.initModal = false;
      this.appModal = false;
      if (this.asyncOk(res)) {
        this.$Message.success("删除成功！");
        this.getAppAsideList(true).then((res) => {
          if (this.asyncOk(res) && !res.data.result.length) {
            this.$router.push(`/app`);
          }
          if (this.id === this.$route.params.app) {
            this.$router.replace(`/app/${this.appServerId}/overview`);
          }
        });
      } else {
        this.$Message.error({ content: res.data.result, duration: 3 });
      }
    },
    /* 重置activeAside */
    resetAside() {
      this.getAppAsideList("update");
    },
    /*修改APP */
    modifyApp(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.appForm.vips.length <= this.appForm.l7_server_ids.length) {
            if (
              this.appForm.nginx_conf_id ||
              this.appForm.appServerBlockList.length > 0
            ) {
              this.modal_loading = true;
              updAppInfo(this.appForm)
                .then((res) => {
                  // console.log(res);
                  this.modal_loading = false;
                  if (res.data.code === "success") {
                    this.appModal = false;
                    this.$Message.success("修改成功");
                    /* 重置当前app信息 */
                    this.resetAside();
                  } else {
                    this.$Message.error(`${res.data.result}`);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              this.$Message.error({
                content: "请添加一个或多个server或者选择一份配置文件",
                duration: 3,
              });
            }
          } else {
            this.$Message.error({
              content: "虚拟ip数量不能大于实例数量",
              duration: 3,
            });
          }
        } else {
          this.$Message.error("请检查输入是否正确!");
        }
      });
    },
    //新增appServerBlock
    addAppServerBlock() {
      this.appForm.appServerBlockList.push({
        listen: 80,
        server_name: "",
        appLocationBlockList: [
          {
            url_path_route_key: "",
            url_path_route_value: "/",
            proxy_url: "",
          },
        ],
      });
      this.ServerandLocationarrowStatus = false;
      this.serverRefresh = false;
      this.$nextTick(() => {
        this.serverRefresh = true;
        this.serverTabPane = this.appForm.appServerBlockList.length;
      });
    },
    //删除appServerBlock
    removeAppServerBlock(indexServe) {
      this.appForm.appServerBlockList.splice(indexServe - 1, 1);
      this.serverRefresh = false;
      this.$nextTick(() => {
        this.serverRefresh = true;
        this.serverTabPane = 1;
      });
      if (this.appForm.appServerBlockList.length < 1) {
        this.ServerandLocationarrowStatus = false;
      }
    },
    //新增appLocationBlock
    addAppLocationBlock(indexServe) {
      this.appForm.appServerBlockList[indexServe].appLocationBlockList.push({
        url_path_route_key: "",
        url_path_route_value: "/",
        proxy_url: "",
      });
    },
    //删除appLocationBlock
    removeAppLocationBlock(indexLocation, indexServe) {
      this.appForm.appServerBlockList[indexServe].appLocationBlockList.splice(
        indexLocation,
        1
      );
    },
    //新增appUpgroupBlock
    addAppUpgroupBlock() {
      this.appForm.appUpgroupBlockList.push({
        upstream_name: "",
        appUpServerBlockList: [
          {
            upstream_server: "",
            weight: 1,
          },
        ],
      });
      this.UpgrouparrowStatus = false;
      this.upstreamRefresh = false;
      this.$nextTick(() => {
        this.upstreamRefresh = true;
        this.upstreamTabPane = this.appForm.appUpgroupBlockList.length;
      });
    },
    //删除appUpgroupBlock
    removeAppUpgroupBlock(indexUpgroup) {
      this.appForm.appUpgroupBlockList.splice(indexUpgroup - 1, 1);
      this.upstreamRefresh = false;
      this.$nextTick(() => {
        this.upstreamRefresh = true;
        this.upstreamTabPane = 1;
      });
      if (this.appForm.appUpgroupBlockList.length < 1) {
        this.UpgrouparrowStatus = false;
      }
    },
    //新增appUpServerBlock
    addAppUpServer(indexUpgroup) {
      this.appForm.appUpgroupBlockList[indexUpgroup].appUpServerBlockList.push({
        upstream_server: "",
        weight: 1,
      });
    },
    //删除appUpServerBlock
    removeAppUpServer(indexUpServer, indexUpgroup) {
      this.appForm.appUpgroupBlockList[
        indexUpgroup
      ].appUpServerBlockList.splice(indexUpServer, 1);
    },
    ServerandLocationarrowDown() {
      this.ServerandLocationarrowStatus = false;
    },
    ServerandLocationarrowUp() {
      this.ServerandLocationarrowStatus = true;
    },
    UpgrouparrowDown() {
      this.UpgrouparrowStatus = false;
    },
    UpgrouparrowUp() {
      this.UpgrouparrowStatus = true;
    },
    /* 获取配置 */
    async getAllConfigInfo() {
      let res = await getNginxConfALL();
      if (this.asyncOk(res)) {
        this.configList = res.data.result || [];
      }
    },
    /* 查询所有有权限的Nginx配置方案 */
    async getNginxConfALLForPremissions() {
      let res = await getNginxConfALLForPremission();
      if (this.asyncOk(res)) {
        this.configList = res.data.result || [];
      }
    },
    /* 获取L7实例 */
    async selUsableL7Server(item) {
      let res = await selUsableL7Server({
        app_service_id: this.edit ? item.app_service_id : null,
      });
      if (this.asyncOk(res)) {
        this.L7List = res.data.result || [];
      }
    },
    //获取所有未绑定APP的实例（导入生产APP时调用）
    async ListL7ServerInfoByImpApp() {
      let res = await ListL7ServerInfoByImpApp();
      if (this.asyncOk(res)) {
        this.L7IDLists = res.data.result || [];
      }
    },
    /* 新增虚拟ip */
    handleAddVip() {
      this.appForm.vips.push("");
    },
    /* 删除虚拟ip */
    handleRemoveVip(index) {
      this.appForm.vips.splice(index, 1);
      if (this.appForm.vips.length === 0) {
        this.appForm.configure_ha = false;
      }
    },
    switchChange(data) {
      if (data) {
        if (this.appForm.vips.length === 0) {
          this.appForm.vips.push("");
        }
      } else {
        this.appForm.custom_priority = false;
      }
    },
    //打开导入模板，并重置数据
    ImportModal() {
      this.importModal = true;
      this.importTabPane = 1;
      this.importForm = {
        app_service_name: "",
        description: "",
        l7IDS: [],
        l7ServerInfoList: [],
        tags: "",
      };
      this.ListL7ServerInfoByImpApp();
    },
    //导入生产应用
    appImport(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (
            this.importForm.l7IDS.length > 0 ||
            this.importForm.l7ServerInfoList.length > 0
          ) {
            this.importLoading = true;
            impApp(this.importForm)
              .then((res) => {
                this.importLoading = false;
                if (res.data.code === "success") {
                  this.importModal = false;
                  this.getAppAsideList().then((res) => {
                    /* 第一次添加 */
                    if (this.asyncOk(res) && !this.$route.params.app) {
                      this.appSetActiveAside(res.data.result[0] || {});
                      this.$router.replace(`/app/${this.appServerId}/overview`);
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
            this.$Message.error("请选择实例或者新增实例!");
          }
        } else {
          this.$Message.error("请检查输入是否正确!");
        }
      });
    },
    //移除导入生产应用里的实例
    removeAppImport(index) {
      this.importForm.l7ServerInfoList.splice(index - 1, 1);
      this.importRefresh = false;
      this.$nextTick(() => {
        this.importRefresh = true;
        this.importTabPane = 1;
      });
    },
    //新增导入生产应用实例
    addImport() {
      this.importForm.l7ServerInfoList.push({
        impConfFlag: false,
        l7ServerName: "",
        l7ServerSSHIp: "",
        l7ServerSSHName: "",
        l7ServerSSHPort: 22,
        l7ServerSSHPwd: "",
        remark: "",
      });
      this.importRefresh = false;
      this.$nextTick(() => {
        this.importRefresh = true;
        this.importTabPane = this.importForm.l7ServerInfoList.length;
      });
    },
    //加锁和解锁
    LockAndUnlock(item) {
      if (item.lock_status) {
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
              this.resetAside();
            } else {
              this.$Modal.remove();
              this.$Message.error(`${res.data.result}`);
            }
          },
        });
      } else {
        this.$Modal.confirm({
          title: "提示",
          content: "<p>确定要锁定？</p>",
          loading: true,
          onOk: async () => {
            let res = await locking({
              primaryKey: item.app_service_id,
              type: "app",
            });
            if (res.data.code === "success") {
              this.$Modal.remove();
              this.$Message.success("锁定成功!");
              this.resetAside();
            } else {
              this.$Modal.remove();
              this.$Message.error(`${res.data.result}`);
            }
          },
        });
      }
    },
  },
  /* 更新组件 */
  created() {
    this.getAppAsideList(true).then((res) => {
      if (this.asyncOk(res) && res.data.result.length) {
        if (!this.$route.params.app) {
          this.$router.replace(`/app/${this.appServerId}/overview`);
        } else {
          this.asideList.map((item) => {
            if (item.app_service_id === this.$route.params.app) {
              this.appSetActiveAside(item);
            }
          });
        }
      }
    });
  },
  mounted() {
    this.timer = setInterval(() => {
      this.getAppAsideList("update");
    }, 1000 * 60);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="less" scoped>
@import "aside";
//@import "../../components/common/configuration/modal-form";
.tag {
  //   margin-right: 10px;
  display: inline-block;
  padding: 5px 10px;
  background: #f3f3f3;
  color: #333;
  //   margin-top: 10px;
}
.custom-ha {
  float: right;
  /deep/ .ivu-form-item-content {
    float: right;
  }
}
/deep/.ivu-modal-footer {
  border: #fff;
}
.arrow-down {
  height: 250px;
}
.arrow-up {
  height: 100%;
}
.listen-and-servegroups {
  //   margin-left: -16px;
  //   width: 543px;
  margin-bottom: 24px;
  .listen-and-servegroups-title {
    font-size: 14px;
    color: #515a6e;
    margin-left: 16px;
  }
  .listen-and-servegroups-top {
    overflow: hidden;
    .listen-and-servegroups-top-content {
      padding: 16px 16px;
      //   display: flex;
      //   justify-content: space-between;
      //   box-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
      .top-content-leftcontent {
        // width: 400px;
        .top-content-leftcontent-title {
          font-size: 14px;
          color: #515a6e;
        }
        .top-content-leftcontent-location {
          display: flex;
          justify-content: space-between;
          padding: 0 16px;
          .location-right {
            width: 22px;
            position: relative;
            .location-right-icon {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              cursor: pointer;
              opacity: 0.6;
              transition: all 0.2s;
              &:hover {
                opacity: 1;
              }
            }
          }
        }
      }
      .top-content-rightcontent {
        width: 26px;
        position: relative;
        .top-content-rightcontent-remove-icon {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          opacity: 0.6;
          transition: all 0.2s;
          &:hover {
            opacity: 1;
          }
        }
      }
    }
  }
  .listen-and-servegroups-bottom-r {
    text-align: right;
    .bottom-content-button-common-style {
      margin-right: 16px;
    }
  }
  .listen-and-servegroups-bottom-l {
    text-align: left;
    margin: 6px 0 4px 16px;
  }
}
/deep/.ivu-modal {
  top: 0;
}
</style>
