<template>
  <my-form-item
    :title="title"
    @closeConfig="closeConfig('domain')"
    @saveConfig="saveConfig('domain')"
    :info="info"
  >
    <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
       <Form ref="form" :model="form" :rules="formRules" :hide-required-mark="true" @submit.native.prevent>
          <FormItem label="METHOD" class="line-form-item full-input">
            <Select v-model="form.method">
              <Option value="cookie">cookie</Option>
              <Option value="route">route</Option>
              <Option value="learn">learn</Option>
            </Select>
          </FormItem>
         <div v-if="form.method === 'cookie'">
           <FormItem label="COOKIE" class="line-form-item full-input" prop="cookie">
             <Input placeholder="name" v-model.trim="form.cookie"></Input>
           </FormItem>
           <FormItem label="EXPIRES" class="line-form-item full-input" prop="cookie_expires">
             <Input placeholder="time" v-model.trim="form.cookie_expires"></Input>
           </FormItem>
           <FormItem label="DOMAIN" class="line-form-item full-input">
             <Input placeholder="domain" v-model.trim="form.cookie_domain"></Input>
           </FormItem>
           <FormItem label="HTTPONLY" class="aline-center">
             <i-switch size="small" v-model="form.cookie_httponly_state"></i-switch>
           </FormItem>
           <FormItem label="SECURE" class="aline-center">
             <i-switch size="small" v-model="form.cookie_secure_state"></i-switch>
           </FormItem>
           <FormItem label="PATH" class="line-form-item full-input">
             <Input placeholder="path" v-model.trim="form.cookie_path"></Input>
           </FormItem>
         </div>
         <div v-if="form.method === 'route'">
           <FormItem label="VARIABLES" class="line-form-item full-input" props="route_variables">
             <Input placeholder="$variable" v-model.trim="form.route_variables"></Input>
           </FormItem>
         </div>
         <div v-if="form.method === 'learn'">
           <FormItem label="CREATE" class="line-form-item full-input" prop="leam_create">
             <Input placeholder="$variable" v-model.trim="form.leam_create"></Input>
           </FormItem>
           <FormItem label="LOOKUP" class="line-form-item full-input" prop="leam_lookup">
             <Input placeholder="$variable" v-model.trim="form.leam_lookup"></Input>
           </FormItem>
           <FormItem label="SHARED MEMORY ZONE" class="line-form-item full-input" prop="leam_shared_memory_zone">
             <Input placeholder="name:size" v-model.trim="form.leam_shared_memory_zone"></Input>
           </FormItem>
           <FormItem label="SESSION REMOVE TIMEOUT" class="line-form-item full-input">
             <Input placeholder="time" v-model.trim="form.leam_session_remove_timeout"></Input>
           </FormItem>
           <FormItem label="CREATE SESSION RIGHT AFTER RECEIVING RESPONSE HEADERS" class="line-form-item full-input">
             <i-switch size="small" v-model="form.leam_chrarrh"></i-switch>
           </FormItem>
         </div>

      </Form>
    </div>

    <div slot="show" class="ctrl-edit-item"></div>
  </my-form-item>
</template>

<script>
import mixin from "../mixins";

export default {
  mixins: [mixin],
  name: "SessionPersistence",
  data() {
    const variables = (rules, value,callback) => {
      if (!value) {
        callback(new Error('不能为空'))
      } else {
        if (value.slice(0,1) !== '$'){
          callback(new Error('请输入正确的变量'))
        }else {
          callback()
        }
      }

    }
    return {
      title: "SESSION PERSISTENCE",
      info: "Enables session affinity, which causes requests from the same client to be passed to the same server in a group of servers",
      formRules: {
        cookie: [
          { required: true, message: '不能为空' },

        ],
        cookie_expires: [
          {
            type: 'number', message: '请输入正确的时间', trigger: 'blur',
            transform(value) {
              return Number(value);
            }
          }
        ],
        route_variables: [
          {
            validator: variables
          }
        ],
        leam_create: [
          {
            validator: variables
          }
        ],
        leam_lookup: [
          {
            validator: variables
          }
        ],
        leam_shared_memory_zone: [
          { required: true, message: '不能为空'}
        ]

      }
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
