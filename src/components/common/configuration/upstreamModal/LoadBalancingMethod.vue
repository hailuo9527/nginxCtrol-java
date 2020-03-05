<template>
  <my-form-item
    title="LOAD BALANCING METHOD"
    @closeConfig="closeConfig('domain')"
    @saveConfig="saveConfig('domain')"
    info="This is the load balancing method to use against the specified upstream group."
  >
    <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
       <Form ref="form" :model="form" :rules="formRules" @submit.native.prevent>
      <FormItem label class="line-form-item">
        <Select>
          <Option value="1">weighted round-robin</Option>
          <Option value="2">hash</Option>
          <Option value="3">ip_hash</Option>
          <Option value="4">least_conn</Option>
          <Option value="5">least_time</Option>
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
      <Select>
        <Option value="dataready">weighted round-robin</Option>
        <Option value="httpready">hash</Option>
        <Option value="httpready">ip_hash</Option>
        <Option value="httpready">least_conn</Option>
        <Option value="httpready">least_time</Option>
      </Select>
    </div>
  </my-form-item>
</template>

<script>
import mixin from "../mixins";

export default {
  mixins: [mixin],
  name: "LoadBalancingMethod",
  data() {
    return {
      title: "",
      info: "",
      formRules: {}
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
