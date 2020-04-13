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
          页面: "nginx_app_list1",
          访问量: res.data.result.appdata[0].stub_requests
        });
        this.$set(this.chartData.rows, 2, {
          页面: "nginx_app_list2",
          访问量: res.data.result.appdata[1].stub_requests
        });
        this.$set(this.chartData.rows, 3, {
          页面: res.data.result.appdata[0].nginx_app_list[0].upstream_server,
          访问量: 0
        });
        this.$set(this.chartData.rows, 4, {
          页面: res.data.result.appdata[0].nginx_app_list[1].upstream_server,
          访问量: 0
        });
        this.$set(this.chartSettings.links, 0, {
          source: "请求总数",
          target: "nginx_app_list1"
        });
        this.$set(this.chartSettings.links, 1, {
          source: "请求总数",
          target: "nginx_app_list2"
        });
        this.$set(this.chartSettings.links, 2, {
          source: "nginx_app_list1",
          target: res.data.result.appdata[0].nginx_app_list[0].upstream_server
        });
        this.$set(this.chartSettings.links, 3, {
          source: "nginx_app_list1",
          target: res.data.result.appdata[0].nginx_app_list[1].upstream_server
        });
        // this.$set(this.chartData.rows, 0, {
        //   页面: "请求总数",
        //   访问量: res.data.result.requests_total
        // });
        // res.data.result.appdata.forEach(function(e, i) {
        //   this.$set(this.chartData.rows, i + 1, {
        //     页面: "应用数据" + i,
        //     访问量: e.stub_requests
        //   });
        //   this.$set(this.chartSettings.links, i, {
        //     source: "请求总数",
        //     target: "应用数据" + i
        //   });
        //   e.nginx_app_list.forEach(function(v, k) {
        //     this.$set(this.chartData.rows, k + 3, {
        //       页面: "nginx_app_list" + k,
        //       访问量: e.upstream_server
        //     });
        //     this.$set(
        //       this.chartSettings.links,
        //       i + res.data.result.appdata.length,
        //       {
        //         source: "应用数据" + i,
        //         target: "nginx_app_list" + k
        //       }
        //     );
        //   }, this);
        // }, this);

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
