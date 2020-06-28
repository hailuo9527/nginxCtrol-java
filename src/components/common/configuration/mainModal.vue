<template>
  <div>
    <Modal
      width="790"
      v-model="model"
      :transfer="true"
      :mask-closable="false"
      title="修改main"
      @on-visible-change="change"
    >
      <div class="virtual_server_form" :class="!status ? 'main-color' : 'main'">
        <div class="main-head" :class="status ? 'head' : ''">
          <i-switch
            v-model="$route.params.L7||$route.params.app ? (status = true) : status"
            :disabled="$route.params.L7||$route.params.app ? true : false"
            @on-change="changestatus"
          />
          <span>main</span>
          <Tooltip content="" :transfer="true" theme="light">
            <Icon
              class="handle"
              size="20"
              type="md-information-circle"
              color="#000"
            />
          </Tooltip>
        </div>
        <div class="main-form" v-if="status">
          <Form ref="formDynamic" :model="form" :label-width="164">
            <FormItem
              label="worker_rlimit_nofile"
              prop="work_rlimit_nofile"
              :rules="{ validator: reg }"
            >
              <Input
                v-model.trim="form.work_rlimit_nofile"
                placeholder="请输入数值"
                :disabled="$route.params.L7||$route.params.app ? true : false"
              ></Input>
            </FormItem>
            <FormItem
              label="worker_connections"
              prop="worker_connections"
              :rules="{ validator: reg }"
            >
              <Input
                v-model.trim="form.worker_connections"
                placeholder="请输入数值"
                :disabled="$route.params.L7||$route.params.app ? true : false"
              ></Input>
            </FormItem>
            <FormItem
              label="worker_processes"
              prop="worker_processes"
              :rules="{ validator: processesreg }"
            >
              <Input
                v-model.trim="form.worker_processes"
                placeholder="请输入数值或者auto"
                :disabled="$route.params.L7||$route.params.app ? true : false"
              ></Input>
            </FormItem>
          </Form>
        </div>
      </div>
      <div slot="footer">
        <Button @click="change(false)">取消</Button>
        <Button type="primary" @click="handleMainSubmit('formDynamic')"
          >确定</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    show: false,
    modify: false,
    data: Array,
  },
  data() {
    this.reg = (rule, value, callback) => {
      let reg = /^\+?[1-9][0-9]*$/;
      if (value === "") {
        callback(new Error("值不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入大于零的整数"));
      } else {
        callback();
      }
    };
    this.processesreg = (rule, value, callback) => {
      let reg = /(^\+?[1-9][0-9]*$)|(^auto$)/;
      if (value === "") {
        callback(new Error("值不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入大于零的整数或者auto"));
      } else {
        callback();
      }
    };
    return {
      model: false,
      form: {
        work_rlimit_nofile: "",
        worker_connections: "",
        worker_processes: "",
      },
      status: false,
    };
  },
  methods: {
    change(data) {
      this.model = data;
      this.status = false
      this.$emit("change", { data: data, name: "mainModal" });
    },
    handleMainSubmit(name) {
      if (this.status) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.change(false);
            this.status = false
            this.$emit("submit", this.form);
          } else {
            this.model = true;
            this.$Message.error("Fail!");
          }
        });
      } else {
        this.change(false);
      }
    },
    changestatus(data) {
        this.status = data
    }
  },
  watch: {
    show(newVal, oldVal) {
      this.model = newVal;
      this.form.work_rlimit_nofile = this.data[0];
      this.form.worker_connections = this.data[1];
      this.form.worker_processes = this.data[2];
    },
  },
};
</script>
<style lang="less" scoped>
@import "modal-form";
.main {
  background-color: #fff;
  position: relative;
  padding: 15px 0 0 0;
}
.main-head {
  span {
    margin: 0 10px;
    font-size: 12px;
    letter-spacing: 1.2px;
    color: #333;
    font-weight: 700;
  }
  /deep/ .ivu-tooltip-rel {
    top: 2px;
  }
  .handle {
    font-weight: bold;
    cursor: pointer;
    opacity: 0.2;
    transition: all 0.1s;
    &:hover {
      opacity: 1 !important;
    }
  }
}
.main-form {
  width: 630px;
  border-left: 2px solid #01c864;
  padding: 0 0 0 20px;
  margin: 0 auto;
}
.main-color {
  background-color: #f3f3f3;
  padding: 15px 40px;
}
.head {
  margin: 0 0 14px 40px;
}
</style>
