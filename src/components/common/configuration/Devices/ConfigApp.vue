<template>
  <div class="tableContent">
    <div v-if="TableData.length < 1">
      <div class="configuration-associations__empty">
        <div class="configuration-associations__empty__title">
          您还没有任何APP关联
        </div>
        请添加一些APP
      </div>
    </div>
    <Table
      :columns="columns"
      :data="TableData"
      width="815"
      style="margin: 0 auto;margin-top: 50px;"
      v-else
      :max-height="500"
      @on-row-click="RouteToApp"
    >
    </Table>
    <!--loading-->
    <div class="loading-wrap " v-if="loading">
      <Loading />
    </div>
  </div>
</template>

<script>
import { selRelevantAPPList } from "@/api/L7";
import loading from "@/components/common/loading";
export default {
  components: { loading },
  data() {
    return {
      columns: [
        { title: "APP名称", key: "app_service_name" },
        { title: "实例名称", key: "L7_server_name" },
        { title: "同步", key: "is_sync" },
        { title: "修改时间", key: "last_time" },
        { title: "修改人", key: "last_name" },
      ],
      TableData: [],
      loading: false,
    };
  },
  methods: {
    //通过配置文件主键查询相关APP列表
    async GetselRelevantAPPList() {
      this.loading = true;
      let res = await selRelevantAPPList({
        nginx_conf_id: this.$route.query.nginx_conf_id,
      });
        this.loading = false;
      if (res.data.code === "success") {
        this.TableData = res.data.result || [];
      }
    },
    //点击表格某一行跳转到APP
    RouteToApp(row, index) {
      this.$router.replace(`/app/${row.app_service_id}/overview`);
    },
  },
  mounted() {
    this.GetselRelevantAPPList();
  },
};
</script>

<style lang="less" scoped>
/deep/.ivu-table-header th {
  border: none;
  background-color: #333;
  color: #fff;
  height: 60px;
}
/deep/.ivu-table-row {
  height: 80px;
}
/deep/.ivu-table-body {
  background-color: #f8f8f9;
}
/deep/.ivu-table-header {
  background-color: #f8f8f9;
}
.configuration-associations__empty {
  margin: 30px;
  color: #ababab;
  font-size: 16px;
}
.configuration-associations__empty__title {
  margin-bottom: 10px;
  color: #d8d8d8;
  font: 24px "RobotoMedium", Arial, sans-serif;
  font-weight: normal;
}
.loading-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 99999;
  background: #f8f8f9;
}
.tableContent {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
