<template>
  <my-form-item
    title="UPSTREAM SERVERS"
    @closeConfig="closeConfig()"
    @saveConfig="saveConfig()"
    :important="false"
    info="Specify the backend servers in the upstream group. A server is identified by an IP address or FQDN. An optional port may be specified, and the default port is 80."
  >
    <div slot="edit">
      <draggable
        v-model="dragList"
        handle=".drag-handle"
        @start="drag = true"
        ghost-class="drag-item-ghost"
        @end="drag = false"
      >
        <transition-group>
          <div v-for="element in dragList" :key="element.id">
            <div class="ctrl-edit-item ctrl-edit-item_edit mulity upstream">
              <span class="drag-handle" v-if="dragList.length>1"></span>
              <div class="item-body">
                <Form ref="form" :model="form" :rules="formRules" @submit.native.prevent>
                  <FormItem label class="line-form-item" prop="ServersName">
                    <Input  placeholder="address | name"></Input>
                  </FormItem>
                  <FormItem label="WEIGHT" class="inline-form-item">
                    <Input placeholder="number"></Input>
                  </FormItem>
                  <FormItem label="MAX ACTIVE CONNECTIONS" class="inline-form-item">
                    <Input placeholder="number"></Input>
                  </FormItem>
                  <FormItem label="MAX FAILED CONNECTIONS" class="inline-form-item">
                    <Input placeholder="number"></Input>
                  </FormItem>
                  <FormItem label="FAIL TIMEOUT" class="inline-form-item">
                    <Input placeholder="time"></Input>
                  </FormItem>
                  <FormItem label="BACKUP SERVER" class="aline-center">
                    <i-switch size="small"></i-switch>
                  </FormItem>
                  <FormItem label="RESOLVE" class="aline-center">
                    <i-switch size="small"></i-switch>
                    <PopTip
                      style="margin-left: 10px;margin-top: 2px;"
                      :size="18"
                      content="To make this work you should setup the shared memory zone inside the upstream group.Also, the resolver directive must be specified in the http block."
                      placement="right"
                    ></PopTip>
                  </FormItem>
                  <FormItem label="ROUTE NAME" class="inline-form-item">
                    <Input placeholder="name"></Input>
                  </FormItem>
                  <FormItem label="WEIGHT RECOVERING TIME" class="inline-form-item">
                    <Input placeholder="time"></Input>
                  </FormItem>
                  <FormItem label="SERVER BOUND REQUESTS ONLY" class="aline-center">
                    <i-switch size="small"></i-switch>
                  </FormItem>
                  <FormItem label="MARK AS DOWN" class="aline-center">
                    <i-switch size="small"></i-switch>
                  </FormItem>
                </Form>
              </div>
              <div class="item-body-remove">
                <Icon type="ios-trash" class="remove-icon" size="20" />
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>

      <div class="add-listen">
        <Icon class="icon" size="22" type="ios-add-circle-outline" />
        <span class="tip">Add server</span>
      </div>
    </div>

    <div slot="show">
      <div class="ctrl-edit-item"></div>
    </div>
  </my-form-item>
</template>

<script>
import mixin from "../mixins";
import draggable from "vuedraggable";
import PopTip from "@/components/common/pop-tip";

export default {
  mixins: [mixin],
  name: "UpstreamServers",
  components: {draggable,PopTip},
  data() {
    return {
      title: "",
      info: "",
      formRules: {},
      dragList: [{ name: "John", text: "", id: 0 }],
      drag: false
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
