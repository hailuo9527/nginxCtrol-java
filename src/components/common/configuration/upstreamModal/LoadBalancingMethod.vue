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
       <Form ref="form" :model="form" :rules="formRules" @submit.native.prevent>
          <FormItem label class="line-form-item" prop="load_balancing_method">
            <Select v-model="form.load_balancing_method">
              <Option value="weighted round-robin">weighted round-robin</Option>
              <Option value="hash">hash</Option>
              <Option value="ip_hash">ip_hash</Option>
              <Option value="least_conn">least_conn</Option>
              <Option value="least_time">least_time</Option>
            </Select>
          </FormItem>
       </Form>
      <div
        class="ctrl-edit-item__note"
      >Requests are distributed between the servers using a weighted round-robin balancing method</div>
      <!-- <div class="ctrl-edit-item__note">The client-server mapping is based on the hashed key value</div>
                        <div class="ctrl-edit-item__note">Requests are distributed between servers based on client IP addresses</div>
                        <div class="ctrl-edit-item__note">A request is passed to the server with the least number of active connections</div>
      <div class="ctrl-edit-item__note">A request is passed to the server with the least average response time and least number of active connections</div>-->
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
