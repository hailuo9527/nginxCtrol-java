<template>
  <my-form-item
    title="UPSTREAM ZONE"
    @closeConfig="closeConfig('domain')"
    @saveConfig="saveConfig('domain')"
    info="This is a shared memory zone to use with the upstream group. Upstream zone keeps the group's configuration, the run-time state, and the performance metrics/counters."
  >
    <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
       <Form ref="form" :model="form" :rules="formRules" @submit.native.prevent>
      <div style="display: flex; justify-content: space-between">
        <FormItem label class="inline-form-item">
          <Input placeholder="name"></Input>
        </FormItem>
        <FormItem label class="inline-form-item">
          <Input placeholder="size"></Input>
        </FormItem>
      </div>
        </Form>
    </div>

    <div slot="show" class="ctrl-edit-item">
      <span class="ctrl-edit-item__string">number</span>
      <span class="ctrl-edit-item__string">time</span>
    </div>
  </my-form-item>
</template>

<script>
import mixin from "../mixins";

export default {
  mixins: [mixin],
  name: "UpstreamZone",
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
