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
        <upstream-zone
                :modify="modify"
                :data = "uptZone"
                @edit = "checkEditStatus"
                @readyOk = 'prepareConfig'
        ></upstream-zone>
        <active-health-check
                :modify="modify"
                :data = "activeHealthcheck"
                @edit = "checkEditStatus"
                @readyOk = 'prepareConfig'
        ></active-health-check>
        <keep-alive-connection-pool
                :modify="modify"
                :data = "keepalive"
                @edit = "checkEditStatus"
                @readyOk = 'prepareConfig'
        ></keep-alive-connection-pool>
        <Queueing
                :modify="modify"
                :data = "queueing"
                @edit = "checkEditStatus"
                @readyOk = 'prepareConfig'
        ></Queueing>
        <ntln-authentication
                :modify="modify"
                :data = "ntlmAuthentication"
                @edit = "checkEditStatus"
                @readyOk = 'prepareConfig'
        ></ntln-authentication>
        <persistent-state
                :modify="modify"
                :data = "persistentState"
                @edit = "checkEditStatus"
                @readyOk = 'prepareConfig'
        ></persistent-state>

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
        if (this.isEmptyObject(nv))return
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
        this.uptZone = {
          upstream_zone_state: this.serverForm.upstream_zone_state,
          upstream_zone_name: this.serverForm.upstream_zone_name,
          upstream_zone_size: this.serverForm.upstream_zone_size,
        }
        this.activeHealthcheck ={
          active_healthcheck_state: this.serverForm.active_healthcheck_state,
          healthcheck_url: this.serverForm.healthcheck_url,
          healthcheck_host: this.serverForm.healthcheck_host,
        }
        this.keepalive ={
          keepalive_connection_pool_state: this.serverForm.keepalive_connection_pool_state,
          keepalive_connection_pool_value: this.serverForm.keepalive_connection_pool_value,
        }
        this.queueing = {
          queueing_state: this.serverForm.queueing_state,
          queueing_number: this.serverForm.queueing_number,
          queueing_time: this.serverForm.queueing_time,
        }
        this.ntlmAuthentication = {
          ntlm_authentication_state: this.serverForm.ntlm_authentication_state,
        }
        this.persistentState = {
          persistent_state: this.serverForm.persistent_state,
          persistent_file: this.serverForm.persistent_file,
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
      activeHealthcheck: {},
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
        console.log(this.serverForm)
        this.$emit('submit', this.serverForm)
        this.change(false)
      }
    },
    /* 检查是否有未保存的配置项 */
    checkEditStatus(data){
     // console.log(data)
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
