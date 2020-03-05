<template>
  <div>
    <div class="mainContent">
      <div class="addButton">
        <Button type="primary" size="large" icon="md-add" @click="DeviceModal = true">添加设备</Button>
      </div>
      <div class="tableContent">
        <Table
          :columns="columns"
          :data="TableValue"
          width="815"
          style="margin: 0 auto;margin-top: 50px;"
        >
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action" >
            <Icon type="ios-trash" size="22" style="cursor: pointer;"/>
          </template>
        </Table>
      </div>
    </div>
    <div class="footer">
      <Button size="large" class="commonOne">Unlink Instance Associations</Button>
      <Button size="large" class="commonOne">Push to selected Instances</Button>
      <Button size="large" class="commonTwo">Push to All Instances</Button>
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
export default {
  data() {
    return {
      columns: [
        { type: "selection", width: 60, align: "center" },
        { title: "INSTANCE NAME", slot: "name" },
        { title: "IN SYNC", key: "insync" },
        { title: "LAST MODIFIED", key: "last" },
        { title: "LAST MODIFIED BY", key: "by" },
        { slot: "action", align: "center" }
      ],
      TableValue: [
        {
          name: "John Brown"
        },
        {
          name: "Jim Green"
        }
      ],
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
    }
  }
};
</script>


<style lang="less" scoped>
.mainContent {
  position: relative;
}
.addButton {
  position: absolute;
  right: 30px;
  top: -36px;
  cursor: pointer;
}
.footer {
  position: absolute;
  bottom: 20px;
  right: 30px;
  z-index: 2;
}
.commonOne {
  margin-right: 20px;
  background: #eeeeee;
  color: #ababab;
}
.commonTwo {
  background: #333333;
  color: #ffffff;
}
</style>