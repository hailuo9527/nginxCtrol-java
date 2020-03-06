<template>
  <my-form-item
          :title="title"
          @closeConfig = "closeConfig"
          @saveConfig = "saveConfig"
          @cancel = "cancel"
          @edit="edit"
          :modify="modify"
          :disabled="disabled"
          :open = "form.keepalive_connection_pool_state"
          :valid="valid"
          :info="info"
  >
    <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
       <Form ref="form" :model="form" :rules="formRules" :hide-required-mark="true" @submit.native.prevent>
      <FormItem label class="line-form-item" prop="keepalive_connection_pool_value">
        <Input placeholder="number" v-model.trim="form.keepalive_connection_pool_value"></Input>
      </FormItem>
      </Form>
    </div>

    <div slot="show" class="ctrl-edit-item">
      <div class="ctrl-edit-item__string">{{form.keepalive_connection_pool_value}}</div>
    </div>
  </my-form-item>
</template>

<script>
import mixin from "../mixins";
import emptyConfig from '../emptyConfig'
export default {
  mixins: [mixin],
  name: "KeepAliveConnectionPool",
  data() {
    const number = { type: 'number', message: '请输入数字', trigger: 'blur',
      transform(value) {
        return Number(value);
      }
    }
    return {
      title: "KEEPALIVE CONNECTION POOL",
      info: "The keepalive connection pool can be used to reduce the latency of communications to the upstream servers.",
      formRules: {
        keepalive_connection_pool_value: [
          { required: true, message: '不能为空'},
                number
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
        this.form.keepalive_connection_pool_state = data
      }
    },
  },

  mounted() {}
};
</script>
<style lang="less" scoped>
@import "../modal-form";
</style>
