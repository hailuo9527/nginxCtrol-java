<template>
  <div class="x-chart">
    <ve-sankey
      height="100%"
      width="100%"
      :data="chartData"
      :settings="chartSettings"
      :loading="loading"
      :data-empty="dataEmpty"
      :extend="chartExtend"
      :events="chartEvents"
      ref="echart"
    ></ve-sankey>
  </div>
</template>
<script>
import veSankey from "v-charts/lib/sankey.common";
import { appViewData } from "../../../api/app";
import "v-charts/lib/style.css";
import { copyJson } from "../../../libs/vue-expand";
export default {
  name: "overView",
  components: {
    veSankey,
  },
  data() {
    this.chartSettings = {
      links: [],
    };
    this.chartExtend = {
      series: {
        type: "sankey",
        focusNodeAdjacency: false,
        label: {
          backgroundColor: {
            // 这里可以是图片的 URL，
            // 或者图片的 dataURI，
            // 或者 HTMLImageElement 对象，
            // 或者 HTMLCanvasElement 对象。
          },
        },
        lineStyle: {
          curveness: 0.3,
        },
        nodeAlign: "left",
      },
    };
    /** chart表的点击事件 */
    let self = this;
    this.chartEvents = {
      mouseover: (e) => {
        this.name = e.name;
        if (e.dataType === "edge") {
          let option = this.$refs["echart"].echarts.getOption();
          this.option = this.copyJson(option);
          //let oldOption = copyJson(option)
          // console.log(e);
          // console.log(option);
          let link = option.series[0].links;
          if (e.data.source === option.series[0].data[0].name) {
            for (let i = 0; i < this.chartSettings.links.length; i++) {
              if (
                e.data.target === this.chartSettings.links[i].source ||
                e.data.target === link[i].target
              ) {
                link[i].lineStyle = {
                  opacity: 0.2,
                };
              } else {
                link[i].lineStyle = {
                  opacity: 0.02,
                };
              }
            }
          } else {
            for (let i = 0; i < this.chartSettings.links.length; i++) {
              if (
                e.data.source === link[i].target ||
                e.data.source === link[i].source
              ) {
                link[i].lineStyle = {
                  opacity: 0.2,
                };
              } else {
                link[i].lineStyle = {
                  opacity: 0.02,
                };
              }
            }
          }
          this.$refs["echart"].echarts.setOption(option);
        }
      },
      mouseout: (e) => {
        let option = this.$refs["echart"].echarts.getOption();
        // console.log(option)
        let link = option.series[0].links;
        link.forEach(function(i) {
          i.lineStyle = { opacity: 0.2 };
        });
        this.$refs["echart"].echarts.setOption(option);
      },
    };
    return {
      chartData: {
        columns: ["页面", "访问量"],
        rows: [],
      },
      loading: false,
      dataEmpty: false,
      name: "",
      option: {},
    };
  },
  watch: {
    // 监听路由参数app的变化
    "$route.params.app": {
      handler: function(val, oldVal) {
        this.getChartData();
      },
      deep: true,
    },
  },
  methods: {
    async getChartData() {
      this.loading = true;
      this.chartData.rows = [];
      this.chartSettings.links = [];
      let res = await appViewData({ app_service_id: this.$route.params.app });
      if (res.data.code === "success") {
        // console.log(res.data.result);
        if (res.data.result.requests_total === "0") {
          this.dataEmpty = true;
        } else {
          this.dataEmpty = false;
          // 第一列的柱子
          this.$set(this.chartData.rows, this.chartData.rows.length, {
            页面: res.data.result.applicationInfo.app_service_name,
            访问量: res.data.result.requests_total,
          });
          res.data.result.appdata.forEach(function(e, i) {
            if (e.stub_requests !== "0") {
              //第二列的柱子
              this.$set(this.chartData.rows, this.chartData.rows.length, {
                页面: e.l7ServerName + "(" + e.ctime + ")",
                访问量: e.stub_requests,
              });
              //第一列柱子和第二列柱子之间的连接
              this.$set(
                this.chartSettings.links,
                this.chartSettings.links.length,
                {
                  source: res.data.result.applicationInfo.app_service_name,
                  target: e.l7ServerName + "(" + e.ctime + ")",
                }
              );
            }
          }, this);
          for (
            let i = 0;
            i < res.data.result.upstream_request_total.length;
            i++
          ) {
            if (
              res.data.result.upstream_request_total[i].upstream_request !== 0
            ) {
              //第三列柱子
              this.$set(this.chartData.rows, this.chartData.rows.length, {
                页面: res.data.result.upstream_request_total[i].upstream_server,
                访问量:
                  res.data.result.upstream_request_total[i].upstream_request,
              });
              for (let y = 0; y < res.data.result.appdata.length; y++) {
                for (
                  let x = 0;
                  x < res.data.result.appdata[y].nginx_app_list.length;
                  x++
                ) {
                  //第二列柱子和第三列柱子之间的连接
                  if (
                    res.data.result.upstream_request_total[i].upstream_server ==
                      res.data.result.appdata[y].nginx_app_list[x]
                        .upstream_server &&
                    res.data.result.appdata[y].nginx_app_list[x]
                      .upstream_request != "0"
                  ) {
                    this.$set(
                      this.chartSettings.links,
                      this.chartSettings.links.length,
                      {
                        source:
                          res.data.result.appdata[y].l7ServerName +
                          "(" +
                          res.data.result.appdata[y].ctime +
                          ")",
                        target:
                          res.data.result.upstream_request_total[i]
                            .upstream_server,
                        value:
                          res.data.result.appdata[y].nginx_app_list[x]
                            .upstream_request,
                      }
                    );
                  }
                }
              }
            }
          }
        }
        this.loading = false;
      } else {
        this.loading = false;
        this.dataEmpty = true;
      }
    },
  },
  mounted() {
    this.getChartData();

    // 每分钟刷新页面
    if (this.timer) {
      clearInterval(this.timer);
    } else {
      this.timer = setInterval(() => {
        this.getChartData();
      }, 60000);
    }
  },
  destroyed() {
    clearInterval(this.timer); //在destroyed周期清除定时器
  },
};
</script>
<style lang="less" scoped>
.x-chart {
  display: flex;
  justify-content: space-between;
  padding: 107px 30px 30px 30px !important;
}
/deep/ .v-charts-data-empty {
  background-color: #f8f8f8;
}
</style>
