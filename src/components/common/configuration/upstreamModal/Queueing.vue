<template>
  <my-form-item
    title="QUEUEING"
    @closeConfig="closeConfig('domain')"
    @saveConfig="saveConfig('domain')"
    info="If an upstream server cannot be selected immediately while processing a request, the request will be placed into the queue."
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
  name: "Queueing",
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
