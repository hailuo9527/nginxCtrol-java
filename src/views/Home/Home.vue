<template>
  <div class="content" style="margin-top: 0px;">
    <div class="overview-container overview-container_css-grid">
      <div class="overview-container__header">
        <h1 class="overview-container__h1">Overview</h1>
      </div>
      <div class="overview-container__content">
        <div class="overview-score-box overview-score-box_semi-healthy">
          <div :class="active ? 'transition-before' : 'transition-after'">
            <h2 class="overview-score-box__score">{{ instancePercent }}%</h2>
            <div class="overview-score-box__title">实例情状态</div>
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
        <div class="overview-box">
          <div :class="active ? 'transition-before' : 'transition-after'">
            <h3 class="overview-box__title">预警</h3>
            <div class="overview-box__l">
              <h4 class="overview-box__value-title">CPU预警线</h4>
              <span class="overview-box__l__content">
                <span class="overview-box__l__val">{{ cpuWarningCount }}</span>
                <!-- <span class="overview-box__l__delta">+1 %</span>
                <span class="overview-box__l__unit"></span> -->
              </span>
            </div>
            <div class="overview-box__r">
              <h4 class="overview-box__value-title">磁盘预警线</h4>
              <span class="overview-box__r__val">{{ diskWarningCount }}</span>
            </div>
            <!-- <canvas id="canvas" class="overview-box__chart" width="320" height="100"></canvas> -->
          </div>
        </div>
        <chart-box data=""></chart-box>

       <!-- <div class="overview-box" v-for="(item, index) in appOverViews">
          <div :class="active ? 'transition-before' : 'transition-after'">
            <h3 class="overview-box__title">{{ item.appName }}</h3>
            <div class="overview-box__l">
              <h4 class="overview-box__value-title">Past 1H</h4>
              <span class="overview-box__l__content">
                <span class="overview-box__l__val">{{
                  item.requestCountCurrent
                }}</span>
                <span class="overview-box__l__delta"
                  >{{ item.requestRatio }}%</span
                >
                <span class="overview-box__l__unit"></span>
              </span>
            </div>
            <div class="overview-box__r">
              <h4 class="overview-box__value-title">Previous</h4>
              <span class="overview-box__r__val">{{
                item.requestCountPast
              }}</span>
            </div>
            <div class="x-chart">
              <ve-line
                width="320px"
                height="100px"
                :data="chartDatas[index]"
                :extend="chartExtend"
                :settings="chartSettings"
                :colors="colors"
              ></ve-line>
            </div>
          </div>
        </div>-->
        <div class="overview-box">
          <div class="add-button" @click="DisplayModel()">
            <!-- <Icon type="ios-add-circle-outline" size="140" /> -->+
          </div>
        </div>
        <!-- 添加app的Modal -->
        <Modal v-model="AddModel" :mask-closable="false">
          <p slot="header" style="color:#333;text-align:center">
            <span>添加</span>
          </p>
          <Select v-model="SelectModel" style="width:100%">
            <Option
              v-for="item in asideList"
              :value="item.app_service_id"
              :key="item.app_service_id"
              >{{ item.app_service_name }}</Option
            >
          </Select>
          <div slot="footer">
            <Button type="primary" :long="true" @click="handleSubmit()"
              >确认添加</Button
            >
          </div>
        </Modal>

      </div>
      <div class="footer">
        <div class="footer__inner">Copyright © 2018-2020 WingsBro</div>
      </div>
    </div>
  </div>
</template>

<script>
import { selOverViewInfo, addOverViewInfo } from "@/api/home";

import ChartBox from './chart-box'
import { mapState, mapActions } from "vuex";
export default {
  components: { ChartBox },
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
      chartSettings: {
        metrics: ["requestCountCurrent", "requestCountPast"],
        dimension: ["ctime"],
        labelMap: {
          requestCountCurrent: "当前请求数",
          requestCountPast: "1小时前请求数",
        },
      },
      requestRatio: "",
      AddModel: false,
      SelectModel: "",
      appOverViews: [],
      app_requestCountCurrent: "",
      app_requestCountPast: "",
      chartData: []
    };
  },
  methods: {
    //查询首页信息
    async GetHomeInfo() {
      let res = await selOverViewInfo();
      console.log(res);
      if (res.data.code === "success") {
        const data = res.data.result;
        this.chartData = data
        this.cpuWarningCount = data.cpuWarningCount;
        this.diskWarningCount = data.diskWarningCount;
        this.instanceOff = data.instanceOff;
        this.instanceOn = data.instanceOn;
        this.instancePercent = data.instancePercent * 100;
        this.appOverViews = data.appOverViews;
      }
    },
    DisplayModel() {
      this.AddModel = true;
    },
    async handleSubmit() {
      let res = await addOverViewInfo({
        user_id: this.userInfo.id,
        app_id: this.SelectModel,
      });
      if (res.data.code === "success") {
        this.$Message.info(`${res.data.result}`);
        this.AddModel = false;
        this.GetHomeInfo();
      } else {
        this.$Message.error(`${res.data.result}`);
      }
    },
  },
  computed: {
    ...mapState({
      asideList: (state) => state.app.asideList,
      userInfo: (state) => state.login.userInfo,
    }),
  },
  mounted() {
    this.GetHomeInfo();
  },
};
</script>

<style lang="less" scoped>
@import "Home";
.x-chart {
  width: 320px;
  height: 100px;
  position: absolute;
  bottom: 0;
  left: 0;
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
.add-button:hover {
  //box-shadow: 10px 0px 10px rgba(0, 0, 0, 0.9);
}
</style>
