<template>
  <div class="content" style="margin-top: 0px;">
    <div class="overview-container overview-container_css-grid">
      <div class="overview-container__header">
        <!-- <div class="timewindow-chooser">
          <ul class="timewindow-chooser__list">
            <li
              :class="number === index ? 'timewindow-chooser__list-item_selected timewindow-chooser__list-item' : 'timewindow-chooser__list-item' "
              v-for="(item, index) in items"
              @click="change(index)"
            >{{item}}</li>
          </ul>
        </div> -->
        <h1 class="overview-container__h1">Overview</h1>
      </div>
      <div class="overview-container__content">
        <div class="overview-score-box overview-score-box_semi-healthy">
          <div :class="active ? 'transition-before' : 'transition-after'">
            <!-- <h3 class="overview-box__title">实例</h3> -->
            <!-- <Icon type="md-settings" class="overview-score-box__settings" @click="config=true" /> -->
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
        <div class="overview-box">
          <div :class="active ? 'transition-before' : 'transition-after'">
            <h3 class="overview-box__title">APP</h3>
            <div class="overview-box__l">
              <h4 class="overview-box__value-title">Past 1H</h4>
              <span class="overview-box__l__content">
                <span class="overview-box__l__val">{{ requestCountPast }}</span>
                <span class="overview-box__l__unit"></span>
              </span>
            </div>
            <div class="overview-box__r">
              <h4 class="overview-box__value-title">Previous</h4>
              <span class="overview-box__r__val">{{
                requestCountCurrent
              }}</span>
            </div>
            <div class="x-chart">
              <ve-line
                width="320px"
                height="100px"
                :data="chartData"
                :extend="chartExtend"
                :settings="chartSettings"
                :colors="colors"
              ></ve-line>
            </div>
          </div>
        </div>
        <!--
        <div class="overview-box">
          <div :class="active ? 'transition-before' : 'transition-after' ">
            <h3 class="overview-box__title">Request time (P95)</h3>
            <div class="overview-box__l">
              <h4 class="overview-box__value-title">Past {{items[number]}}</h4>
              <span class="overview-box__l__content">
                <span class="overview-box__l__val">0.000</span>
                <span class="overview-box__l__unit">s</span>
              </span>
            </div>
            <div class="overview-box__r">
              <h4 class="overview-box__value-title">Previous</h4>
              <span class="overview-box__r__val">0.000</span>
            </div>
            <canvas id class="overview-box__chart" width="320" height="100"></canvas>
          </div>
        </div>
        <div class="overview-box">
          <div :class="active ? 'transition-before' : 'transition-after' ">
            <h3 class="overview-box__title">Traffic</h3>
            <div class="overview-box__l">
              <h4 class="overview-box__value-title">Past {{items[number]}}</h4>
              <span class="overview-box__l__content">
                <span class="overview-box__l__val">0</span>
                <span class="overview-box__l__delta">+2 %</span>
                <span class="overview-box__l__unit">bps</span>
              </span>
            </div>
            <div class="overview-box__r">
              <h4 class="overview-box__value-title">Previous</h4>
              <span class="overview-box__r__val">0</span>
            </div>
            <canvas id="canvas2" class="overview-box__chart" width="320" height="100"></canvas>
          </div>
        </div>
        <div class="overview-box">
          <div :class="active ? 'transition-before' : 'transition-after' ">
            <h3 class="overview-box__title">Request time (P95)</h3>
            <div class="overview-box__l">
              <h4 class="overview-box__value-title">Past {{items[number]}}</h4>
              <span class="overview-box__l__content">
                <span class="overview-box__l__val">0.000</span>
                <span class="overview-box__l__unit">%</span>
              </span>
            </div>
            <div class="overview-box__r">
              <h4 class="overview-box__value-title">Previous</h4>
              <span class="overview-box__r__val">0.000</span>
            </div>
            <canvas id="canvas3" class="overview-box__chart" width="320" height="100"></canvas>
          </div>
        </div> -->
      </div>
      <div class="footer">
        <div class="footer__inner">Copyright © 2018-2020 WingsBro</div>
      </div>
    </div>
  </div>
</template>

<script>
import { selOverViewInfo } from "@/api/home";
import VeLine from "v-charts/lib/line.common";
import "v-charts/lib/style.css";
export default {
  components: { VeLine },
  data() {
    this.colors = ['#ff2800', '#888888']
    this.chartExtend = {
      legend: {
        show: false,
        left: 30,
        bottom: 10,
        icon: "circle",
      },
      grid: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      series: {
        type: "line",
        smooth: false,
        symbol: "circle",
        symbolSize: 2,
        showSymbol: false,
        lineStyle: {
          width: 1.5,
        },
        markPoint: {
          symbol: "circle",
        },
        markArea: {
          silent: true,
          itemStyle: {
            color: "#eeeeee",
          },
        },
      },
      xAxis: {
        show: false,
      },
      yAxis: {
        show: false,
      },
    };
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
      chartData: {
        rows: [
          { ctime: "1/1", requestCountCurrent: 10, requestCountPast: 13 },
          { ctime: "1/2", requestCountCurrent: 12, requestCountPast: 17 },
          { ctime: "1/3", requestCountCurrent: 14, requestCountPast: 21 },
          { ctime: "1/4", requestCountCurrent: 16, requestCountPast: 25 },
          { ctime: "1/5", requestCountCurrent: 18, requestCountPast: 29 },
          { ctime: "1/6", requestCountCurrent: 20, requestCountPast: 33 },
        ],
      },
    };
  },
  methods: {
    //查询首页信息
    async GetHomeInfo() {
      let res = await selOverViewInfo();
      //   console.log(res);
      if (res.data.code === "success") {
        const data = res.data.result;
        this.cpuWarningCount = data.cpuWarningCount;
        this.diskWarningCount = data.diskWarningCount;
        this.instanceOff = data.instanceOff;
        this.instanceOn = data.instanceOn;
        this.instancePercent = data.instancePercent * 100;
        if (data.requestCountCurrent / 1000 < 1000) {
          this.requestCountCurrent =
            parseInt(data.requestCountCurrent / 1000) + "K";
        } else if (data.requestCountCurrent / 1000000 < 1000000) {
          this.requestCountCurrent =
            parseInt(data.requestCountCurrent / 1000000) + "M";
        } else if (data.requestCountCurrent / 1000000000 < 1000000000) {
          this.requestCountCurrent =
            parseInt(data.requestCountCurrent / 1000000000) + "B";
        }
        if (data.requestCountPast / 1000 < 1000) {
          this.requestCountPast = parseInt(data.requestCountPast / 1000) + "K";
        } else if (data.requestCountPast / 1000000 < 1000000) {
          this.requestCountPast =
            parseInt(data.requestCountPast / 1000000) + "M";
        } else if (data.requestCountPast / 1000000000 < 1000000000) {
          this.requestCountPast =
            parseInt(data.requestCountPast / 1000000000) + "B";
        }
      }
    },
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
</style>
