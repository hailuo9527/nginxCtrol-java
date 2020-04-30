<template>
  <div class="overview-box">
    <div>
      <h3 class="overview-box__title">
        APP
        <Icon
          class="remove-icon"
          @click="remove"
          type="md-close"
          size="20"
          color="#333"
        />
      </h3>
      <div class="overview-box__l">
        <h4 class="overview-box__value-title">Past 1H</h4>
        <span class="overview-box__l__content">
          <span class="overview-box__l__val">{{
            numerify(data.requestCountCurrent, "0 a")
          }}</span>
          <span class="overview-box__l__delta">{{ data.requestRatio }}%</span>
          <span class="overview-box__l__unit"></span>
        </span>
      </div>
      <div class="overview-box__r">
        <h4 class="overview-box__value-title">Previous</h4>
        <span class="overview-box__r__val">{{
          numerify(data.requestCountPast, "0 a")
        }}</span>
      </div>
      <div class="x-chart">
        <ve-line
          :before-config="beforeConfig"
          width="320px"
          height="100px"
          :data="chartData"
          :extend="chartExtend"
          :colors="colors"
        ></ve-line>
      </div>
    </div>
  </div>
</template>
<script>
import VeLine from "v-charts/lib/line.common";
import "v-charts/lib/style.css";
import numerify from "numerify";
export default {
  data() {
    this.numerify = numerify;
    this.chartExtend = {
      legend: {
        show: false,
        left: 30,
        bottom: 10,
        icon: "circle",
      },
      grid: {
        top: 0,
        left: -30,
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
        position: "bottom",
      },
      yAxis: {
        show: false,
      },
      tooltip: {
        show: false,
      },
    };

    return {
      colors: ["#05316d", "#888888"],
      chartData: {
        rows: [],
      },
    };
  },
  components: {
    VeLine,
  },
  props: {
    data: {},
    index: 0,
  },
  methods: {
    beforeConfig(data) {
      console.log(data);
    },
    remove() {
      this.$emit("remove", this.data.appId);
    },
  },
  mounted() {
    //console.log(this.data.requestCurrent)
    this.chartData = {
      columns: ["ctime", "http_request_count"],
      rows: [...this.data.requestCurrent, ...this.data.requestPast],
    };
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
  z-index: 999;
}
</style>
