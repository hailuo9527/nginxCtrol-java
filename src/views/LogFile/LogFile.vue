<template>
  <div class="content">
    <div class="header">
      <h3>日志</h3>
    </div>
    <div class="table-content">
      <Scroll :on-reach-bottom="handleReachBottom" :height="height">
        <Table
          :columns="TableColumns"
          :data="TableData"
          :width="1023"
          :loading="loading"
          :height="height"
        ></Table>
      </Scroll>
    </div>
    <!-- <BackTop ></BackTop> -->
  </div>
</template>

<script>
import { selSystemLogInfo, selLogMoudel } from "@/api/logfile";
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
      page: 1,
      size: 20,
      moudle: "",
      status: false,
      height: window.screen.availHeight-220,
    };
  },
  methods: {
    async GetAllLog() {
      this.loading = true;
      let res = await selSystemLogInfo({
        page: this.page,
        size: this.size,
        moudle: this.moudle,
      });
      if (res.data.code === "success") {
        this.loading = false;
        if (res.data.result < 20) {
          this.status = true;
        }
        this.TableData = res.data.result;
      } else {
        this.loading = false;
        this.$Message.error(`${res.data.result}`);
      }
    },
    async GetMoudleType() {
      let res = await selLogMoudel();
      if (res.data.code === "success") {
        res.data.result.forEach(function(e, index) {
          this.$set(this.TableColumns[0].filters, index, {
            label: e,
            value: e,
          });
        }, this);
      }
    },
    handleReachBottom() {
      return new Promise(async (resolve) => {
        if (!this.status) {
          this.page += 1;
          this.loading = true;
          let res = await selSystemLogInfo({
            page: this.page,
            size: this.size,
            moudle: this.moudle,
          });
          if (res.data.code === "success") {
            this.loading = false;
            if (res.data.result.length < 20) {
              this.status = true;
            }
            res.data.result.forEach(function(e) {
              this.TableData.push(e);
            }, this);
          } else {
            this.loading = false;
            this.$Message.error(`${res.data.result}`);
          }
          resolve();
        } else {
          this.$Message.info("到底了");
          resolve();
        }
      });
    },
  },
  mounted() {
    this.GetAllLog();
    this.GetMoudleType();
  },
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;
    // overflow-y: scroll;
  //   .table-content {
  //     //   position: relative;
  //       height: 100%;
  //   }
}
/deep/ .ivu-table-wrapper {
  margin: 0 auto;
  // margin-top: 20px;
}
/deep/.ivu-table-header th {
  height: 60px;
  background-color: #f4f5f7;
}
/deep/.ivu-table-row {
  height: 80px;
}
.header {
  width: 1023px;
  height: 80px;
  line-height: 80px;
  margin: 0 auto;
  border-bottom: 1px solid #d8d8d8;
  h3 {
    margin-left: 10px;
  }
}
// /deep/ .ivu-scroll-container {
//     overflow: hidden;
//     overflow-y: hidden;
// }
</style>
