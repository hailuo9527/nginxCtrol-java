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
    ></ve-sankey>
  </div>
</template>
<script>
import veSankey from "v-charts/lib/sankey.common";
import { appViewData } from "../../../api/app";
import "v-charts/lib/style.css";
export default {
  name: "overView",
  components: {
    veSankey
  },
  data() {
    this.chartSettings = {
      links: []
    };
    this.chartExtend = {
      series: {
        type: "sankey",
        focusNodeAdjacency: true,
        label: {
          backgroundColor: {
            // 这里可以是图片的 URL，
            // 或者图片的 dataURI，
            // 或者 HTMLImageElement 对象，
            // 或者 HTMLCanvasElement 对象。
          }
        }
      }
    };
    let self = this;
    this.chartEvents = {
      click: function(e) {
        self.name = e.name;
        console.log(e);
        let target = e.event.target.dataType;
        if (target === "node") {
          console.log(target);
        }
      }
    };
    return {
      chartData: {
        columns: ["页面", "访问量"],
        rows: []
      },
      loading: false,
      dataEmpty: false,
      name: ""
    };
  },
  watch: {
    // 监听路由参数app的变化
    "$route.params.app": {
      handler: function(val, oldVal) {
        this.chartData.rows = [];
        this.chartSettings.links = [];
        this.getChartData();
      },
      deep: true
    }
  },
  methods: {
    async getChartData() {
      this.loading = true;
      let res = await appViewData({ app_service_id: this.$route.params.app });
      if (res.data.code === "success") {
        // console.log(res.data.result);
        if (res.data.result.requests_total === "0") {
          this.dataEmpty = true;
        } else {
          this.dataEmpty = false;
          this.$set(this.chartData.rows, this.chartData.rows.length, {
            页面: res.data.result.applicationInfo.app_service_name,
            访问量: res.data.result.requests_total
          });
          res.data.result.appdata.forEach(function(e, i) {
            this.$set(this.chartData.rows, this.chartData.rows.length, {
              页面: e.l7ServerName + "(" + e.ctime + ")",
              访问量: e.stub_requests
            });
            this.$set(
              this.chartSettings.links,
              this.chartSettings.links.length,
              {
                source: res.data.result.applicationInfo.app_service_name,
                target: e.l7ServerName + "(" + e.ctime + ")"
              }
            );
          }, this);

          if (res.data.result.appdata[0].nginx_app_list !== []) {
            for (
              let i = 0;
              i < res.data.result.appdata[0].nginx_app_list.length;
              i++
            ) {
              this.$set(this.chartData.rows, this.chartData.rows.length, {
                页面:
                  res.data.result.appdata[i].nginx_app_list[i].upstream_server,
                访问量:
                  res.data.result.appdata[i].nginx_app_list[i].upstream_request
              });
              this.$set(
                this.chartSettings.links,
                this.chartSettings.links.length,
                {
                  source:
                    res.data.result.appdata[i].l7ServerName +
                    "(" +
                    res.data.result.appdata[i].ctime +
                    ")",
                  target:
                    res.data.result.appdata[i].nginx_app_list[i].upstream_server
                }
              );
            }
          }
        }
        this.loading = false;
      } else {
        this.loading = false;
        this.dataEmpty = true;
      }
    }
  },
  mounted() {
    this.getChartData();
  }
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
