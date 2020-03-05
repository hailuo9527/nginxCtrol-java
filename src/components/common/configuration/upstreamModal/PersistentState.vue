<template>
  <my-form-item
    title="PERSISTENT STATE"
    @closeConfig="closeConfig('domain')"
    @saveConfig="saveConfig('domain')"
    info="Specifies a file that keeps the state of the upstream group."
  >
    <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
       <Form ref="form" :model="form" :rules="formRules" @submit.native.prevent>
      <FormItem label class="line-form-item">
        <Input placeholder="file"></Input>
      </FormItem>
      </Form>
    </div>

    <div slot="show" class="ctrl-edit-item">
      <div class="ctrl-edit-item__string">file</div>
    </div>
  </my-form-item>
</template>

<script>
import mixin from "../mixins";

export default {
  mixins: [mixin],
  name: "PersistentState",
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
