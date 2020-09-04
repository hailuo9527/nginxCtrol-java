<template>
  <div>
    <Table
      :max-height="height"
      :width="width"
      :columns="ResourcePoolColumns"
      :data="activeAside.resourcePoolNameList"
    >
      <template slot-scope="{ row }" slot="cpu_limit">
        <span>{{ row.cpu_limit > -1 ? row.cpu_limit : "不受限制" }}</span>
      </template>
      <template slot-scope="{ row }" slot="cpu_expandableReservation">
        <span>{{
          row.cpu_expandableReservation === true ? "可拓展" : "不可拓展"
        }}</span>
      </template>
      <template slot-scope="{ row }" slot="cpu_shares_level">
        <span>{{ row.cpu_shares_level === "low" ? "低" : "正常" }}</span>
      </template>
      <template slot-scope="{ row }" slot="memory_limit">
        <span>{{ row.memory_limit > -1 ? row.memory_limit : "不受限制" }}</span>
      </template>
      <template slot-scope="{ row }" slot="memory_expandableReservation">
        <span>{{
          row.memory_expandableReservation === true ? "可拓展" : "不可拓展"
        }}</span>
      </template>
      <template slot-scope="{ row }" slot="memory_shares_level">
        <span>{{ row.memory_shares_level === "low" ? "低" : "正常" }}</span>
      </template>
    </Table>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "ResourcePool",
  data() {
    return {
      width: window.screen.width * 0.8,
      height: window.screen.height * 0.6,
      ResourcePoolColumns: [
        {
          title: "名称",
          key: "vm_name",
        },
        {
          title: "CPU预留",
          key: "cpu_reservation",
        },
        {
          title: "CPU限制",
          slot: "cpu_limit",
        },
        {
          title: "CPU分配类型",
          slot: "cpu_expandableReservation",
        },
        {
          title: "CPU份额",
          slot: "cpu_shares_level",
        },
        {
          title: "CPU份额值",
          key: "cpu_shares_shares",
        },
        {
          title: "内存预留",
          key: "memory_reservation",
        },
        {
          title: "内存限制",
          slot: "memory_limit",
        },
        {
          title: "内存分配类型",
          slot: "memory_expandableReservation",
        },
        {
          title: "内存份额",
          slot: "memory_shares_level",
        },
        {
          title: "内存份额值",
          key: "memory_shares_shares",
        },
      ],
    };
  },
  computed: {
    ...mapState({
      activeAside: (state) => state.VMware.activeAside,
    }),
  },
};
</script>

<style lang="less" scoped>
/deep/ .ivu-table {
  background-color: #f8f8f8;
}
/deep/ .ivu-table:before {
  display: none;
}
</style>
