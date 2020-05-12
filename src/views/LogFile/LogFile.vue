<template>
  <div class="content">
    <div class="header">
      <h3>日志</h3>
    </div>
    <Table
      :columns="TableColumns"
      :data="TableData"
      :width="1023"
      :loading="loading"
    ></Table>
    <!-- <BackTop ></BackTop> -->
  </div>
</template>

<script>
import { selSystemLogInfo } from "@/api/logfile";
export default {
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
      this.loading = true;
      let res = await selSystemLogInfo();
      if (res.data.code === "success") {
        let data = new Set(
          res.data.result.map(function(e, index) {
            return e.moudle;
          }, this)
        );
        Array.from(data).forEach(function(e, index) {
          this.$set(this.TableColumns[0].filters, index, {
            label: e,
            value: e,
          });
        }, this);
        this.TableData = res.data.result;
        this.loading = false;
      } else {
        this.loading = false;
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
  height: 100%;
  position: relative;
  overflow-y: scroll;
}
/deep/ .ivu-table-wrapper {
  margin: 0 auto;
  //   margin-top: 100px;
}
/deep/.ivu-table-header th {
  height: 60px;
}
/deep/.ivu-table-row {
  height: 80px;
}
.header {
    width: 1023px;
    height: 80px;
    line-height: 80px;
    margin: 0 auto;
    h3 {
        margin-left: 10px;
    }
}
</style>
