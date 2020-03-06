<template>
  <my-form-item
          :title="title"
          @closeConfig = "closeConfig"
          @saveConfig = "saveConfig"
          @cancel = "cancel"
          @edit="edit"
          :modify="modify"
          :disabled="disabled"
          :open = "form.queueing_state"
          :valid="valid"
          :info="info"
  >
    <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
       <Form ref="form" :model="form" :rules="formRules" @submit.native.prevent>
      <div style="display: flex; justify-content: space-between">
        <FormItem label class="inline-form-item" prop="queueing_number">
          <Input placeholder="name" v-model.trim="form.queueing_number"></Input>
        </FormItem>
        <FormItem label class="inline-form-item">
          <Input placeholder="size" v-model.trim="form.queueing_time"></Input>
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
import emptyConfig from '../emptyConfig'
export default {
  mixins: [mixin],
  name: "Queueing",
  data() {
    const number = { type: 'number', message: '请输入数字', trigger: 'blur',
      transform(value) {
        return Number(value);
      }
    }
    const time = { type: 'number', message: '请输入正确的时间', trigger: 'blur',
      transform(value) {
        return Number(value);
      }
    }
    return {
      title: "QUEUEING",
      info: "If an upstream server cannot be selected immediately while processing a request, the request will be placed into the queue.",
      formRules: {
        queueing_number: [
          { required: true, message: '不能为空'},
          number
        ],
        queueing_time: [ time ]
      }
    };
  },
  computed: {},
  methods: {
    /* 开关变化时 */
    closeConfig(data){
      if (!data){
        this.resetConfig(emptyConfig.ngcUpstreamGroups[0])
      } else{
        this.form.queueing_state = data
      }
    },
  },

  mounted() {}
};
</script>
<style lang="less" scoped>
@import "../modal-form";
</style>
