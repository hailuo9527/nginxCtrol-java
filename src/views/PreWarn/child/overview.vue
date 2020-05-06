<template>
  <Card>
    <Table :columns="TableColumms" :data="TableData"></Table>
  </Card>
</template>

<script>
export default {
  data() {
    return {
      TableColumms: [
        {
          title: "磁盘使用率",
          key: "disk_use_percent",
        },
        {
          title: "可使用内存",
          key: "mem_available",
        },
        {
          title: "内存使用率",
          key: "mem_usage",
        },
        {
          title: "系统CPU使用率",
          key: "cpu_system",
        },
        {
          title: "虚拟机CPU使用率",
          key: "cpu_idle",
        },
        {
          title: "用户CPU使用率",
          key: "cpu_user",
        },
        {
          title: "创建时间",
          key: "ctime",
        },
        {
          title: "创建人",
          key: "create_user",
        },
        {
          title: "修改",
          slot: "action",
        },
      ],
      TableData: [],
    };
  },
};
</script>

<style lang="less" scoped>
/deep/ .ivu-table-wrapper {
  margin: 0 auto;
  margin-top: 80px;
}
/deep/.ivu-table-wrapper {
  border: none;
}
/deep/.ivu-table td {
  border-bottom: none;
}
/deep/.ivu-table:before,
/deep/.ivu-table:after {
  display: none;
}
/deep/.ivu-table-header th {
  height: 60px;
}
/deep/.ivu-table-row {
  height: 80px;
}
</style>
