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
      <div class="virtual_server_form main">
        <Form ref="formDynamic" :model="form" :label-width="164">
          <FormItem
            label="worker_rlimit_nofile"
            prop="work_rlimit_nofile"
            :rules="{ validator: reg }"
          >
            <Input
              v-model.trim="form.work_rlimit_nofile"
              placeholder="请输入数值"
              :disabled="$route.params.L7?true:false"
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
              :disabled="$route.params.L7?true:false"
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
              :disabled="$route.params.L7?true:false"
            ></Input>
          </FormItem>
        </Form>
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
    data: Array
  },
  data() {
    this.reg = (rule, value, callback) => {
      let reg = /^\d*[1-9]$/;
      if (value === "") {
        callback(new Error("值不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入大于零的整数"));
      } else {
        callback();
      }
    };
    this.processesreg = (rule, value, callback) => {
      let reg = /(^\d*[1-9]$)|(^auto$)/;
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
        work_rlimit_nofile: '',
        worker_connections: '',
        worker_processes: '',
      },
    };
  },
  methods: {
    change(data) {
      this.model = data;
      this.$emit("change", { data: data, name: "mainModal" });
    },
    handleMainSubmit(name) {
        this.$refs[name].validate((valid) => {
        if (valid) {
          this.change(false)
          this.$emit('submit', this.form)
        } else {
          this.model = true;
          this.$Message.error("Fail!");
        }
      });
    }
  },
  watch: {
    show(newVal, oldVal) {
      this.model = newVal;
      this.form.work_rlimit_nofile = this.data[0]
      this.form.worker_connections = this.data[1]
      this.form.worker_processes = this.data[2]
    },
  },
};
</script>
<style lang="less" scoped>
@import "modal-form";
.main {
  padding: 20px 0 0 20px;
}
</style>
