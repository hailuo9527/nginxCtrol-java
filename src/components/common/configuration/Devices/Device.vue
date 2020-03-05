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
        <Button type="primary" size="large" icon="md-add" @click="DeviceModal = true">添加设备</Button>
      </div>
    </div>
    <div v-else>
        <device-table></device-table>
    </div>
    <Modal
      v-model="DeviceModal"
      title="SELECT INSTANCES TO ASSOCIATE"
      width="790"
      ok-text="添加"
      @on-ok="add"
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
          <Option v-for="item in List" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
    </Modal>
  </div>
</template>

<script>
import DeviceTable from '@/components/common/configuration/Devices/DeviceTable.vue';
export default {
  components: {DeviceTable},
  data() {
    return {
      show: true,
      DeviceModal: false,
      SelectModel: [],
      List: [
        { value: "New York", label: "New York" },
        { value: "London", label: "London" },
        { value: "Sydney", label: "Sydney" }
      ]
    };
  },
  methods: {
    GetSelectValue(data) {
      console.log(data);
    },
    add() {
      this.DeviceModal = false;
      this.show = false;
    }
  }
};
</script>

<style lang="less" scoped>
.main {
  padding: 10px 30px 0;
}
</style>