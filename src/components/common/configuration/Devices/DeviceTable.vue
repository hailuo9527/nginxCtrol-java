<template>
  <div>
    <div class="mainContent">
      <div class="addButton">
        <Button type="primary" size="large" icon="md-add" @click="getL7ServerInfoAll">添加实例</Button>
      </div>
      <div class="tableContent">
        <Table
          :columns="columns"
          :data="TableData"
          width="815"
          style="margin: 0 auto;margin-top: 50px;"
          @on-selection-change="getSelect"
          :loading="loading"
        >
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.l7_server_name }}</strong>
          </template>
          <template slot-scope="{ row }" slot="insync">
            <strong>{{ row.is_sync }}</strong>
          </template>
          <template slot-scope="{ row }" slot="last">
            <strong>{{ row.upd_time }}</strong>
          </template>
          <template slot-scope="{ row }" slot="by">
            <strong>{{ row.upd_name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Icon
              type="ios-trash"
              size="22"
              style="cursor: pointer;"
              @click="remove(row.id, index)"
            />
          </template>
        </Table>
      </div>
    </div>
    <div class="footer">
      <Button
        size="large"
        class="commonOne"
        :class="changeStyle ? 'change_style' : ''"
      >Unlink Instance Associations</Button>
      <Button
        size="large"
        class="commonOne"
        :class="changeStyle ? 'change_style' : ''"
      >Push to selected Instances</Button>
      <Button size="large" class="commonTwo">Push to All Instances</Button>
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
import {
  selL7ServerInfoAll,
  addInstance,
  delInstance,
  selNgcInstanceList
} from "@/api/L7";
export default {
  props: {
    TableValue: Array
  },
  data() {
    return {
      columns: [
        { type: "selection", width: 60, align: "center" },
        { title: "INSTANCE NAME", slot: "name", width: 160 },
        { title: "IN SYNC", slot: "insync" },
        { title: "LAST MODIFIED", slot: "last", width: 160 },
        { title: "LAST MODIFIED BY", slot: "by", width: 170 },
        { slot: "action", align: "center", title: "", width: 60 }
      ],
      DeviceModal: false,
      SelectModel: [],
      List: [],
      data: [],
      l7ServerIds: [],
      ids: [],
      TableData: [],
      changeStyle: false,
      loading: false
    };
  },
  watch: {},
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
            if (item === this.List[i].l7ServerName) {
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
    // 查询所有L7服务器配置信息
    async getL7ServerInfoAll() {
      this.DeviceModal = true;
      let res = await selL7ServerInfoAll();
      if (this.asyncOk(res)) {
        this.List = res.data.result;
      }
    },
    // 删除实例
    async remove(id, index) {
      this.ids.push(id);
      this.$Modal.confirm({
        title: "提示",
        content: "<p>确定删除此条列表吗？</p>",
        loading: true,
        onOk: async () => {
          let res = await delInstance(
            {
              nginx_conf_id: this.$route.query.nginx_conf_id
            },
            this.ids
          );
          if (this.asyncOk(res)) {
            this.ids = [];
            this.$Modal.remove();
            this.$Message.info("删除成功");
            this.getNgcInstanceList();
          } else {
            this.$Modal.remove();
            this.$Message.error("删除失败");
          }
        }
      });
    },
    // 查询实例列表
    async getNgcInstanceList() {
      this.loading = true
      let res = await selNgcInstanceList(this.$route.query.nginx_conf_id);
      if (this.asyncOk(res)) {
        this.resultValue = res.data.result;
        if (res.data.result.length > 0) {
          this.TableData = res.data.result;
          this.loading = false
        } else {
          this.loading = false
          this.$emit("show-change", true);
        }
      }
    },
    //选中或者取消选中时触发
    getSelect(selection) {
      console.log(selection);
      if (selection == '') {
        this.changeStyle = false;
      } else {
        this.changeStyle = true;
      }
    }
  },
  mounted() {
    this.TableData = this.TableValue;
    this.$Message.config({
      top: 50,
      duration: 3
    });
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
  cursor: default;
}
.change_style {
  background: #333;
  color: #fff;
  cursor: pointer;
}
.commonTwo {
  background: #333333;
  color: #ffffff;
}
/deep/.ivu-table-header th {
  border: none;
  background-color: #333;
  color: #fff;
  height: 60px;
}
/deep/.ivu-table-row {
  height: 80px;
}
/deep/.ivu-table-header th:nth-child(6) {
  color: #333;
}
</style>