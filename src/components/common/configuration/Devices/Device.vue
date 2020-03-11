<template>
  <div>
    <div v-if="show">
      <div class="configuration-associations__empty">
        <div class="configuration-associations__empty__title">
          You don't have any instance associations yet.
        </div>
        Please add a few associations.
        <!-- /react-text -->
      </div>
      <div class="configuration-associations__add-new">
        <Button
          type="primary"
          size="large"
          icon="md-add"
          @click="getL7ServerInfoAll"
          >添加实例</Button
        >
      </div>
    </div>
    <div v-else>
      <device-table
        :TableValue="resultValue"
        v-on:show-change="showChange"
      ></device-table>
    </div>
    <Modal
      v-model="DeviceModal"
      title="SELECT INSTANCES TO ASSOCIATE"
      width="790"
      ok-text="添加"
      @on-ok="addInstance"
    >
      <div class="main">
        <h3>
          Select one or more instances to which you wish to associate with this
          configuration
        </h3>
        <Select
          v-model="SelectModel"
          filterable
          multiple
          style="margin-top: 40px;"
          placeholder="Select Instances system or tag "
          @on-change="GetSelectValue"
        >
          <Option
            v-for="item in List"
            :value="item.l7ServerName"
            :key="item.l7ServerName"
            >{{ item.l7ServerName }}</Option
          >
        </Select>
      </div>
    </Modal>
    <!--loading-->
    <div class="loading-wrap " v-if="loading">
      <Loading />
    </div>
  </div>
</template>

<script>
import DeviceTable from "@/components/common/configuration/Devices/DeviceTable.vue";
import loading from "@/components/common/loading";
import { selNgcInstanceList, selL7ServerInfoAll, addInstance } from "@/api/L7";
export default {
  components: { DeviceTable, loading },
  data() {
    return {
      loading: true,
      show: true,
      DeviceModal: false,
      SelectModel: [],
      List: [],
      data: [],
      l7ServerIds: [],
      resultValue: [],
      spinShow: true
    };
  },
  methods: {
    // 获取选择器选中的值
    GetSelectValue(l7ServerName) {
      this.data = l7ServerName;
    },
    // 添加实例
    async addInstance() {
      this.DeviceModal = false;
      if (this.data !== []) {
        this.data.forEach(item => {
          for (let i = 0; i < this.List.length; i++) {
            if (item == this.List[i].l7ServerName) {
              this.l7ServerIds.push(this.List[i].l7ServerId);
            }
          }
        });
        this.l7ServerIds = Array.from(new Set(this.l7ServerIds));
        let res = await addInstance(
          this.$route.query.nginx_conf_id,
          this.l7ServerIds
        );
        if (this.asyncOk(res)) {
          this.l7ServerIds = [];
          this.getNgcInstanceList();
        } else {
          this.$Message.error(`${res.data.result}`);
          this.l7ServerIds = [];
        }
      }
    },
    // 查询实例列表
    async getNgcInstanceList() {
      let res = await selNgcInstanceList(this.$route.query.nginx_conf_id);
      if (this.asyncOk(res)) {
        if (res.data.result.length > 0) {
          this.show = false;
          this.resultValue = res.data.result;
          this.loading = false;
        } else {
          this.loading = false;
        }
      }
    },
    // 查询所有L7服务器配置信息
    async getL7ServerInfoAll() {
      this.DeviceModal = true;
      let res = await selL7ServerInfoAll();
      if (this.asyncOk(res)) {
        this.List = res.data.result;
      }
    },
    showChange(data) {
      this.show = data;
    }
  },
  mounted() {
    this.getNgcInstanceList();
    this.$Message.config({
      top: 50,
      duration: 3
    });
  }
};
</script>

<style lang="less" scoped>
.main {
  padding: 10px 30px 0;
}
</style>
