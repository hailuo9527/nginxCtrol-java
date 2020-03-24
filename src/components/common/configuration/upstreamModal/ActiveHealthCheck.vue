<template>
  <my-form-item
          :title="title"
          @closeConfig = "closeConfig"
          @saveConfig = "saveConfig"
          @cancel = "cancel"
          @edit="edit"
          :modify="modify"
          :disabled="disabled"
          :open = "form.active_healthcheck_state"
          :valid="valid"
          :info="info"
  >
    <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
       <Form ref="form" :model="form" :rules="formRules" :hide-required-mark="true" @submit.native.prevent>
          <FormItem label="HEALTHCHECK URI" class="line-form-item full-input" prop="healthcheck_url">
            <Input placeholder="URI" v-model.trim="form.healthcheck_url"></Input>
          </FormItem>
          <FormItem label="HOST" class="line-form-item full-input" prop="healthcheck_host">
            <Input placeholder="example.com" v-model.trim="form.healthcheck_host"></Input>
          </FormItem>
      </Form>
    </div>

    <div slot="show" class="ctrl-edit-item">
      <div class="ctrl-edit-properties__row">
        <span class="label">HEALTHCHECK URI</span>
        <span class="value">{{form.healthcheck_url}}</span>
      </div>
      <div class="ctrl-edit-properties__row">
        <span class="label">HOST</span>
        <span class="value">{{form.healthcheck_host}}</span>
      </div>
    </div>
  </my-form-item>
</template>

<script>
import mixin from "../mixins";
import emptyConfig from '../emptyConfig'
export default {
  mixins: [mixin],
  name: "ActiveHealthCheck",
  data() {
    const urlRule = (rule, value,callback) => {
      if (!value) {
        callback(new Error('不能为空'))
      } else {
        if (value.slice(0,1) !== '/'){
          callback(new Error('格式不正确'))
        }else {
          callback()
        }
      }

    }
    return {
      title: "ACTIVE HEALTHCHECK",
      info: "为此upstream group中的服务器启用定期活动运行状况检查。",
      formRules: {
        healthcheck_url: [
          {validator: urlRule}
        ],
        healthcheck_host: [
          { required: true, message: '不能为空'}
        ]
      }
    };
  },
  computed: {},
  methods: {
    /* 开关变化时 */
    closeConfig(data){

      if (!data){
        this.resetConfig(emptyConfig.ngcUpstreamGroups[0])
      } else{
        this.form.active_healthcheck_state = data
      }
    },
  },

  mounted() {}
};
</script>
<style lang="less" scoped>
@import "../modal-form";
</style>
