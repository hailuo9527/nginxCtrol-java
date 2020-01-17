<template>
  <div class="content_wrap">
    <Aside />
    <div class="content_right">
      <div class="content_right_scroll">
        <div class="content_header">
          <div class="header_title">
            <span>
              {{activeAside.l4_name}}
              <Icon class="icon" @click="openDrawer = true" type="md-settings" />
            </span>
            <Drawer title="Basic Drawer" placement="left" :closable="false" v-model="openDrawer">
              <p>{{test}}</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </Drawer>
          </div>
          <div class="header_tab">
            <div class="tab">
              <!--<router-link :to="`/L4/${$route.params.id}/nginx`" class="tab_item">nginx</router-link>-->
              <!-- <router-link :to="`/L4/${$route.params.id}`" class="tab_item">系统</router-link>-->
              <router-link to="/L7/123/test" class="tab_item">L7-test</router-link>
              <router-link to="/L7/123/config" class="tab_item">Load Balancing</router-link>
              <router-link to="/L7/123/analysis" class="tab_item">Analys</router-link>
              <div class="timezone-select">
                UTC+08 •
                <div class="clock">9:00</div>
                <div class="timezone-select__dropdown-tick">
                  <Dropdown trigger="click">
                      <Icon type="ios-arrow-down"></Icon>
                    <DropdownMenu slot="list">
                      <DropdownItem>hello world</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </div>
            <apply-filter v-if="$route.name === 'L7-chart'" />
          </div>
        </div>
        <router-view class="content_main"></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import Aside from "@/components/aside/L4-aside.vue";
import applyFilter from "@/components/common/filter.vue";
import { deviceManage } from "../../api/L4";
import { mapState, mapMutations } from "vuex";
export default {
  name: "L4",
  data() {
    return {
      openDrawer: false,
      test: ""
    };
  },
  components: {
    Aside,
    applyFilter
  },
  methods: {
    ...mapMutations(["setActiveAside"])
  },
  watch: {
    openDrawer(val, oldVal) {
      if (val) {
      }
    }
  },
  computed: {
    ...mapState({
      asideList: state => state.L4.asideList,
      activeAside: state => state.L4.activeAside
    })
  },

  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    this.setActiveAside(this.asideList[0]);
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
}
</style>
