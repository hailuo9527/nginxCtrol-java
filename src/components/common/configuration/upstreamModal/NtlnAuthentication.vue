<template>
  <my-form-item
    title="NTLM AUTHENTICATION"
    @closeConfig="closeConfig('domain')"
    @saveConfig="saveConfig('domain')"
    info="Use specific technique to proxy NTLM authentication requests to upstream servers."
  >
    <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit"></div>

    <div slot="show" class="ctrl-edit-item"></div>
  </my-form-item>
</template>

<script>
import mixin from "../mixins";

export default {
  mixins: [mixin],
  name: "NtlnAuthentication",
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
