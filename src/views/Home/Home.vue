<template>
  <div>
    <div class="content" style="margin-top: 0px;">
      <div class="overview-container overview-container_css-grid">
        <div class="overview-container__header">
          <h1 class="overview-container__h1">Overview</h1>
        </div>
        <div class="overview-container__content">
          <div
            class="overview-score-box "
            :class="{
              'overview-score-box_semi-healthy': ishealthy,
              'overview-score-box_sub_healthy': issubhealthy,
              'overview-score-box_unhealthy': unhealthy,
            }"
          >
            <div :class="active ? 'transition-before' : 'transition-after'">
              <h2 class="overview-score-box__score">{{ instancePercent }}%</h2>
              <div class="overview-score-box__title">实例状态</div>
              <table class="overview-score-box__stats">
                <tr>
                  <td>在线实例</td>
                  <td>{{ instanceOn }}</td>
                </tr>
                <tr>
                  <td>离线实例</td>
                  <td>{{ instanceOff }}</td>
                </tr>
                <tr>
                  <td>在线实例占比</td>
                  <td>{{ instancePercent }}%</td>
                </tr>
              </table>
            </div>
          </div>
          <div
            class="overview-box_prewarn"
            :class="{
              'overview-box_healthy': prewarn_healthy,
              'overview-box_sub_healthy': prewarn_subhealthy,
              'overview-box_unhealthy': prewarn_unhealthy,
            }"
          >
            <div :class="active ? 'transition-before' : 'transition-after'">
              <h3
                class="overview-box__title_prewarn"
                :class="{
                  common_color_black: is_black,
                  common_color_white: is_white,
                }"
              >
                预警
              </h3>
              <div class="overview-box__l">
                <h4
                  class="overview-box__value-title_prewarn"
                  :class="{
                    common_color_black: is_black,
                    common_color_white: is_white,
                  }"
                >
                  CPU预警数量
                </h4>
                <span class="overview-box__l__content">
                  <span
                    class="overview-box__l__value"
                    :class="{
                      common_color_black: is_black,
                      common_color_white: is_white,
                    }"
                    >{{ cpuWarningCount }}</span
                  >
                  <!-- <span class="overview-box__l__delta">+1 %</span>
                <span class="overview-box__l__unit"></span> -->
                </span>
              </div>
              <div class="overview-box__r">
                <h4
                  class="overview-box__value-title_prewarn"
                  :class="{
                    common_color_black: is_black,
                    common_color_white: is_white,
                  }"
                >
                  磁盘预警数量
                </h4>
                <span
                  class="overview-box__r__value"
                  :class="{
                    common_color_black: is_black,
                    common_color_white: is_white,
                  }"
                  >{{ diskWarningCount }}</span
                >
              </div>
            </div>
            <div
              class="overview-box-l-bottom-line"
              :class="{
                'overview-box-r-bottom-line_healthy': bottom_line_healthy,
                'overview-box-r-bottom-line_sub_healthy': bottom_line_subhealthy,
                'overview-box-r-bottom-line_unhealthy': bottom_line_unhealthy,
              }"
            ></div>
            <div
              class="overview-box-r-bottom-line"
              :class="{
                'overview-box-r-bottom-line_healthy': bottom_line_healthy,
                'overview-box-r-bottom-line_sub_healthy': bottom_line_subhealthy,
                'overview-box-r-bottom-line_unhealthy': bottom_line_unhealthy,
              }"
            ></div>
            <div class="prewarn-footer-l">
                <!-- <div class="prewarn-footer-l-in"> -->
              <span
                v-if="cpuWarning.length == 0"
                :class="{
                  common_color_black: is_black,
                  common_color_white: is_white,
                }"
                >暂无CPU预警</span
              >
              <span v-else v-for="item in cpuWarning">
                <span
                  class="l-text-position high-light"
                  v-if="item.value <= 20"
                  >{{ item.name }}</span
                >
                <span class="l-text-position common_color_white" v-else>{{
                  item.name
                }}</span>
              </span>
                <!-- </div> -->
            </div>
            <div class="prewarn-footer-r">
              <span
                v-if="diskWarning.length == 0"
                :class="{
                  common_color_black: is_black,
                  common_color_white: is_white,
                }"
                >暂无磁盘预警</span
              >
              <span v-else v-for="item in diskWarning">
                <span
                  class="r-text-position high-light"
                  v-if="item.value >= 90"
                  >{{ item.name }}</span
                >
                <span class="r-text-position common_color_white" v-else>{{
                  item.name
                }}</span>
              </span>
            </div>
          </div>
          <chart-box
            :data="item"
            :index="index"
            v-if="chartData.length"
            :key="index"
            v-for="(item, index) in chartData"
            @remove="RemoveApp"
          ></chart-box>
          <div class="overview-box">
            <div class="add-button" @click="DisplayModel()">+</div>
          </div>
          <!-- 添加app的Modal -->
          <Modal v-model="AddModel" width="400" :mask-closable="false">
            <p slot="header" style="color:#333;text-align:center">
              <span>添加APP</span>
            </p>
            <div style="padding: 20px 0">
              <div style="color: #aaa; margin-bottom: 20px">
                请选择想要添加到首页的APP
              </div>
              <Select
                v-model="SelectModel"
                style="width:100%"
                @on-select="select"
              >
                <Option
                  v-for="item in unusedApp"
                  :value="item.app_service_id"
                  :key="item.app_service_id"
                  >{{ item.app_service_name }}</Option
                >
              </Select>
            </div>

            <div slot="footer">
              <Button type="primary" :long="true" @click="handleSubmit()"
                >确认添加</Button
              >
            </div>
          </Modal>
        </div>
        <div class="home-spin">
          <Loading color="#01c864" v-if="refresh_loading" />
        </div>
        <div class="footer">
          <div class="footer__inner">Copyright © 2018-2020 WingsBro</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { selOverViewInfo, addOverViewInfo, delOverViewInfo } from "@/api/home";

import ChartBox from "./chart-box";
import { mapState, mapActions } from "vuex";
import Loading from "@/components/common/loading.vue";
export default {
  components: { ChartBox, Loading },
  data() {
    return {
      active: "",
      cpuWarningCount: "",
      diskWarningCount: "",
      instanceOff: "",
      instanceOn: "",
      instancePercent: "",
      requestCountCurrent: "",
      requestCountPast: "",

      requestRatio: "",
      AddModel: false,
      SelectModel: "",
      appOverViews: [],
      app_requestCountCurrent: "",
      app_requestCountPast: "",
      chartData: [],
      ishealthy: false,
      issubhealthy: false,
      unhealthy: false,
      home_loading: true,
      refresh_loading: false,
      diskWarning: [],
      cpuWarning: [],
      prewarn_healthy: false,
      prewarn_subhealthy: false,
      prewarn_unhealthy: false,
      is_black: false,
      is_white: false,
      bottom_line_healthy: false,
      bottom_line_subhealthy: false,
      bottom_line_unhealthy: false,
      status: false,
      state: false,
      app_service_name: "",
      app_service_id: "",
      unusedApp: [],
    };
  },
  methods: {
    ...mapActions(["getAppAsideList"]),
    //查询首页信息
    async GetHomeInfo() {
      // this.chartData = [];
      this.refresh_loading = true;
      let res = await selOverViewInfo();
      //   console.log(res);
      if (res.data.code === "success") {
        // this.home_loading = false;
        this.refresh_loading = false;
        const data = res.data.result;
        if (res.data.result == null) {
          this.prewarn_healthy = true;
          this.prewarn_subhealthy = false;
          this.prewarn_unhealthy = false;
          this.is_black = true;
          this.is_white = false;
          this.bottom_line_healthy = true;
          this.bottom_line_subhealthy = false;
          this.bottom_line_unhealthy = false;
        } else {
          let appData = {
            requestCountCurrent: data.requestCountCurrent,
            requestCountPast: data.requestCountPast,
            requestCurrent: data.requestCurrent,
            requestPast: data.requestPast,
            requestRatio: data.requestRatio,
          };
          let arr = [];
          let obj = {};
          arr.push(appData, ...data.appOverViews);
          arr.map((item, index) => {
            item.requestPast.map((i) => {
              i.ctime = i.ctime.substring(i.ctime.length - 4);
            });
            item.requestCurrent.map((i, index) => {
              i = Object.assign(i, item.requestPast[index]);
              i.ctime = i.ctime.substring(i.ctime.length - 4);
            });
          });

          // console.log(arr);
          this.chartData = arr;

          this.cpuWarningCount = data.cpuWarningCount;
          this.diskWarningCount = data.diskWarningCount;
          this.instanceOff = data.instanceOff;
          this.instanceOn = data.instanceOn;
          this.cpuWarning = data.cpuWarning;
          this.diskWarning = data.diskWarning;
          this.instancePercent = data.instancePercent * 100;
          if (data.instancePercent == 1) {
            this.ishealthy = true;
            this.issubhealthy = false;
            this.unhealthy = false;
          } else if (data.instancePercent < 1 && data.instancePercent >= 0.4) {
            this.ishealthy = false;
            this.issubhealthy = true;
            this.unhealthy = false;
          } else {
            this.ishealthy = false;
            this.issubhealthy = false;
            this.unhealthy = true;
          }
          let cpu_value = data.cpuWarning.map(function(i) {
            return i.value
          });
          let disk_value = data.diskWarning.map(function(i) {
            return i.value
          });
          if (data.cpuWarningCount != []) {
            this.status = false;
            for (let i = 0; i < cpu_value.length; i++) {
              if (cpu_value[i] <= 20) {
                this.prewarn_healthy = false;
                this.prewarn_subhealthy = false;
                this.prewarn_unhealthy = true;
                this.is_black = false;
                this.is_white = true;
                this.bottom_line_healthy = false;
                this.bottom_line_subhealthy = false;
                this.bottom_line_unhealthy = true;
                this.status = true;
                break;
              }
            }
            if (!this.status) {
              for (let i = 0; i < cpu_value.length; i++) {
                if (cpu_value[i] > 20) {
                  this.prewarn_healthy = false;
                  this.prewarn_subhealthy = true;
                  this.prewarn_unhealthy = false;
                  this.is_black = false;
                  this.is_white = true;
                  this.bottom_line_healthy = false;
                  this.bottom_line_subhealthy = true;
                  this.bottom_line_unhealthy = false;
                  this.status = true;
                  break;
                }
              }
            }
          } 
        //   else {
        //     this.prewarn_healthy = true;
        //     this.prewarn_subhealthy = false;
        //     this.prewarn_unhealthy = false;
        //     this.is_black = true;
        //     this.is_white = false;
        //     this.bottom_line_healthy = true;
        //     this.bottom_line_subhealthy = false;
        //     this.bottom_line_unhealthy = false;
        //   }
          if (!this.status) {
            if (data.diskWarningCount != []) {
              this.state = false;
              for (let i = 0; i < disk_value.length; i++) {
                if (disk_value[i] >= 90) {
                  this.prewarn_healthy = false;
                  this.prewarn_subhealthy = false;
                  this.prewarn_unhealthy = true;
                  this.is_black = false;
                  this.is_white = true;
                  this.bottom_line_healthy = false;
                  this.bottom_line_subhealthy = false;
                  this.bottom_line_unhealthy = true;
                  this.state = true;
                  break;
                }
              }
              if (!this.state) {
                for (let i = 0; i < disk_value.length; i++) {
                  if (disk_value[i] < 90) {
                    this.prewarn_healthy = false;
                    this.prewarn_subhealthy = true;
                    this.prewarn_unhealthy = false;
                    this.is_black = false;
                    this.is_white = true;
                    this.bottom_line_healthy = false;
                    this.bottom_line_subhealthy = true;
                    this.bottom_line_unhealthy = false;
                  }
                }
              }
            } else {
              this.prewarn_healthy = true;
              this.prewarn_subhealthy = false;
              this.prewarn_unhealthy = false;
              this.is_black = true;
              this.is_white = false;
              this.bottom_line_healthy = true;
              this.bottom_line_subhealthy = false;
              this.bottom_line_unhealthy = false;
            }
          }
        }
        this.appOverViews = data.appOverViews;
      }
    },
    DisplayModel() {
      this.AddModel = true;
      this.getAppAsideList().then((res) => {
        if (this.asyncOk(res)) {
          let allApp = res.data.result;
          let usedApp = this.chartData;
          this.unusedApp = allApp.filter((item) => {
            let idList = usedApp.map((i) => i.appId);
            return !idList.includes(item.app_service_id);
          });
          this.SelectModel = "";
          //console.log(this.unusedApp)
        }
      });
    },
    async handleSubmit() {
      //console.log(this.userInfo)
      if (this.SelectModel !== "") {
        let res = await addOverViewInfo({
          app_name: this.app_service_name,
          app_id: this.app_service_id,
        });
        if (res.data.code === "success") {
          this.$Message.info(`${res.data.result}`);
          this.AddModel = false;
          this.refresh_loading = true;
          this.GetHomeInfo();
        } else {
          this.$Message.error(`${res.data.result}`);
        }
      }
    },
    async RemoveApp(appId) {
      this.$Modal.confirm({
        title: "警告",
        content: "确定删除此APP？",
        loading: true,
        onOk: async () => {
          let res = await delOverViewInfo({
            app_id: appId,
          });
          //   console.log(res);
          if (res.data.code === "success") {
            this.$Modal.remove();
            this.$Message.info(`删除成功`);
            this.refresh_loading = true;
            this.GetHomeInfo();
          } else {
            this.$Modal.remove();
            this.$Message.error(`${res.data.result}`);
          }
        },
      });
    },
    select(data) {
      //   console.log(data);
      this.app_service_name = data.label;
      this.app_service_id = data.value;
    },
  },
  computed: {
    ...mapState({
      asideList: (state) => state.app.asideList,
      userInfo: (state) => state.login.userInfo,
    }),
  },
  mounted() {
    // console.log(this.userInfo)
    this.GetHomeInfo();
    // 每分钟刷新页面
    if (this.timer) {
      clearInterval(this.timer);
    } else {
      this.timer = setInterval(() => {
        this.GetHomeInfo();
      }, 60 * 1000);
    }
  },
  beforeDestroy() {
    clearInterval(this.timer); //在beforeDestroy周期清除定时器
  },
};
</script>

<style lang="less" scoped>
@import "Home";
.home-spin {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.add-button {
  width: 140px;
  height: 140px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  border-radius: 50%;
  border: 1px solid #fff;
  font-size: 140px;
  text-align: center;
  line-height: 140px;
}
</style>
