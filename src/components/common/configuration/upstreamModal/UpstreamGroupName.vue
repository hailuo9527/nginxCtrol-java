<template>
  <my-form-item
          :title="title"
          @closeConfig = "closeConfig"
          @saveConfig = "saveConfig"
          @cancel = "cancel"
          @edit="edit"
          :modify="modify"
          :disabled="disabled"
          :open = "true"
          :important="true"
          :valid="valid"
          :info="info"
  >
    <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
      <Form ref="form" :model="form" :rules="formRules" @submit.native.prevent>
        <FormItem class="line-form-item" prop="group_name">
          <Input v-model.trim="form.group_name" placeholder="name"></Input>
        </FormItem>
      </Form>
    </div>

    <div slot="show" class="ctrl-edit-item">
      <div class="ctrl-edit-item__string">{{form.group_name}}</div>
    </div>
  </my-form-item>
</template>

<script>
import mixin from "../mixins";

export default {
  mixins: [mixin],
  data() {
    const validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("不能为空"));
      } else {
        callback();
      }
    };
    return {
      title: "UPSTREAM GROUP NAME",
      info: "Define the name for a group of servers to use with the proxy_pass.",
      formRules: {
        group_name: [
          { validator: validateName, trigger: 'blur'}
        ]
      }
    };
  },
  computed: {},
  methods: {},

  mounted() {

  }
};
</script>
<style lang="less" scoped>
@import "../modal-form";
</style>
