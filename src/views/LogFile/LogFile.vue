<template>
  <div class="content">
    <div class="header">
      <h3>日志</h3>
    </div>
    <div class="table-content">
      <div class="select">
        <Select
          v-model="selectModel"
          style="width:200px"
          placeholder="请选择类型"
          @on-select="selectValue"
        >
          <Option value="全部">全部</Option>
          <Option v-for="item in filterValue" :value="item" :key="item">{{
            item
          }}</Option>
        </Select>
      </div>
      <Scroll :on-reach-bottom="handleReachBottom" :height="height">
        <Table
          :columns="TableColumns"
          :data="TableData"
          :width="1016"
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
      height: window.screen.availHeight - 260,
      selectModel: "",
      filterValue: [],
    };
  },
  methods: {
    //查询操作记录
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
    //查询操作类型
    async GetMoudleType() {
      let res = await selLogMoudel();
      if (res.data.code === "success") {
        this.filterValue = res.data.result;
      }
    },
    //下拉刷新
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
    //选择操作类型
    selectValue(data) {
      if (data.value === "全部") {
        this.moudle = "";
      } else {
        this.moudle = data.value;
      }
      this.page = 1;
      this.size = 20;
      this.GetAllLog();
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
.select {
  width: 1023px;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
