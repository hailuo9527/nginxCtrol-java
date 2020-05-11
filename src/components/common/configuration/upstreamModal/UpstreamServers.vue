<template>
  <my-form-item
          :title="title"
          @closeConfig = "closeConfig"
          @saveConfig = "saveConfig"
          @cancel = "cancel"
          @edit="edit"
          :open="true"
          :modify="modify"
          :valid="valid"
          :important="true"
          :info="info"
  >
    <div slot="edit">
      <draggable
        v-model="form.ngcUpstreamServers"
        handle=".drag-handle"
        @start="drag = true"
        ghost-class="drag-item-ghost"
        @end="drag = false"
      >
        <transition-group>
          <div :key="index" v-for="(item, index) in form.ngcUpstreamServers">
            <div class="ctrl-edit-item ctrl-edit-item_edit mulity upstream">
              <span class="drag-handle" v-if="form.ngcUpstreamServers.length>1"></span>
              <div class="item-body">
                <Form ref="form" :model="item" :rules="formRules" @submit.native.prevent>
                  <FormItem label class="line-form-item" prop="upstream_servers_name">
                    <Input  placeholder="address | name" v-model.trim="item.upstream_servers_name"></Input>
                  </FormItem>
                  <FormItem label="WEIGHT" class="inline-form-item" prop="weight">
                    <Input placeholder="number" v-model.trim="item.weight"></Input>
                  </FormItem>
                  <FormItem label="MAX ACTIVE CONNECTIONS" class="inline-form-item" prop="max_active_connections">
                    <Input placeholder="number" v-model.trim="item.max_active_connections"></Input>
                  </FormItem>
                  <FormItem label="MAX FAILED CONNECTIONS" class="inline-form-item" prop="max_failed_connections">
                    <Input placeholder="number" v-model.trim="item.max_failed_connections"></Input>
                  </FormItem>
                  <FormItem label="FAIL TIMEOUT" class="inline-form-item" prop="fail_timeout">
                    <Input placeholder="time" v-model.trim="item.fail_timeout"></Input>
                  </FormItem>
                  <FormItem label="BACKUP SERVER" class="aline-center">
                    <i-switch size="small" v-model="item.backup_server_state"></i-switch>
                  </FormItem>
                  <FormItem label="RESOLVE" class="aline-center common-color">
                    <i-switch size="small" v-model="item.resolve_state"></i-switch>
                    <PopTip
                      style="margin-left: 10px;margin-top: 2px;"
                      :size="18"
                      content="若要使此工作正常，应在upstream group内设置共享内存区域。此外，还必须在http块中指定resolver指令。"
                      placement="right"
                    ></PopTip>
                  </FormItem>
                  <FormItem label="ROUTE NAME" class="inline-form-item">
                    <Input placeholder="name" v-model.trim="item.route_name"></Input>
                  </FormItem>
                  <FormItem label="SERVICE NAME" class="inline-form-item" v-if="item.resolve_state">
                    <Input placeholder="name" v-model.trim="item.service_name"></Input>
                  </FormItem>
                  <FormItem label="WEIGHT RECOVERING TIME" class="inline-form-item">
                    <Input placeholder="time" v-model.trim="item.weight_recovering_time"></Input>
                  </FormItem>
                  <FormItem label="SERVER BOUND REQUESTS ONLY" class="aline-center">
                    <i-switch size="small" v-model="item.server_bound_requests_only"></i-switch>
                  </FormItem>
                  <FormItem label="MARK AS DOWN" class="aline-center">
                    <i-switch size="small" v-model="item.mark_as_down"></i-switch>
                  </FormItem>
                </Form>
              </div>
              <div class="item-body-remove" >
                <Icon type="ios-trash" class="remove-icon" size="20" @click="removeList(form.ngcUpstreamServers, index)"/>
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>

      <div class="add-listen" @click="addRule">
        <Icon class="icon" size="22" type="ios-add-circle-outline" />
        <span class="tip">Add server</span>
      </div>
    </div>

    <div slot="show">
      <div class="ctrl-edit-item" :key="key" v-for="(item, key) in form.ngcUpstreamServers">
        <div class="ctrl-edit-item__string">{{item.upstream_servers_name}}</div>
        <div class="ctrl-edit-item__tags">
          <span class="tags" v-if="item.weight">weight={{item.weight}}</span>
          <span class="tags" v-if="item.max_active_connections">max_conns={{item.max_active_connections}}</span>

          <span class="tags" v-if="item.fail_timeout">fail_timeout={{item.fail_timeout}}</span>
          <span class="tags" v-if="item.backup_server_state">backup</span>
          <span class="tags" v-if="item.mark_as_down">down</span>
          <span class="tags" v-if="item.resolve_state">resolve</span>

          <span class="tags" v-if="item.route_name">route={{item.route_name}}</span>
          <span class="tags" v-if="item.service_name">service={{item.service_name}}</span>
          <span class="tags" v-if="item.weight_recovering_time">slow_start={{item.weight_recovering_time}}</span>
          <span class="tags" v-if="item.server_bound_requests_only">drain</span>

        </div>
      </div>
    </div>
  </my-form-item>
</template>

<script>
import mixin from "../mixins";
import draggable from "vuedraggable";
import PopTip from "@/components/common/pop-tip";
import emptyConfig from '../emptyConfig'
export default {
  mixins: [mixin],
  components: {
    draggable, PopTip
  },
  data() {
    const number = { type: 'number', message: '请输入数字', trigger: 'blur',
      transform(value) {
        return Number(value);
      }
    }
    return {
      title: "server",
      info: "指定upstream group中的后端服务器。服务器由IP地址或FQDN标识。可以指定可选端口，默认端口为80。",
      formRules: {
        upstream_servers_name: [
          { required: 'true', message: '不能为空' }
        ],
        weight: [
              number
        ],
        max_active_connections: [
                number
        ],
        max_failed_connections: [
                number
        ],
        fail_timeout: [ number ],




      },

    };
  },
  computed: {},
  methods: {
    /* 保存配置项 */
    saveConfig() {
      let flag = true
      for(let item of this.$refs['form']){
        item.validate(valid => {
          if (!valid) {
            flag = false
          }
        })
      }
      this.valid = flag
      if (flag){
        this.$emit('readyOk', this.form)
      } else {
        this.$Message.error('验证失败')
      }
    },
    addRule() {

      let json = this.copyJson(emptyConfig.ngcUpstreamGroups[0].ngcUpstreamServers[0])

      this.form.ngcUpstreamServers.push(json)
    },
    removeList(arr, index) {
      arr.splice(index, 1)
    },

  },

  mounted() {}
};
</script>
<style lang="less" scoped>
@import "../modal-form";
</style>
