<template>
  <div class="content_wrap">
    <Aside />
    <div class="content_right" v-if="!isEmptyObject(asideList)">
      <div class="content_right_scroll">
        <div class="content_header">
          <div class="header_title">
            <span>
              {{activeAside.l7ServerName}}
              <Icon class="icon" @click="openDrawer = true" type="md-settings" />
              <Drawer title="实例详细信息"
                      width="420"
                      placement="left" class="left-drawer" :closable="false" v-model="openDrawer">
                            <div class="content">
                              <div class="row-item">
                                    <div class="status">
                                        <span>实例名称</span>: {{appInfo.l7ServerName || '无'}}
                                    </div>
                                </div>
                                <div class="row-item">
                                    <div class="status">
                                        <span>实例是否可用</span>: {{appInfo.usable_status ? '可用' : '不可用'}}
                                    </div>
                                </div>
                                <div class="row-item">
                                    <div class="status">
                                        <span>操作系统版本</span>: {{appInfo.system_name || '无'}}
                                    </div>
                                </div>
                                <div class="row-item">
                                    <div class="status">
                                        <span>NGINX是否启用</span>: {{appInfo.run_status ? '已启用' : '未启用'}}
                                    </div>
                                </div>
                                <div class="row-item">
                                    <div class="status">
                                        <span>NGINX版本号</span>: {{appInfo.nginxVersion || '无'}}
                                    </div>
                                </div>
                                <div class="row-item">
                                    <div class="status">
                                        <span>IP地址</span>: {{appInfo.l7ServerSSHIp || '无'}}
                                    </div>
                                </div>
                                <div class="row-item">
                                    <div class="status">

                                        <span>端口号</span>: {{appInfo.l7ServerSSHPort || '无'}}
                                    </div>
                                </div>

                              <div class="row-item">
                                    <div class="status">

                                        <span>处理器</span>: {{appInfo.cpu_MHz+ 'MHZ' || '无'}}
                                    </div>
                                </div>
                              <div class="row-item">
                                    <div class="status">
                                        <span>处理器核心</span>: {{appInfo.cpu_count+ '核' || '无'}}
                                    </div>
                                </div>
                              <div class="row-item">
                                    <div class="status">
                                        <span>内存</span>: {{ formatFileSize(appInfo.mem_total)  || '无'}}
                                    </div>
                                </div>
                              <div class="row-item">
                                    <div class="status">
                                        <span>磁盘</span>: {{formatFileSize(appInfo.disk_total) || '无'}}
                                    </div>
                                </div>



                            </div>


                        </Drawer>
            </span>

          </div>
          <div class="header_tab">
            <div class="tab">
              <!--<router-link :to="`/L4/${$route.params.id}/nginx`" class="tab_item">nginx</router-link>-->
              <!-- <router-link :to="`/L4/${$route.params.id}`" class="tab_item">系统</router-link>-->
              <router-link :to="`/L7/${$route.params.L7}/nginx`" class="tab_item">{{activeAside.nginxVersion || 'NGINX version'}}</router-link>
              <router-link :to="`/L7/${$route.params.L7}/chart`" class="tab_item">系统</router-link>

              <router-link :to="`/L7/${$route.params.L7}/config`" class="tab_item">配置</router-link>
              <!--<router-link :to="`/L7/${$route.params.L7}/analysis`" class="tab_item">分析</router-link>-->
              <!--<div class="timezone-select">
                UTC+08 •
                <div class="clock">9:00</div>
                <div class="timezone-select__dropdown-tick">
                  <Dropdown trigger="click">
                    <a href="javascript:void(0)">
                      <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                      <DropdownItem>hello world</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>-->
            </div>
            <apply-filter v-if="$route.name === 'L7Chart' || $route.name === 'L7Nginx'"  />
          </div>
        </div>
        <div class="contents">
            <div class="cover" v-if="!activeAside.usable_status" :class="$route.name === 'L7Chart'?'coverheight':''||$route.name === 'L7Nginx'?'cover-height':''"></div>
            <div class="word" v-if="!activeAside.usable_status" :class="$route.name === 'L7Config'?'word-display':''">
                <div class="word-icon"><Icon type="md-warning" size='50' style="color: #fbff05;"/></div>
                <span class="word-word">实例已离线</span>
            </div>
            <router-view class="content_main"></router-view>    
        </div>
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
import Aside from "@/components/aside/L7-aside.vue";
import applyFilter from "@/components/common/filter.vue";
import { selL7ServerInfo } from "../../api/L7";
import {formatFileSize} from "../../libs/vue-expand";
import { mapState, mapMutations } from "vuex";
export default {
  name: "L4",
  data() {
    return {
      openDrawer: false,
      test: "",
      appInfo: {}
    };
  },
  components: {
    Aside,
    applyFilter
  },
  methods: {
    ...mapMutations(["L7setActiveAside"]),
    /* 获取配置详细信息 */
    async selL7ServerInfo() {
      let res = await selL7ServerInfo({ l7ServerId: this.activeAside.l7ServerId })
      console.log(res)
      if (this.asyncOk(res)){
        this.appInfo = res.data.result || {}
      }
    }
  },
  watch: {
    openDrawer(val, oldVal) {
      if (val) {
        this.selL7ServerInfo()
      }
    }
  },
  computed: {
    ...mapState({
      asideList: state => state.L7.asideList,
      activeAside: state => state.L7.activeAside
    })
  },

  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    if (!this.isEmptyObject(this.asideList)){
      this.L7setActiveAside(this.asideList[Object.keys(this.asideList)[0]][0]);
    }

    next();
  }
};
</script>
<style lang="less" scoped>
@import "../L4/L4";
.content_main {
  height: calc(100%);
  padding: 98px 10px 0 10px;
  //box-sizing: border-box;
//   margin-top: 98px;
}
.left-drawer .content .row-item .status{
  padding-top: 15px;
}
.cover {
    position: absolute;
    width: 100%;
    background-color: #6b6b6b;
    opacity: 0.5;
    z-index: 10;
    margin-top: 98px;
}
.contents {
    width: 100%;
    height: calc(100%);
    position: relative;
}
.word {
    position: fixed;
    left: 50%;
    top: 50%;
    text-align: center;
    color: #fff;
    font-size: 40px;
    font-weight: bold;
    z-index: 11;
}
.word-icon {
    width: 200px;
    height: 50px;
}
.cover-height {
    height: 1944px;
}
.coverheight {
    height: 1390px;
}
.word-display {
    display: none;
}
</style>
