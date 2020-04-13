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
      dataEmpty: false,
    };
  },
  methods: {
    async getChartData() {
      this.loading = true;
      let res = await appViewData({ app_service_id: this.$route.params.app });
      if (res.data.code === "success") {
        console.log(res.data.result);
        this.$set(this.chartData.rows, 0, {
          页面: "请求总数",
          访问量: res.data.result.requests_total
        });
        this.$set(this.chartData.rows, 1, {
          页面: "应用数据",
          访问量: res.data.result.appdata.length
        });
        this.$set(this.chartSettings.links, 0, {
          source: "请求总数",
          target: "应用数据",
        });
        if (res.data.result.appdata.length > 0) {
          res.data.result.appdata.forEach(function(e, i) {
            this.$set(this.chartData.rows, i + 2, {
              页面: "子请求数" + (i+1),
              访问量: e.stub_requests
            });
            this.$set(this.chartSettings.links, i + 1, {
              source: "应用数据",
              target: "子请求数" + (i+1)
            });
          }, this);
        }
        this.loading = false;
      } else {
        this.loading = false;
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
</style>
