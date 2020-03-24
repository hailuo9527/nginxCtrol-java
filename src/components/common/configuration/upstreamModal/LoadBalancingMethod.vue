<template>
  <my-form-item
          :title="title"
          @closeConfig = "closeConfig"
          @saveConfig = "saveConfig"
          @cancel = "cancel"
          @edit="edit"
          :modify="modify"
          :open = "true"
          :important="true"
          :valid="valid"
          :info="info"
  >
    <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
       <Form ref="form" :model="form" :rules="formRules" :hide-required-mark="true" @submit.native.prevent>
          <FormItem label class="line-form-item" prop="load_balancing_method">
            <Select v-model="form.load_balancing_method">
              <Option value="weighted round-robin">weighted round-robin</Option>
              <Option value="hash">hash</Option>
              <Option value="ip_hash">ip_hash</Option>
              <Option value="least_conn">least_conn</Option>
              <Option value="least_time">least_time</Option>
            </Select>
          </FormItem>
         <div v-if="form.load_balancing_method === 'hash'">
           <FormItem label="HASH KEY" class="line-form-item full-input" prop="hash_key">
             <Input placeholder="text|variable" v-model.trim="form.hash_key"></Input>
           </FormItem>
           <FormItem label="KETAMA CONSISTENT" class="aline-center">
             <i-switch size="small" v-model="form.ketama_consisten_state"></i-switch>
           </FormItem>
         </div>
         <div v-if="form.load_balancing_method === 'least_time'">
           <FormItem label="TIME TO RECEIVE" class="line-form-item full-input" >
             <Select v-model="form.time_to_receive">
               <Option value="response header">response header</Option>
               <Option value="full response">full response</Option>

             </Select>
           </FormItem>
           <FormItem label="SERVE INCOMPLETE REQUESTS" class="aline-center">
             <i-switch size="small" v-model="form.serve_incomplete_requests_state"></i-switch>
           </FormItem>
         </div>
       </Form>
      <div class="ctrl-edit-item__note" v-if="form.load_balancing_method==='weighted round-robin'">使用加权循环平衡方法在服务器之间分发请求</div>
      <div class="ctrl-edit-item__note" v-if="form.load_balancing_method==='hash'">客户机-服务器映射基于散列键值</div>
      <div class="ctrl-edit-item__note" v-if="form.load_balancing_method==='ip_hash'">请求基于客户端IP地址在服务器之间分布</div>
      <div class="ctrl-edit-item__note" v-if="form.load_balancing_method==='least_conn'">将请求传递给活动连接数最少的服务器</div>
      <div class="ctrl-edit-item__note" v-if="form.load_balancing_method==='least_time'">以最少的平均响应时间和最少的活动连接数将请求传递到服务器</div>
    </div>

    <div slot="show" class="ctrl-edit-item">
      <Select v-model="form.load_balancing_method">
        <Option value="weighted round-robin">weighted round-robin</Option>
        <Option value="hash">hash</Option>
        <Option value="ip_hash">ip_hash</Option>
        <Option value="least_conn">least_conn</Option>
        <Option value="least_time">least_time</Option>
      </Select>
    </div>
  </my-form-item>
</template>

<script>
import mixin from "../mixins";

export default {
  mixins: [mixin],
  data() {
    return {
      title: "LOAD BALANCING METHOD",
      info: "这是针对指定upstream group使用的负载平衡方法。",
      formRules: {
        load_balancing_method: [
          { required: true, message: '请选择一项', trigger: 'change' }
        ],
        hash_key: [
          { required: true, message: '不能为空'}
        ]
      }
    };
  },
  computed: {},
  methods: {},

  mounted() {}
};
</script>
<style lang="less" scoped>
@import "../modal-form";
</style>
