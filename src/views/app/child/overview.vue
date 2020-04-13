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
        focusNodeAdjacency: true
      }
    };
    return {
      chartData: {
        columns: ["页面", "访问量"],
        rows: []
      },
      loading: false,
      dataEmpty: false
    };
  },
  methods: {
    // getdata(data) {
    //     console.log(data)
    // },
    async getChartData() {
      this.loading = true;
      let res = await appViewData({ app_service_id: this.$route.params.app });
      if (res.data.code === "success") {
        console.log(res.data.result);
        this.chartData.rows[0] = {
          页面: "requests_total",
          访问量: res.data.result.requests_total
        };
        this.chartData.rows[1] = {
          页面: "appdata",
          访问量: res.data.result.appdata.length
        };
        this.chartSettings.links[0] = {
          source: "requests_total",
          target: "appdata"
        };
        if (res.data.result.appdata.length > 0) {
          res.data.result.appdata.forEach(function(e, i) {
            this.chartData.rows[i + 2] = {
              页面: "stub_requests"+i,
              访问量: e.stub_requests
            };
            this.chartSettings.links[i + 1] = {
              source: "appdata",
              target: "stub_requests"+i
            };
          }, this);
        }
        console.log(this.chartSettings.links);
        console.log(this.chartData.rows);
        this.loading = false;
      } else {
        this.loading = false;
      }
    }
  },
  mounted() {
    // this.getdata()
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
</style>
