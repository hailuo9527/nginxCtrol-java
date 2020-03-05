<template>
  <div v-if="model">
    <Modal
            width="790"
            v-model="model"
            :transfer="true"
            :mask-closable="false"
            @on-visible-change="change"
            :title="modify?  '修改UPSTREAM GROUP' : '新建UPSTREAM GROUP'"
    >
      <div class="virtual_server_form">
        <Alert type="error" class="err-tip" v-if="errorTip.show" closable>
          您需要确认每个部分的更改: {{errorTip.value}}
          <Icon type="md-close" class="close" slot="close" />
        </Alert>
        <upstream-group-name
                :modify="modify"
                :data = "groupName"
                @edit = "checkEditStatus"
                @readyOk = 'prepareConfig'>
        </upstream-group-name>
        <upstream-servers
                :modify="modify"
                :data = "servers"
                @edit = "checkEditStatus"
                @readyOk = 'prepareConfig'>

        </upstream-servers>
        <load-balancing-method
                :modify="modify"
                :data = "loadBalancing"
                @edit = "checkEditStatus"
                @readyOk = 'prepareConfig'
        ></load-balancing-method>
        <session-persistence
                :modify="modify"
                :data = "session"
                @edit = "checkEditStatus"
                @readyOk = 'prepareConfig'
        ></session-persistence>
<!--        <load-balancing-method ></load-balancing-method>-->
<!--        <session-persistence ></session-persistence>-->
<!--        <upstream-zone ></upstream-zone>-->
<!--        <active-health-check ></active-health-check>-->
<!--        <keep-alive-connection-pool ></keep-alive-connection-pool>-->
<!--        <Queueing ></Queueing>-->
<!--        <ntln-authentication ></ntln-authentication>-->
<!--        <persistent-state></persistent-state>-->
        <!--<Form ref="form" :model="serverForm" :rules="serverFormRules" @submit.native.prevent>
            <my-form-item
              title="UPSTREAM GROUP NAME"
              @closeConfig="closeConfig('domain')"
              @saveConfig="saveConfig('domain')"
              info="Define the name for a group of servers to use with the proxy_pass."
            >
              <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
                <FormItem class="line-form-item" prop="GroupName" >
                  <Input v-model="serverForm.GroupName" placeholder="name"></Input>
                </FormItem>
              </div>

              <div slot="show" class="ctrl-edit-item">
                <div class="ctrl-edit-item__string">path</div>
              </div>
            </my-form-item>
            <my-form-item
              :obj="serverForm.listening_m.listening"
              title="UPSTREAM SERVERS"
              @closeConfig="closeConfig('serverForm.listening_m.listening')"
              @saveConfig="saveConfig('serverForm.listening_m.listening')"
              :important="false"
              info="Specify the backend servers in the upstream group. A server is identified by an IP address or FQDN. An optional port may be specified, and the default port is 80."
            >
              <div slot="edit">
                <draggable
                  v-model="dragList"
                  handle=".drag-handle"
                  @start="drag = true"
                  ghost-class="drag-item-ghost"
                  @end="drag = false"
                >
                  <transition-group>
                    <div v-for="element in dragList" :key="element.id">
                      <div class="ctrl-edit-item ctrl-edit-item_edit mulity upstream">
                        <span class="drag-handle" v-if="dragList.length>1"></span>
                        <div class="item-body">
                          <FormItem label class="line-form-item" prop="ServersName">
                            <Input v-model="serverForm.ServersName" placeholder="address | name"></Input>
                          </FormItem>
                          <FormItem label="WEIGHT" class="inline-form-item">
                            <Input placeholder="number"></Input>
                          </FormItem>
                          <FormItem label="MAX ACTIVE CONNECTIONS" class="inline-form-item">
                            <Input placeholder="number"></Input>
                          </FormItem>
                          <FormItem label="MAX FAILED CONNECTIONS" class="inline-form-item">
                            <Input placeholder="number"></Input>
                          </FormItem>
                          <FormItem label="FAIL TIMEOUT" class="inline-form-item">
                            <Input placeholder="time"></Input>
                          </FormItem>
                          <FormItem label="BACKUP SERVER" class="aline-center">
                            <i-switch size="small"></i-switch>
                          </FormItem>
                          <FormItem label="RESOLVE" class="aline-center">
                            <i-switch size="small"></i-switch>
                            <PopTip
                              style="margin-left: 10px;margin-top: 2px;"
                              :size="18"
                              content="To make this work you should setup the shared memory zone inside the upstream group.Also, the resolver directive must be specified in the http block."
                              placement="right"
                            ></PopTip>
                          </FormItem>
                          <FormItem label="ROUTE NAME" class="inline-form-item">
                            <Input placeholder="name"></Input>
                          </FormItem>
                          <FormItem label="WEIGHT RECOVERING TIME" class="inline-form-item">
                            <Input placeholder="time"></Input>
                          </FormItem>
                          <FormItem label="SERVER BOUND REQUESTS ONLY" class="aline-center">
                            <i-switch size="small"></i-switch>
                          </FormItem>
                          <FormItem label="MARK AS DOWN" class="aline-center">
                            <i-switch size="small"></i-switch>
                          </FormItem>
                        </div>
                        <div class="item-body-remove">
                          <Icon type="ios-trash" class="remove-icon" size="20" />
                        </div>
                      </div>
                    </div>
                  </transition-group>
                </draggable>

                <div class="add-listen">
                  <Icon class="icon" size="22" type="ios-add-circle-outline" />
                  <span class="tip">Add server</span>
                </div>
              </div>

              <div slot="show">
                <div class="ctrl-edit-item"></div>
              </div>
            </my-form-item>
            <my-form-item
              title="LOAD BALANCING METHOD"
              @closeConfig="closeConfig('domain')"
              @saveConfig="saveConfig('domain')"
              info="This is the load balancing method to use against the specified upstream group."
            >
              <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
                <FormItem label class="line-form-item">
                  <Select>
                    <Option value="1">weighted round-robin</Option>
                    <Option value="2">hash</Option>
                    <Option value="3">ip_hash</Option>
                    <Option value="4">least_conn</Option>
                    <Option value="5">least_time</Option>
                  </Select>
                </FormItem>
                <div
                  class="ctrl-edit-item__note"
          >Requests are distributed between the servers using a weighted round-robin balancing method</div>-->
        <!-- <div class="ctrl-edit-item__note">The client-server mapping is based on the hashed key value</div>
                          <div class="ctrl-edit-item__note">Requests are distributed between servers based on client IP addresses</div>
                          <div class="ctrl-edit-item__note">A request is passed to the server with the least number of active connections</div>
        <div class="ctrl-edit-item__note">A request is passed to the server with the least average response time and least number of active connections</div>-->
        <!-- </div>

            <div slot="show" class="ctrl-edit-item">
              <Select>
                <Option value="dataready">weighted round-robin</Option>
                <Option value="httpready">hash</Option>
                <Option value="httpready">ip_hash</Option>
                <Option value="httpready">least_conn</Option>
                <Option value="httpready">least_time</Option>
              </Select>
            </div>
          </my-form-item>
          <my-form-item
            title="SESSION PERSISTENCE"
            @closeConfig="closeConfig('domain')"
            @saveConfig="saveConfig('domain')"
            info="Enables session affinity, which causes requests from the same client to be passed to the same server in a group of servers"
          >
            <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
              <FormItem label="METHOD" class="line-form-item full-input">
                <Select>
                  <Option value="1">weighted round-robin</Option>
                  <Option value="2">hash</Option>
                  <Option value="3">ip_hash</Option>
                  <Option value="4">least_conn</Option>
                  <Option value="5">least_time</Option>
                </Select>
              </FormItem>
              <FormItem label="COOKIE" class="line-form-item full-input">
                <Input placeholder="name"></Input>
              </FormItem>
              <FormItem label="EXPIRES" class="line-form-item full-input">
                <Input placeholder="time"></Input>
              </FormItem>
              <FormItem label="DOMAIN" class="line-form-item full-input">
                <Input placeholder="domain"></Input>
              </FormItem>
              <FormItem label="HTTPONLY" class="aline-center">
                <i-switch size="small"></i-switch>
              </FormItem>
              <FormItem label="SECURE" class="aline-center">
                <i-switch size="small"></i-switch>
              </FormItem>
              <FormItem label="PATH" class="line-form-item full-input">
                <Input placeholder="path"></Input>
              </FormItem>
            </div>

            <div slot="show" class="ctrl-edit-item"></div>
          </my-form-item>
          <my-form-item
            title="UPSTREAM ZONE"
            @closeConfig="closeConfig('domain')"
            @saveConfig="saveConfig('domain')"
            info="This is a shared memory zone to use with the upstream group. Upstream zone keeps the group's configuration, the run-time state, and the performance metrics/counters."
          >
            <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
              <div style="display: flex; justify-content: space-between">
                <FormItem label class="inline-form-item">
                  <Input placeholder="name"></Input>
                </FormItem>
                <FormItem label class="inline-form-item">
                  <Input placeholder="size"></Input>
                </FormItem>
              </div>
            </div>

            <div slot="show" class="ctrl-edit-item">
              <span class="ctrl-edit-item__string">number</span>
              <span class="ctrl-edit-item__string">time</span>
            </div>
          </my-form-item>
          <my-form-item
            title="ACTIVE HEALTHCHECK"
            @closeConfig="closeConfig('domain')"
            @saveConfig="saveConfig('domain')"
            info="Enable periodic active health checks for the servers in this upstream group."
          >
            <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
              <FormItem label="HEALTHCHECK URI" class="line-form-item full-input">
                <Input placeholder="URI"></Input>
              </FormItem>
              <FormItem label="HOST" class="line-form-item full-input">
                <Input placeholder="example.com"></Input>
              </FormItem>
            </div>

            <div slot="show" class="ctrl-edit-item">
              <div class="ctrl-edit-properties__row">
                <span class="label">HEALTHCHECK URI</span>
                <span class="value">123</span>
              </div>
              <div class="ctrl-edit-properties__row">
                <span class="label">HOST</span>
                <span class="value">123</span>
              </div>
            </div>
          </my-form-item>
          <my-form-item
            title="KEEPALIVE CONNECTION POOL"
            @closeConfig="closeConfig('domain')"
            @saveConfig="saveConfig('domain')"
            info="The keepalive connection pool can be used to reduce the latency of communications to the upstream servers."
          >
            <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
              <FormItem label class="line-form-item">
                <Input placeholder="number"></Input>
              </FormItem>
            </div>

            <div slot="show" class="ctrl-edit-item">
              <div class="ctrl-edit-item__string">number</div>
            </div>
          </my-form-item>
          <my-form-item
            title="QUEUEING"
            @closeConfig="closeConfig('domain')"
            @saveConfig="saveConfig('domain')"
            info="If an upstream server cannot be selected immediately while processing a request, the request will be placed into the queue."
          >
            <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
              <div style="display: flex; justify-content: space-between">
                <FormItem label class="inline-form-item">
                  <Input placeholder="name"></Input>
                </FormItem>
                <FormItem label class="inline-form-item">
                  <Input placeholder="size"></Input>
                </FormItem>
              </div>
            </div>

            <div slot="show" class="ctrl-edit-item">
              <span class="ctrl-edit-item__string">number</span>
              <span class="ctrl-edit-item__string">time</span>
            </div>
          </my-form-item>
          <my-form-item
            title="NTLM AUTHENTICATION"
            @closeConfig="closeConfig('domain')"
            @saveConfig="saveConfig('domain')"
            info="Use specific technique to proxy NTLM authentication requests to upstream servers."
          >
            <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit"></div>

            <div slot="show" class="ctrl-edit-item"></div>
          </my-form-item>
          <my-form-item
            title="PERSISTENT STATE"
            @closeConfig="closeConfig('domain')"
            @saveConfig="saveConfig('domain')"
            info="Specifies a file that keeps the state of the upstream group."
          >
            <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
              <FormItem label class="line-form-item">
                <Input placeholder="file"></Input>
              </FormItem>
            </div>

            <div slot="show" class="ctrl-edit-item">
              <div class="ctrl-edit-item__string">file</div>
            </div>
          </my-form-item>

        </Form>-->
      </div>
      <div slot="footer">
        <Button @click="model = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="handleSubmit">保存</Button>
      </div>
    </Modal>
  </div>

</template>
<script>

import UpstreamGroupName from "./upstreamModal/UpstreamGroupName";
import UpstreamServers from "./upstreamModal/UpstreamServers";
import SessionPersistence from "./upstreamModal/SessionPersistence";
import UpstreamZone from "./upstreamModal/UpstreamZone";
import ActiveHealthCheck from "./upstreamModal/ActiveHealthCheck";
import KeepAliveConnectionPool from "./upstreamModal/KeepAliveConnectionPool";
import Queueing from "./upstreamModal/Queueing";
import PersistentState from "./upstreamModal/PersistentState";
import LoadBalancingMethod from "./upstreamModal/LoadBalancingMethod";
import NtlnAuthentication from "./upstreamModal/NtlnAuthentication";
export default {
  props: {
    show: false,
    data: {
      type: Object,
      default: () => {}
    },
    modify: false
  },
  components: {
    UpstreamGroupName,
    UpstreamServers,
    SessionPersistence,
    UpstreamZone,
    ActiveHealthCheck,
    KeepAliveConnectionPool,
    Queueing,
    PersistentState,
    LoadBalancingMethod,
    NtlnAuthentication
  },
  watch: {
    show (newVal, oldVal) {
      this.model = newVal
    },
    model(newVal, oldVal){
      if (!newVal) {
        this.change(newVal)
        this.errorTip = {
          show: false,
          value: ''
        }
      }
    },
    data : {
      handler(nv, ov){
        /* 拷贝对象 */
        this.serverForm = this.copyJson(nv)
        this.groupName = {
          group_name: this.serverForm.group_name,
        }
        this.servers = {
          ngcUpstreamServers: this.serverForm.ngcUpstreamServers
        }
        this.loadBalancing = {
          load_balancing_method: this.serverForm.load_balancing_method,
          hash_key: this.serverForm.hash_key,
          ketama_consisten_state: this.serverForm.ketama_consisten_state,
          time_to_receive: this.serverForm.time_to_receive,
          serve_incomplete_requests_state: this.serverForm.serve_incomplete_requests_state,
        }
        this.session = {
          session_persistence_state: this.serverForm.session_persistence_state,
          method: this.serverForm.method,
          cookie: this.serverForm.cookie,
          cookie_domain: this.serverForm.cookie_domain,
          cookie_expires: this.serverForm.cookie_expires,
          cookie_httponly_state: this.serverForm.cookie_httponly_state,
          cookie_secure_state: this.serverForm.cookie_secure_state,
          cookie_path: this.serverForm.cookie_path,
          route_variables: this.serverForm.route_variables,
          leam_create: this.serverForm.leam_create,
          leam_lookup: this.serverForm.leam_lookup,
          leam_shared_memory_zone: this.serverForm.leam_shared_memory_zone,
          leam_session_remove_timeout: this.serverForm.leam_session_remove_timeout,
          leam_chrarrh: this.serverForm.leam_chrarrh,
        }

      },
      immediate: true
    },
  },
  data() {
    return {
      modal_loading: false,
      model: false,
      errorInfo: {},
      errorTip: {
        show: false,
        value: ""
      },
      groupName: {},
      servers: {},
      loadBalancing: {},
      session: {},
      uptZone: {},
      keepalive: {},
      queueing: {},
      ntlmAuthentication: {},
      persistentState: {}
    };
  },
  computed: {},
  methods: {
    change(data) {
      this.model = data;
      this.$emit("change", { data: data, name: "upstreamModal" });
    },

    handleSubmit() {

      console.log('保存')
      // 验证是否有未确认的更改
      // console.log(this.errorInfo)
      let flag = true

      Object.keys(this.errorInfo).map((item) => {
        //console.log(this.errorInfo[item])
        if (this.errorInfo[item]){
          flag = false
          this.errorTip = {
            show: true,
            value: item
          }
        }
      })
      if (flag) {
        this.$emit('submit', this.serverForm)
        this.change(false)
      }
    },
    /* 检查是否有未保存的配置项 */
    checkEditStatus(data){
      console.log(data)
      //if (!data) return
      this.errorInfo[data.name] = data.value
      Object.keys(this.errorInfo).map((item) => {
        if (!this.errorInfo[item]){
          this.errorTip = {
            show: false,
            value: ''
          }
        }
      })
    },
    prepareConfig(data) {
      console.log(data)
      Object.keys(data).map(item => {
        this.serverForm[item] = data[item] // 拿到修改过后的配置对象
      })
     // this.checkEditStatus()
    },


  },
  mounted() {
    //console.log(this.data);
  }
};
</script>
<style lang="less" scoped>
@import "modal-form";

.upstream {
  /deep/ .ivu-form .ivu-form-item-label {
    flex-basis: 45%;
  }
}
</style>
