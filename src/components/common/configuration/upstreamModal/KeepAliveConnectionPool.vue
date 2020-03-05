<template>
  <my-form-item
    title="KEEPALIVE CONNECTION POOL"
    @closeConfig="closeConfig('domain')"
    @saveConfig="saveConfig('domain')"
    info="The keepalive connection pool can be used to reduce the latency of communications to the upstream servers."
  >
    <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
       <Form ref="form" :model="form" :rules="formRules" @submit.native.prevent>
      <FormItem label class="line-form-item">
        <Input placeholder="number"></Input>
      </FormItem>
      </Form>
    </div>

    <div slot="show" class="ctrl-edit-item">
      <div class="ctrl-edit-item__string">number</div>
    </div>
  </my-form-item>
</template>

<script>
import mixin from "../mixins";

export default {
  mixins: [mixin],
  name: "KeepAliveConnectionPool",
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
