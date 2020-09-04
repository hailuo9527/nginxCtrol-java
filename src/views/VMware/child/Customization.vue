<template>
  <div>
    <Table
      :max-height="height"
      :width="width"
      :columns="CustomizationColumns"
      :data="activeAside"
    >
      <template slot-scope="{ row }" slot="gateway">
        <span>{{ row.gateway || "无" }}</span>
      </template>
      <template slot-scope="{ row }" slot="subnetMask">
        <span>{{ row.subnetMask || "无" }}</span>
      </template>
      <template slot-scope="{ row }" slot="dnsServerList">
        <span v-for="item in row.dnsServerList">{{ item }}</span>
      </template>
    </Table>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Customization",
  data() {
    return {
      width: window.screen.width * 0.8,
      height: window.screen.height * 0.6,
      CustomizationColumns: [
        {
          title: "名称",
          key: "name",
        },
        {
          title: "域名",
          key: "domain",
        },
        {
          title: "网关",
          slot: "gateway",
        },
        {
          title: "子网掩码",
          slot: "subnetMask",
        },
        {
          title: "DNS",
          slot: "dnsServerList",
        },
        {
          title: "类型",
          key: "type",
        },
        {
          title: "描述",
          key: "description",
        },
      ],
    };
  },
  computed: {
    ...mapState({
      activeAside: (state) => state.VMware.activeAside,
    }),
  }
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
