<template>
  <div>
    <Table
      :max-height="height"
      :width="width"
      :columns="DataStorageColumns"
      :data="activeAside.datastoreNameList"
    >
      <template slot-scope="{ row }" slot="voerllStatus">
        <span v-if="row.voerllStatus === 'green'">
          <Icon type="md-checkmark" style="color: #01c864" />
          {{ "正常" }}</span
        >
        <span v-if="row.voerllStatus === 'yellow'">
          <Icon type="md-warning" style="color: #fddc0d" />
          {{ "警告" }}</span
        >
        <span v-if="row.voerllStatus === 'red'">
          <Icon type="md-alert" style="color: #e62700" />
          {{ "警示" }}</span
        >
      </template>
    </Table>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "DataStorage",
  data() {
    return {
      width: window.screen.width * 0.8,
      height: window.screen.height * 0.6,
      DataStorageColumns: [
        {
          title: "名称",
          key: "name",
        },
        {
          title: "状态",
          slot: "voerllStatus",
        },
        {
          title: "容量",
          key: "capacity",
        },
        {
          title: "可用空间",
          key: "freeSpace",
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
