<template>
  <my-form-item
          :title="title"
          @closeConfig = "closeConfig"
          @saveConfig = "saveConfig"
          @cancel = "cancel"
          @edit="edit"
          :modify="modify"
          :disabled="disabled"
          :open = "form.session_persistence_state"
          :valid="valid"
          :info="info"
  >
    <div slot="edit" class="ctrl-edit-item ctrl-edit-item_edit">
       <Form ref="form" :model="form" :rules="formRules" :hide-required-mark="true" @submit.native.prevent>
          <FormItem label="METHOD" class="line-form-item full-input common-color">
            <Select v-model="form.method">
              <Option value="cookie">cookie</Option>
              <Option value="route">route</Option>
              <Option value="learn">learn</Option>
            </Select>
          </FormItem>
         <div v-if="form.method === 'cookie'">
           <FormItem label="COOKIE" class="line-form-item full-input common-color" prop="cookie">
             <Input placeholder="name" v-model.trim="form.cookie"></Input>
           </FormItem>
           <FormItem label="EXPIRES" class="line-form-item full-input common-color" prop="cookie_expires">
             <Input placeholder="time" v-model.trim="form.cookie_expires"></Input>
           </FormItem>
           <FormItem label="DOMAIN" class="line-form-item full-input common-color" prop="cookie_domain">
             <Input placeholder="domain" v-model.trim="form.cookie_domain"></Input>
           </FormItem>
           <FormItem label="HTTPONLY" class="aline-center common-color">
             <i-switch size="small" v-model="form.cookie_httponly_state"></i-switch>
           </FormItem>
           <FormItem label="SECURE" class="aline-center common-color">
             <i-switch size="small" v-model="form.cookie_secure_state"></i-switch>
           </FormItem>
           <FormItem label="PATH" class="line-form-item full-input common-color" prop="cookie_path">
             <Input placeholder="path" v-model.trim="form.cookie_path"></Input>
           </FormItem>
         </div>
         <div v-if="form.method === 'route'">
           <FormItem label="VARIABLES" class="line-form-item full-input with-button common-color"  prop="routeVariables">
             <Button  icon="md-close" class="tag"
                      :key="index"
                      v-if="item"
                      @click="removeTag(item)"
                      v-for="(item, index) in form.route_variables.split(',')">{{item}}</Button>
             <Input placeholder="$variable"  @on-blur="addRouteVariables" @on-enter="addRouteVariables" @on-keydown="keyDown" v-model.trim="form.routeVariables"></Input>
           </FormItem>
         </div>
         <div v-if="form.method === 'learn'">
           <FormItem label="CREATE" class="line-form-item full-input common-color" prop="leam_create">
             <Input placeholder="$variable" v-model.trim="form.leam_create"></Input>
           </FormItem>
           <FormItem label="LOOKUP" class="line-form-item full-input common-color" prop="leam_lookup">
             <Input placeholder="$variable" v-model.trim="form.leam_lookup"></Input>
           </FormItem>
           <FormItem label="SHARED MEMORY ZONE" class="line-form-item full-input common-color" prop="leam_shared_memory_zone">
             <Input placeholder="name:size" v-model.trim="form.leam_shared_memory_zone"></Input>
           </FormItem>
           <FormItem label="SESSION REMOVE TIMEOUT" class="line-form-item full-input common-color" prop="leam_session_remove_timeout">
             <Input placeholder="time" v-model.trim="form.leam_session_remove_timeout"></Input>
           </FormItem>
           <FormItem label="CREATE SESSION RIGHT AFTER RECEIVING RESPONSE HEADERS" class="line-form-item full-input common-color">
             <i-switch size="small" v-model="form.leam_chrarrh"></i-switch>
           </FormItem>
         </div>

      </Form>
    </div>

    <div slot="show" class="ctrl-edit-item">
      <div class="ctrl-edit-item__tags">
        <span class="tags black" v-if="form.method">{{form.method}}</span>
        <span class="ctrl-edit-item__tags" v-if="form.method === 'cookie'">
          <span class="tags" v-if="form.cookie">{{form.cookie}}</span>
          <span class="tags" v-if="form.cookie_expires">expire={{form.cookie_expires}}</span>
          <span class="tags" v-if="form.cookie_domain">domain={{form.cookie_domain}}</span>
          <span class="tags" v-if="form.cookie_httponly_state">httponly</span>
          <span class="tags" v-if="form.cookie_secure_state">secure</span>
          <span class="tags" v-if="form.cookie_path">path={{form.cookie_path}}</span>
        </span>
        <span class="ctrl-edit-item__tags" v-if="form.method === 'route'">
          <span class="tags" v-if="form.route_variables" v-for="item in form.route_variables.split(',')">{{item}}</span>
        </span>
        <span class="ctrl-edit-item__tags" v-if="form.method === 'learn'">
            <span class="tags" v-if="form.leam_create">create={{form.leam_create}}</span>
            <span class="tags" v-if="form.leam_lookup">lookup={{form.leam_lookup}}</span>
            <span class="tags" v-if="form.leam_shared_memory_zone">zone={{form.leam_shared_memory_zone}}</span>
            <span class="tags" v-if="form.leam_session_remove_timeout">timeout={{form.leam_session_remove_timeout}}</span>
            <span class="tags" v-if="form.leam_chrarrh">header</span>
        </span>
      </div>

    </div>
  </my-form-item>
</template>

<script>
import mixin from "../mixins";
import emptyConfig from '../emptyConfig'
export default {
  mixins: [mixin],
  name: "SessionPersistence",
  data() {
    const variables = (rule, value,callback) => {
        const reg = /^[^ ]+$/
      if (!value) {
        callback(new Error('不能为空'))
      } else {
        if (value.slice(0,1) !== '$' || !reg.test(value)){
          callback(new Error('请输入正确的变量'))
        }else {
          callback()
        }
      }

    }
    const routeVariablesRule = (rule, value, callback) => {

      if (!value){
        if (this.form.route_variables === ""){
          callback(new Error('不能为空'))
        }
      }else {
        value.slice(0,1) !== '$' ? callback(new Error('请输入正确的变量')):callback()
      }


      callback()
    }
    const zoneRule = (rule, value, callback) => {
        const reg = /^[^ ]+$/
      if (!value){
        callback(new Error('不能为空'))
      }else {
        let arr = value.split(':')
        if (arr.length !== 2){
          callback(new Error('格式不正确'))
        }else {
          arr.forEach((item)=> {
            if (!item || !reg.test(item)) callback(new Error('格式不正确'))
          })
          callback()
        }

      }


      callback()
    }
    const commonReg = (rule, value, callback) => {
        const reg = /^[^ ]+$/
        if (value === '') {
            callback(new Error('不能为空'))
        }else if (!reg.test(value)){
            callback(new Error('不能含有空格'))
        } else {
            callback()
        }
    };
    const time = { type: 'number', message: '请输入正确的时间', trigger: 'blur',
      transform(value) {
        return Number(value);
      }
    }
    return {
      title: "SESSION PERSISTENCE",
      info: "启用会话关联，这将导致来自同一客户端的请求传递到一组服务器中的同一服务器",
      formRules: {
        cookie: [
          { required: true, validator: commonReg },

        ],
        cookie_domain: [
            {required: true, validator: commonReg }
        ],
        cookie_path: [
            {required: true, validator: commonReg}
        ],
        cookie_expires: [
          {
            type: 'number', message: '请输入正确的时间', trigger: 'blur',
            transform(value) {
              return Number(value);
            }
          }
        ],
        routeVariables: [
          {
            validator: routeVariablesRule
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
          {
            validator: zoneRule
          }
        ],
        leam_session_remove_timeout: [
            { required: true, message: '不能为空'},time
        ]

      },

    };
  },
  computed: {},
  methods: {
    addRouteVariables () {
      if(this.form.routeVariables === "") return
      this.$refs['form'].validateField('routeVariables',(valid) => {
        if (!valid) {
          let arr = this.form.route_variables.split(',')
          arr.push(this.form.routeVariables)
          arr.map((item, key)=> {
            if (!item) arr.splice(key,1)
          })
          this.form.route_variables = arr.join(',')
          this.form.routeVariables = ''
        }
      });
    },
    removeTag(str) {
      let arr = this.form.route_variables.split(',')
      let index = arr.indexOf(str)
      arr.splice(index, 1)
      this.form.route_variables = arr.join(',')
    },
    /* 开关变化时 */
    closeConfig(data){

      if (!data){
        this.resetConfig(emptyConfig.ngcUpstreamGroups[0])
      } else{
        this.form.session_persistence_state = data
      }


    },
    keyDown(e) {
        if (e.code === 'Space') {
            this.addRouteVariables()
        }
    }
  },

  mounted() {}
};
</script>
<style lang="less" scoped>
@import "../modal-form";
</style>
