<template>
  <div>
    <div v-if="show">
      <div class="configuration-associations__empty">
        <div
          class="configuration-associations__empty__title"
        >You don't have any instance associations yet.</div>Please add a few associations.
        <!-- /react-text -->
      </div>
      <div class="configuration-associations__add-new">
        <Button type="primary" size="large" icon="md-add" @click=" getL7ServerInfoAll">添加实例</Button>
      </div>
    </div>
    <div v-else>
      <device-table :TableValue="resultValue"></device-table>
    </div>
    <Modal
      v-model="DeviceModal"
      title="SELECT INSTANCES TO ASSOCIATE"
      width="790"
      ok-text="添加"
      @on-ok="addInstance"
    >
      <div class="main">
        <h3>Select one or more instances to which you wish to associate with this configuration</h3>
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
          >{{ item.l7ServerName }}</Option>
        </Select>
      </div>
    </Modal>
  </div>
</template>

<script>
import DeviceTable from "@/components/common/configuration/Devices/DeviceTable.vue";
import { selNgcInstanceList, selL7ServerInfoAll, addInstance } from "@/api/L7";
export default {
  components: { DeviceTable },
  data() {
    return {
      show: true,
      DeviceModal: false,
      SelectModel: [],
      List: [],
      data: [],
      l7ServerIds: [],
      resultValue: []
    };
  },
  methods: {
    GetSelectValue(l7ServerName) {
      this.data = l7ServerName;
      console.log(this.data);
    },
    async addInstance() {
      this.DeviceModal = false;
      if (this.data !== []) {
        this.data.forEach((item) => {
          for (let i = 0; i < this.List.length ; i++) {
            if (item == this.List[i].l7ServerName) {
              this.l7ServerIds.push(this.List[i].l7ServerId);
            }
          }
        });
        this.l7ServerIds = Array.from(new Set(this.l7ServerIds))
        console.log(this.l7ServerIds);
        let res = await addInstance(
          this.$route.query.nginx_conf_id,
          this.l7ServerIds
        );
        console.log(res);
      }

      // this.show = false;
    },
    async getNgcInstanceList() {
      console.log(this.$route.query.nginx_conf_id);
      let json = this.$route.query.nginx_conf_id;
      let res = await selNgcInstanceList(this.$route.query.nginx_conf_id);
      if (this.asyncOk(res)) {
        if (res.data.result.length > 0) {
          this.show = false;
          this.resultValue = res.data.result
        }
        console.log(res);
      }
    },
    async getL7ServerInfoAll() {
      this.DeviceModal = true;
      let res = await selL7ServerInfoAll();
      if (this.asyncOk(res)) {
        console.log(res);
        this.List = res.data.result;
        console.log(this.List);
      }
    }
  },
  mounted() {
    this.getNgcInstanceList();
  }
};
</script>

<style lang="less" scoped>
.main {
  padding: 10px 30px 0;
}
</style>