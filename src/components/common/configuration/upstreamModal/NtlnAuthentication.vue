<template>
  <my-form-item
          :title="title"
          @closeConfig = "closeConfig"
          @saveConfig = "saveConfig"
          @cancel = "cancel"
          @edit="edit"
          :modify="modify"
          :disabled="disabled"
          :open = "form.ntlm_authentication_state"
          :only-show="true"
          :valid="valid"
          :info="info"
  >
    <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit"></div>

    <div slot="show" class="ctrl-edit-item"></div>
  </my-form-item>
</template>

<script>
import mixin from "../mixins";
import emptyConfig from '../emptyConfig'
export default {
  mixins: [mixin],
  name: "NtlnAuthentication",
  data() {
    return {
      title: "NTLM AUTHENTICATION",
      info: "Use specific technique to proxy NTLM authentication requests to upstream servers.",
      formRules: {}
    };
  },
  computed: {},
  methods: {

    /* 开关变化时 */
    closeConfig(data){
      this.form.ntlm_authentication_state = data
      this.$emit('readyOk',this.form)

    },
  },

  mounted() {}
};
</script>
<style lang="less" scoped>
@import "../modal-form";
</style>
