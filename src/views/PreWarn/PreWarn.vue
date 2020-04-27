<template>
  <div class="content_wrap">
    <pre-warn-aside></pre-warn-aside>
    <div class="content_right" v-if="asideList.length">
      <div class="content_right_scroll">
        <div class="content_header">
          <div class="header_title">
            <span>
              {{ activeAside.l7ServerName }}
              <Icon
                class="icon"
                @click="openDrawer = true"
                type="md-settings"
              />
              <Drawer
                title="实例详细信息"
                width="420"
                placement="left"
                class="left-drawer"
                :closable="false"
                v-model="openDrawer"
              >
                <div class="content">
                  <div class="row-item">
                    <div class="status">
                      <span>实例名称</span>: {{ appInfo.l7ServerName || "无" }}
                    </div>
                  </div>
                  <div class="row-item">
                    <div class="status">
                      <span>实例是否可用</span>:
                      {{ appInfo.usable_status ? "可用" : "不可用" }}
                    </div>
                  </div>
                  <div class="row-item">
                    <div class="status">
                      <span>NGINX是否启用</span>:
                      {{ appInfo.run_status ? "已启用" : "未启用" }}
                    </div>
                  </div>
                  <div class="row-item">
                    <div class="status">
                      <span>NGINX版本号</span>:
                      {{ appInfo.nginxVersion || "无" }}
                    </div>
                  </div>
                  <div class="row-item">
                    <div class="status">
                      <span>IP地址</span>: {{ appInfo.l7ServerSSHIp || "无" }}
                    </div>
                  </div>
                  <div class="row-item">
                    <div class="status">
                      <span>端口号</span>: {{ appInfo.l7ServerSSHPort || "无" }}
                    </div>
                  </div>

                  <div class="row-item">
                    <div class="status">
                      <span>处理器</span>: {{ appInfo.cpu_MHz + "MHZ" || "无" }}
                    </div>
                  </div>
                  <div class="row-item">
                    <div class="status">
                      <span>处理器核心</span>:
                      {{ appInfo.cpu_count + "核" || "无" }}
                    </div>
                  </div>
                  <div class="row-item">
                    <div class="status">
                      <span>内存</span>:
                      {{ formatFileSize(appInfo.mem_total) || "无" }}
                    </div>
                  </div>
                  <div class="row-item">
                    <div class="status">
                      <span>磁盘</span>:
                      {{ formatFileSize(appInfo.disk_total) || "无" }}
                    </div>
                  </div>
                </div>
              </Drawer>
            </span>
          </div>
          <div class="add-button">
            <Button type="primary" icon="md-add">添加</Button>
          </div>
        </div>
        <router-view class="content_main"></router-view>
      </div>
    </div>
    <div class="content_right" v-else>
      <div class="no-data">
        暂无数据，请先去添加L7实例
      </div>
    </div>
  </div>
</template>

<script>
import PreWarnAside from "@/components/aside/pre-warn-aside.vue";
import { selL7ServerInfo } from "../../api/L7";
import { formatFileSize } from "../../libs/vue-expand";
import { mapState, mapMutations } from "vuex";
export default {
  components: { PreWarnAside },
  data() {
    return {
      openDrawer: false,
      appInfo: {},
    };
  },
  methods: {
    ...mapMutations(["L7setActiveAside"]),
    /* 获取配置详细信息 */
    async selL7ServerInfo() {
      let res = await selL7ServerInfo({
        l7ServerId: this.activeAside.l7ServerId,
      });
      console.log(res);
      if (this.asyncOk(res)) {
        this.appInfo = res.data.result || {};
      }
    },
  },
  watch: {
    openDrawer(val, oldVal) {
      if (val) {
        this.selL7ServerInfo();
      }
    },
  },
  computed: {
    ...mapState({
      asideList: (state) => state.L7.asideList,
      activeAside: (state) => state.L7.activeAside,
    }),
  },

  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    this.L7setActiveAside(this.asideList[0]);
    next();
  },
};
</script>

<style lang="less" scoped>
@import "../L4/L4";
.left-drawer .content .row-item .status {
  padding-top: 15px;
}
.add-button {
  position: absolute;
  right: 0;
  top: 16px;
}
</style>
