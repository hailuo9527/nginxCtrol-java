<template>
  <my-form-item
          :title="title"
          @closeConfig = "closeConfig"
          @saveConfig = "saveConfig"
          @cancel = "cancel"
          @edit="edit"
          :modify="modify"
          :disabled="disabled"
          :open = "form.upstream_zone_state"
          :valid="valid"
          :info="info"
  >
    <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
       <Form ref="form" :model="form" :rules="formRules" @submit.native.prevent>
      <div style="display: flex; justify-content: space-between">
        <FormItem label class="inline-form-item" prop="upstream_zone_name">
          <Input placeholder="name" v-model.trim="form.upstream_zone_name"></Input>
        </FormItem>
        <FormItem label class="inline-form-item" prop="upstream_zone_size">
          <Input placeholder="size" v-model.trim="form.upstream_zone_size"></Input>
        </FormItem>
      </div>
        </Form>
    </div>

    <div slot="show" class="ctrl-edit-item">
      <span class="ctrl-edit-item__string">{{form.upstream_zone_name}}</span>
      <span class="ctrl-edit-item__string">{{form.upstream_zone_size}}</span>
    </div>
  </my-form-item>
</template>

<script>
import mixin from "../mixins";
import emptyConfig from '../emptyConfig'
export default {
  mixins: [mixin],
  name: "UpstreamZone",
  data() {
      const number = { type: 'number', message: '请输入数字', trigger: 'blur',
      transform(value) {
        return Number(value);
      }
     }
     const upstreamZoneName = (rule, value, callback) => {
        const reg = /^[^ ]+$/
        if (value === '') {
            callback(new Error('不能为空'))
        }else if (!reg.test(value)){
            callback(new Error('不能含有空格'))
        } else {
            callback()
        }
     };
    return {
      title: "zone",
      info: "这是要与upstream group一起使用的共享内存区域。Upstream zone保留组的配置、运行时状态和性能度量/计数器。",
      formRules: {
        upstream_zone_name: [
          { required: true, validator: upstreamZoneName }
        ],
        upstream_zone_size: [
            number
        ]
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
        this.form.upstream_zone_state = data
      }
    },
  },

  mounted() {}
};
</script>
<style lang="less" scoped>
@import "../modal-form";
</style>
