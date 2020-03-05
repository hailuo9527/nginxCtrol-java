<template>
  <my-form-item
    title="ACTIVE HEALTHCHECK"
    @closeConfig="closeConfig('domain')"
    @saveConfig="saveConfig('domain')"
    info="Enable periodic active health checks for the servers in this upstream group."
  >
    <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
       <Form ref="form" :model="form" :rules="formRules" @submit.native.prevent>
      <FormItem label="HEALTHCHECK URI" class="line-form-item full-input">
        <Input placeholder="URI"></Input>
      </FormItem>
      <FormItem label="HOST" class="line-form-item full-input">
        <Input placeholder="example.com"></Input>
      </FormItem>
      </Form>
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
</template>

<script>
import mixin from "../mixins";

export default {
  mixins: [mixin],
  name: "ActiveHealthCheck",
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
