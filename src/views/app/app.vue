<template>
  <div class="content_wrap">
    <Aside />
    <div class="content_right" v-if="asideList.length">
      <div class="content_right_scroll">
        <div class="content_header">
          <div class="header_title">
            <span>
              {{ activeAside.app_service_name }}
              <Icon
                class="icon"
                @click="openDrawer = true"
                type="md-settings"
              />
              <Drawer
                :title="activeAside.app_service_name"
                width="420"
                placement="left"
                class="left-drawer"
                :closable="false"
                v-model="openDrawer"
              >
                <div class="content">
                  <div class="row-item">
                    <div class="status">
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
                      <span>状态</span>:
                      {{ activeAside.is_sync ? "已同步" : "未同步" }}
                    </div>
                  </div>

                  <row-item title="入口URL">
                    <div class="row-item" v-if="detailInfo.urls">
                      <div class="info-list">
                        <div
                          class="list-item no-item"
                          v-if="!detailInfo.urls.length"
                        >
                          暂无数据
                        </div>
                        <div
                          class="list-item"
                          :key="item.l7ServerId"
                          v-for="item in detailInfo.urls"
                        >
                          <Row>
                            <Col span="18">
                              <span>URL： {{ item }}</span>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </div>
                  </row-item>
                  <row-item title="后端服务器">
                    <div
                      class="row-item"
                      v-if="detailInfo.appDefaultPublishConfList"
                    >
                      <div class="info-list">
                        <div
                          class="list-item no-item"
                          v-if="!detailInfo.appDefaultPublishConfList.length"
                        >
                          暂无数据
                        </div>
                        <div
                          class="list-item"
                          v-else
                          :key="item.l7ServerId"
                          v-for="item in detailInfo.appDefaultPublishConfList"
                        >
                          <!-- <router-link :to="`/L7/${item.l7ServerId}/chart`">
                                            <Icon type="ios-color-filter-outline" />
                                            {{item.l7ServerName}}
                                        </router-link>-->
                          <Row>
                            <Col span="18">
                              <span>地址： {{ item.upstream_server }}</span>
                            </Col>
                            <Col span="6">
                              <span>权重： {{ item.weight }}</span>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </div>
                  </row-item>
                  <row-item title="关联的实例">
                    <div class="row-item" v-if="detailInfo.l7ServerInfoList">
                      <div class="info-list">
                        <div
                          class="list-item no-item"
                          v-if="!detailInfo.l7ServerInfoList.length"
                        >
                          暂无数据
                        </div>
                        <div
                          class="list-item"
                          :key="item.l7ServerId"
                          v-for="item in detailInfo.l7ServerInfoList"
                        >
                          <router-link :to="`/L7/${item.l7ServerId}/chart`">
                            <Icon type="ios-color-filter-outline" />
                            {{ item.l7ServerName }}
                          </router-link>
                        </div>
                      </div>
                    </div>
                  </row-item>

                  <div class="row-item">
                    <div class="title">
                      <span>关联的配置</span>
                    </div>
                  </div>
                  <div class="row-item">
                    <div class="info-list">
                      <div
                        class="list-item no-item"
                        v-if="!detailInfo.nginxConf"
                      >
                        暂无数据
                      </div>
                      <div class="list-item" v-if="detailInfo.nginxConf">
                        <router-link
                          :to="{
                            name: 'nginxConfig',
                            params: {
                              configName: detailInfo.nginxConf.config_name,
                            },
                            query: {
                              nginx_conf_id: detailInfo.nginxConf.nginx_conf_id,
                            },
                          }"
                        >
                          <Icon type="ios-color-filter-outline" />
                          {{ detailInfo.nginxConf.config_name }}
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </Drawer>
            </span>
            <span class="status">
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
            </span>
            <span class="publish">
              <Button
                type="primary"
                @click="publicAppAuto"
                :disabled="
                  activeAside.appDefaultPublishConfList.length == 0 ||
                    activeAside.is_sync
                "
              >
                快捷发布
              </Button>
              <Button style="margin-left: 20px" @click="publicApp"
                >手动发布</Button
              >
              <Modal v-model="appModal" width="480">
                <p slot="header" style="color:#333;text-align:center">
                  <span>发布APP</span>
                </p>
                <div>
                  <Form
                    ref="formValidate"
                    :model="appForm"
                    :rules="ruleValidate"
                  >
                    <FormItem label="是否开启热备份">
                      <i-switch
                        v-model="appForm.configure_ha"
                        @on-change="switchChange"
                      >
                        <span slot="open">On</span>
                        <span slot="close">Off</span>
                      </i-switch>
                    </FormItem>
                    <div class="label" v-if="appForm.configure_ha">
                      虚拟ip<popTip
                        content="对外开放的IP地址,开启热备份时必填"
                        style="margin-left: 5px;"
                      ></popTip>
                    </div>
                    <Row
                      v-if="appForm.configure_ha"
                      v-for="(item, index) in appForm.vips"
                      :key="index"
                    >
                      <Col span="19">
                        <FormItem label="" :prop="'vips.' + index">
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
                    <FormItem label="选择实例" prop="l7_server_ids">
                      <popTip
                        content="实例为部署NGINX代理的服务器，开启热备份时至少选择两台实例"
                      ></popTip>
                      <Select
                        v-model="appForm.l7_server_ids"
                        filterable
                        multiple
                        @on-select="selectL7"
                      >
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
                    <FormItem
                      label="选择配置"
                      prop="nginx_conf_id"
                      v-if="configList"
                    >
                      <popTip content="选择一个配置并发布到当前APP"></popTip>
                      <Select v-model="appForm.nginx_conf_id" filterable>
                        <Option
                          v-for="item in configList"
                          :value="item.nginx_conf_id"
                          >{{ item.config_name }}</Option
                        >
                      </Select>
                      <div v-if="!configList.length" class="">
                        暂无配置，
                        <router-link to="/newNginxConfig">点击创建</router-link>
                      </div>
                    </FormItem>
                  </Form>
                </div>
                <div slot="footer">
                  <Button @click="appModal = false">取消</Button>
                  <Button type="primary" @click="pushApp('formValidate')"
                    >确认</Button
                  >
                </div>
              </Modal>
            </span>
          </div>
          <div class="header_tab">
            <div class="tab">
              <router-link
                :to="`/app/${$route.params.app}/overview`"
                class="tab_item"
                >概览</router-link
              >
              <router-link
                :to="`/app/${$route.params.app}/dispatch`"
                class="tab_item"
                >调度</router-link
              >
              <router-link
                v-if="activeAside.configure_ha"
                :to="`/app/${$route.params.app}/ha`"
                class="tab_item"
                >HA</router-link
              >
              <span v-else class="tab_item disabled">HA</span>
              <router-link
                      :to="`/app/${$route.params.app}/config`"
                      class="tab_item"
              >配置</router-link
              >
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
import rowItem from "./rowItem";
import popTip from "@/components/common/pop-tip";
import { mapState, mapMutations, mapActions } from "vuex";
import { pushApp, selAppDetails, pushAppDefault } from "../../api/app";
import { getNginxConfALL, selUsableL7Server, pushCheck } from "../../api/L7";

export default {
  data() {
    const selection = (rule, value, callback) => {
      if (!value) {
        if (this.appForm.configure_ha) {
          return callback(new Error("已开启热备份，至少选择两个实例"));
        }
        return callback(new Error("至少选择一个实例"));
      } else {
        callback();
      }
    };
    const config = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("必须选择一个配置文件"));
      } else {
        callback();
      }
    };
    this.ipPort = (rule, value, callback) => {
      if (value) {
        let ip = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
        //let port = /^[1-9]$|(^[1-9][0-9]$)|(^[1-9][0-9][0-9]$)|(^[1-9][0-9][0-9][0-9]$)|(^[1-6][0-5][0-5][0-3][0-5]$)/;
        //let ipAndPort = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
        // if (ip.test(value) || port.test(value) || ipAndPort.test(value)) {
        if (ip.test(value)) {
          callback();
        } else {
          callback(new Error("格式错误"));
        }
      } else {
        callback(new Error("不能为空"));
      }
    };
    return {
      openDrawer: false,
      appModal: false,
      appForm: {
        AppVip: "",
      },
      ruleValidate: {
        l7_server_ids: [{ validator: selection, trigger: "change" }],
        AppVip: [{ validator: this.ipPort }],
        nginx_conf_id: [{ validator: config }],
      },
      modal_loading: false,
      configList: null,
      L7List: [],
      detailInfo: {},
      collapsed: false,
      server: false,
      pushAppLoading: false,
      is_sync: "",
    };
  },
  components: {
    Aside,
    popTip,
    rowItem,
  },
  methods: {
    ...mapMutations(["appSetActiveAside"]),
    ...mapActions(["getAppAsideList"]),
    publicApp() {
      this.appModal = true;
      this.appForm = this.copyJson(this.activeAside);
      this.getAllConfigInfo();
      this.selUsableL7Server().then(() => {
        this.$set(
          this.appForm,
          "l7_server_ids",
          this.activeAside.l7_server_ids
        );
        if (!this.appForm.l7_server_ids.length) {
          let arr = [];
          arr.push(this.L7List[0].l7ServerId);
          this.$set(this.appForm, "l7_server_ids", arr);
        }
      });
    },
    /* 发布APP */
    pushApp(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.appForm.vips.length <= this.appForm.l7_server_ids.length) {
            //this.modal_loading = true;
            pushCheck(
              { nginx_conf_id: this.appForm.nginx_conf_id },
              this.appForm.l7_server_ids
            ).then((res) => {
              if (this.asyncOk(res) && this.isEmptyObject(res.data.result)) {
                this.appModal = false;
                this.pushAppData();
              } else if (!this.isEmptyObject(res.data.result)) {
                this.$Modal.confirm({
                  render: (h) => {
                    return h("div", [
                      h(
                        "p",
                        "您当前需要发布的配置文件中包含以下PLUS版本的配置信息："
                      ),
                      h("p", {
                        domProps: {
                          innerHTML: res.data.result.plus_conf_param,
                        },
                        style: {
                          color: "#333",
                          fontSize: "14px",
                        },
                      }),
                      h("div", [
                        h("span", "所选实例中"),
                        res.data.result.l7ServerName.map((item) => {
                          return h("span", {
                            class: "l7ServerName",
                            domProps: {
                              innerHTML: item,
                            },
                          });
                        }),
                        h("span", "不支持以上配置。"),
                      ]),
                      h("p", "继续发布将跳过以上实例发布。是否继续？"),
                    ]);
                  },
                  onOk: () => {
                    this.appModal = false;
                    this.pushAppData();
                  },
                });
              }
            });
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
    /* 提交发布数据 */
    pushAppData() {
      this.$Spin.show({
        render: (h) => {
          return h("Spin", [
            h(
              "div",
              {
                class: "loader",
              },
              [
                h(
                  "svg",
                  {
                    class: "circular",
                    attrs: {
                      viewBox: "25 25 50 50",
                    },
                  },
                  [
                    h("circle", {
                      class: "path",
                      attrs: {
                        cx: "50",
                        cy: "50",
                        r: "20",
                        fill: "none",
                        "stroke-width": "2",
                        "stroke-miterlimit": "0",
                      },
                    }),
                  ]
                ),
              ]
            ),
            h("div", {
              domProps: {
                innerHTML: "正在发布",
              },
              style: {
                color: "#333",
                fontSize: "14px",
              },
            }),
          ]);
        },
      });
      pushApp(this.appForm)
        .then((res) => {
          this.$Spin.hide();
          if (res.data.code === "success") {
            this.$Message.success("发布成功");
            /* 同步当前侧栏选中项状态 */
            this.resetAside();
          } else {
            this.$Notice.error({desc: res.data.result, duration: 0});
          }
        })
        .catch((err) => {
          this.$Spin.hide();
          console.log(err);
        });
    },
    /* 重置activeAside */
    resetAside() {
      /*this.getAppAsideList().then((res) => {
          if (res.data.code === 'success') {
            let target = res.data.result.filter((item) => {
              return item.app_service_id === this.activeAside.app_service_id
            })
            this.appSetActiveAside(target[0] || {})
          }
        })*/
      this.getAppAsideList("update");
    },
    /* 一键发布 */
    async publicAppAuto() {
      this.$Spin.show({
        render: (h) => {
          return h("Spin", [
            h(
              "div",
              {
                class: "loader",
              },
              [
                h(
                  "svg",
                  {
                    class: "circular",
                    attrs: {
                      viewBox: "25 25 50 50",
                    },
                  },
                  [
                    h("circle", {
                      class: "path",
                      attrs: {
                        cx: "50",
                        cy: "50",
                        r: "20",
                        fill: "none",
                        "stroke-width": "2",
                        "stroke-miterlimit": "0",
                      },
                    }),
                  ]
                ),
              ]
            ),
            h("div", {
              domProps: {
                innerHTML: "正在发布",
              },
              style: {
                color: "#333",
                fontSize: "14px",
              },
            }),
          ]);
        },
      });
      // this.pushAppLoading = true
      let res = await pushAppDefault(this.activeAside);
      this.$Spin.hide();
      // this.pushAppLoading = false
      if (this.asyncOk(res)) {
        this.$Message.success("发布成功");
        /* 同步当前侧栏选中项状态 */
        this.resetAside();
      } else {
        this.$Notice.error({desc: res.data.result, duration: 0});
      }
    },
    /* 获取配置 */
    async getAllConfigInfo() {
      let res = await getNginxConfALL();
      if (this.asyncOk(res)) {
        this.configList = res.data.result || [];
      }
    },
    /* 获取L7实例 */
    async selUsableL7Server() {
      let res = await selUsableL7Server({
        app_service_id: this.$route.params.app,
      });
      if (this.asyncOk(res)) {
        this.L7List = res.data.result || [];
      }
    },
    /* 选择L7实例 */
    selectL7(item) {
      console.log(item);
    },
    /* 侧栏获取app详细信息 */
    async selAppDetails(id) {
      let res = await selAppDetails({
        app_server_id: this.activeAside.app_service_id,
      });
      //console.log(res)
      if (this.asyncOk(res)) {
        this.detailInfo = res.data.result || {};
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
      }
    },
  },
  watch: {
    openDrawer(val, oldVal) {
      if (val) {
        //console.log(this.activeAside.app_service_id)
        this.selAppDetails();
      }
    },
  },
  computed: {
    ...mapState({
      asideList: (state) => state.app.asideList,
      activeAside: (state) => state.app.activeAside,
    }),
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    this.appSetActiveAside(this.asideList[0]);
    next();
  },
  mounted() {
    // console.log(this.activeAside.appDefaultPublishConfList);
  },
};
</script>
<style lang="less">
@import "../L4/L4";

.content_main {
  height: calc(100%);
  padding: 98px 10px 0 10px;
  //box-sizing: border-box;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
.l7ServerName {
  color: @green;

  margin: 0 10px;
}
.remove-icon {
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s;
  &:hover {
    opacity: 1;
  }
}
.label {
  vertical-align: middle;
  font-size: 14px;
  color: #515a6e;
  line-height: 1;
  padding: 10px 12px 10px 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
