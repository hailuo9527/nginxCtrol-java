<template>
  <Form
    :model="formCustom"
    :rules="ruleCustom"
    :label-width="80"
  >
    <FormItem label="Username" >
      <Input ></Input>
    </FormItem>
    <FormItem label="Email" >
      <Input ></Input>
    </FormItem>
    <FormItem label="Password" prop="passwd">
      <Input type="password" v-model="formCustom.passwd"></Input>
    </FormItem>
    <FormItem label="Confirm" prop="password">
      <Input type="password" v-model="formCustom.passwdCheck"></Input>
    </FormItem>
    <FormItem label="Tags" >
      <Input ></Input>
    </FormItem>
    <FormItem label="Roles" >
      <Input ></Input>
    </FormItem>
  </Form>
</template>

<script>
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password"));
      } else {
        if (this.formCustom.passwdCheck !== "") {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField("passwdCheck");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password again"));
      } else if (value !== this.formCustom.passwd) {
        callback(new Error("The two input passwords do not match!"));
      } else {
        callback();
      }
    };
    return {
      formCustom: {
        passwd: "",
        passwdCheck: "",
      },
      ruleCustom: {
        passwd: [{ validator: validatePass, trigger: "blur" }],
        passwdCheck: [{ validator: validatePassCheck, trigger: "blur" }],
      },
    };
  },
  methods: {
  },
};
</script>
