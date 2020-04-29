<template>
  <div class="content">
    <Table
      :columns="TableColumns"
      :data="TableData"
      :max-height="400"
      :width="1023"
      :loading="loading"
    ></Table>
  </div>
</template>

<script>
import { selSystemLogInfo } from "@/api/logfile";
export default {
    components: { VeLine },
  data() {
    return {
      TableColumns: [
        {
          title: "操作类型",
          key: "moudle",
          filters: [],
            filterMultiple: false,
          filterMethod(value, row) {
            return row.moudle.indexOf(value) > -1;
          },
        },
        {
          title: "用户名称",
          key: "user_name",
        },
        {
          title: "时间",
          key: "ctime",
        },
        {
          title: "详细信息",
          key: "comment",
        },
      ],
      TableData: [],
      loading: false,
    };
  },
  methods: {
    async GetAllLog() {
      this.loading = true
      let res = await selSystemLogInfo();
      if (res.data.code === "success") {
        res.data.result.forEach(function(e, index) {
          this.$set(this.TableColumns[0].filters, index, {
            label: e.moudle,
            value: e.moudle,
          });
        }, this);
        this.TableData = res.data.result;
        this.loading = false
      } else {
        this.loading = false
        this.$Message.error(`${res.data.result}`);
      }
    },
  },
  mounted() {
    this.GetAllLog();
  },
};
</script>

<style lang="less" scoped>
.content {
    width: 100%;
    overflow-y: scroll;
}
/deep/ .ivu-table-wrapper {
  margin: 0 auto;
  margin-top: 100px;
}
/deep/.ivu-table-header th {
  height: 60px;
}
/deep/.ivu-table-row {
  height: 80px;
}
</style>
