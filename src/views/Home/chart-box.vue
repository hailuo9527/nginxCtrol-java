<template>
  <div class="overview-box">
    <div>
      <h3 class="overview-box__title">APP</h3>
      <div class="overview-box__l">
        <h4 class="overview-box__value-title">Past 1H</h4>
        <span class="overview-box__l__content">
                <span class="overview-box__l__val">{{
                  requestCountCurrent
                }}</span>
                <span class="overview-box__l__delta">{{ requestRatio }}%</span>
                <span class="overview-box__l__unit"></span>
              </span>
      </div>
      <div class="overview-box__r">
        <h4 class="overview-box__value-title">Previous</h4>
        <span class="overview-box__r__val">{{ requestCountPast }}</span>
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
</template>
<script>
  import VeLine from "v-charts/lib/line.common";
  import "v-charts/lib/style.css";
  export default {
    data() {
      this.colors = ["#05316d", "#888888"];
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
      };
      return{

      }
    },
    components: {
      VeLine
    },
    props: {
      data: {}
    },
    mounted() {
      console.log(this.data)
    }
  }
</script>
<style lang="less" scoped>
  @import "Home";
</style>
