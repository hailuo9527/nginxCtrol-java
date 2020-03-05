<template>
  <my-form-item
    title="SESSION PERSISTENCE"
    @closeConfig="closeConfig('domain')"
    @saveConfig="saveConfig('domain')"
    info="Enables session affinity, which causes requests from the same client to be passed to the same server in a group of servers"
  >
    <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
       <Form ref="form" :model="form" :rules="formRules" @submit.native.prevent>
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
      </Form>
    </div>

    <div slot="show" class="ctrl-edit-item"></div>
  </my-form-item>
</template>

<script>
import mixin from "../mixins";

export default {
  mixins: [mixin],
  name: "SessionPersistence",
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
