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
      <div class="ctrl-edit-item__note" v-if="form.load_balancing_method==='weighted round-robin'">Requests are distributed between the servers using a weighted round-robin balancing method</div>
      <div class="ctrl-edit-item__note" v-if="form.load_balancing_method==='hash'">The client-server mapping is based on the hashed key value</div>
      <div class="ctrl-edit-item__note" v-if="form.load_balancing_method==='ip_hash'">Requests are distributed between servers based on client IP addresses</div>
      <div class="ctrl-edit-item__note" v-if="form.load_balancing_method==='least_conn'">A request is passed to the server with the least number of active connections</div>
      <div class="ctrl-edit-item__note" v-if="form.load_balancing_method==='least_time'">A request is passed to the server with the least average response time and least number of active connections</div>
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
      info: "This is the load balancing method to use against the specified upstream group.",
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
