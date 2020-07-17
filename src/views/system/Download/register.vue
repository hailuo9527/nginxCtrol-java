<template>
  <div class="contain">
    <!-- <div class="btn-back-home">
      <Button icon="md-arrow-back" type="info" @click="backToHome()"
        >返回首页</Button
      >
    </div> -->
    <div class="con" v-bind:style="{ height: height + 'px' }">
      <div :class="isregister === 1 ? 'isregister-no' : 'isregister-yes'">
        <Card :bordered="false" dis-hover>
          <div class="login-wrap">
            <div class="tab tab1">
              <div class="title">
                <span>填入信息方可下载</span>
                <span
                  style="float: right; color: #2d8cf0; cursor: pointer"
                  @click="Return()"
                  >返回</span
                >
              </div>
              <Form
                ref="formValidate"
                :model="formValidate"
                :rules="ruleValidate"
                class="form"
                inline
                v-if="isregister === 1"
              >
                <FormItem label="" prop="company_name">
                  公司
                  <Input
                    v-model="formValidate.company_name"
                    placeholder="公司名称"
                  ></Input>
                </FormItem>
                <FormItem label="" prop="company_address">
                  公司地址
                  <Input
                    v-model="formValidate.company_address"
                    placeholder="公司地址"
                  ></Input>
                </FormItem>
                <FormItem label="" prop="user_email">
                  邮箱
                  <Input
                    v-model="formValidate.user_email"
                    placeholder="邮箱"
                  ></Input>
                </FormItem>
                <FormItem label="" prop="user_phone">
                  手机号：
                  <Input
                    v-model="formValidate.user_phone"
                    placeholder="手机号"
                  ></Input>
                </FormItem>
                <FormItem label="" prop="user_name">
                  联系人
                  <div style="width: 218px">
                    <Input
                      v-model="formValidate.user_name"
                      placeholder="联系人"
                    ></Input>
                  </div>
                </FormItem>
                <FormItem>
                  <div class="submit-btn">
                    <Button
                      type="primary"
                      long
                      style="width: 80px"
                      :loading="submitLoading"
                      @click="handleSubmit('formValidate')"
                      >提交
                    </Button>
                  </div>
                </FormItem>
              </Form>
              <Form
                ref="formValidate"
                :model="formValidate"
                :rules="ruleValidate"
                class="form"
                v-else
              >
                <FormItem label="" prop="user_phone">
                  手机号：
                  <Input
                    v-model="formValidate.user_phone"
                    placeholder="手机号"
                  ></Input>
                </FormItem>
                <FormItem>
                  <Button
                    type="primary"
                    long
                    :loading="submitLoading"
                    @click="handleSubmit('formValidate')"
                    >提交
                  </Button>
                </FormItem>
              </Form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import { addInstallUserInfo, getInstallInfoByUser } from "@/api/download";
export default {
  name: "register",
  props: {
    isregister: Number,
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else if (!/^1[34578]\d{9}$/.test(value)) {
        callback("手机号格式不正确");
      } else {
        callback();
      }
    };
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("邮箱地址不能为空"));
      } else if (
        !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
      ) {
        callback("邮箱地址格式不正确");
      } else {
        callback();
      }
    };
    const validateCommon = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("值不能为空"));
      } else if (!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(value)) {
        //匹配中文,字母,数字,下划线
        callback("格式不正确");
      } else {
        callback();
      }
    };
    return {
      formValidate: {
        user_name: "",
        user_phone: "",
        company_name: "",
        company_address: "",
        user_name: "",
        user_phone: "",
        user_email: "",
      },
      ruleValidate: {
        user_name: [
          { required: true, message: "联系人不能为空", trigger: "blur" },
        ],
        user_phone: [{ required: true, validator: validatePhone }],
        user_email: [{ required: true, validator: validateEmail }],
        company_name: [{ required: true, validator: validateCommon }],
        company_address: [{ required: true, validator: validateCommon }],
      },
      height: window.innerHeight,
      submitLoading: false,
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          if (this.isregister === 1) {
              console.log(111)
            this.addInstallUserInfo();
          } else {
            this.getInstallInfoByUser();
          }
        } else {
          this.$Message.error("请检查输入信息是否正确!");
        }
      });
    },
    Return() {
      this.$emit("Return");
    },
    backToHome() {
      this.$router.replace({ name: "home" });
    },
    //添加下载的用户信息
    async addInstallUserInfo() {
      let json = {
        company_name: this.formValidate.company_name,
        company_address: this.formValidate.company_address,
        user_name: this.formValidate.user_name,
        user_phone: this.formValidate.user_phone,
        user_email: this.formValidate.user_email,
      };
      let res = await addInstallUserInfo(json);
      this.submitLoading = false;
      if (res.data.code === "success") {
        this.$Modal.confirm({
          title: "提示",
          content: "<p>是否下载文件</p>",
          onOk() {
            window.location.href = `${res.data.result}`;
          },
        });
      } else {
        this.$Message.error({
          content: res.data.result,
          duration: 3,
        });
      }
    },
    //已有用户获取下载文件
    async getInstallInfoByUser() {
      let res = await getInstallInfoByUser({
        user_phone: this.formValidate.user_phone,
      });
      this.submitLoading = false;
      if (res.data.code === "success") {
        this.$Modal.confirm({
          title: "提示",
          content: "<p>是否下载文件</p>",
          onOk() {
            window.location.href =
              window.location.origin + `${res.data.result}`;
          },
        });
      } else {
        this.$Message.error({
          content: res.data.result,
          duration: 3,
        });
      }
    },
  },
};
</script>

<style lang="less">
.contain {
  background: #f2f2f2;
  height: 100%;
}
.btn-back-home {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
}
.con {
  position: relative;
}
.con > div {
  margin-top: 40px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.login-wrap {
  padding: 20px;
}
.title {
  margin-bottom: 20px;
}
span {
  font-size: 16px;
}
.submit-btn {
  position: absolute;
  top: 72px;
  left: 204px;
}
.isregister-yes {
  width: 400px;
}
.isregister-no {
  width: 580px;
}
</style>
