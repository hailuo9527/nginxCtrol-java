<template>
  <div>
    <div class="mainContent">
      <div class="addButton">
        <Button
          type="primary"
          size="large"
          icon="md-add"
          @click="getL7ServerInfoAll"
          >添加实例</Button
        >
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
              @click="removeSingle(row.id, index)"
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
        @click="changeStyle ? removeSelected() : ''"
        >解除实例关联</Button
      >
      <Button
        size="large"
        class="commonOne"
        :class="changeStyle ? 'change_style' : ''"
        @click="changeStyle ? pushCheck(pushsSelectedInstance) : ''"
        >推送选中实例</Button
      >
     <!-- <Button size="large" class="commonTwo" @click="pushCheck(pushAllInstance)"
        >推送所有实例</Button
      >-->
    </div>
    <Modal
      v-model="DeviceModal"
      title="选择要关联的实例"
      width="790"
      ok-text="添加"
      @on-ok="addInstance"
    >
      <div class="main">
        <h3>
          请添加一些关联。选择一个或多个要与此关联的实例配置
        </h3>
        <Select
          v-model="SelectModel"
          filterable
          multiple
          style="margin-top: 40px;"
          placeholder="选择Instances system或tag"
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
  </div>
</template>

<script>
import {
  selUsableL7Server,
  addInstance,
  delInstance,
  selNgcInstanceList,
  pushInstance,
  pushCheck
} from "@/api/L7";
export default {
  props: {
    TableValue: Array
  },
  data() {
    return {
      columns: [
        { type: "selection", width: 60, align: "center" },
        { title: "实例名称", slot: "name", width: 160 },
        { title: "同步", slot: "insync" },
        { title: "修改时间", slot: "last", width: 160 },
        { title: "修改人", slot: "by", width: 170 },
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
      loading: false,
      selectedValue: []
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
    // 查询可用（空闲）的nginx实例
    async getL7ServerInfoAll() {
      this.DeviceModal = true;
      let res = await selUsableL7Server({app_service_id: ''});
      if (this.asyncOk(res)) {
        this.List = res.data.result;
      }
    },
    // 删除单一条实例
    async removeSingle(id, index) {
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
            this.selectedValue = [];
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
    // 删除勾选中的实例
    async removeSelected() {
      if (this.selectedValue == "") {
        this.$Message.info("请选中要移除的实例");
      } else {
        this.ids = this.selectedValue.map(el => {
          return el.id;
        });
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
              this.selectedValue = [];
              this.$Modal.remove();
              this.$Message.info("删除成功");
              this.getNgcInstanceList();
            } else {
              this.$Modal.remove();
              this.$Message.error("删除失败");
            }
          }
        });
      }
    },
    // 查询实例列表
    async getNgcInstanceList() {
      this.loading = true;
      let res = await selNgcInstanceList(this.$route.query.nginx_conf_id);
      if (this.asyncOk(res)) {
        this.resultValue = res.data.result;
        if (res.data.result.length > 0) {
          this.TableData = res.data.result;
          this.loading = false;
        } else {
          this.loading = false;
          this.$emit("show-change", true);
        }
      } else {
        this.loading = false;
      }
    },
    //选中或者取消选中时触发
    getSelect(selection) {
      this.selectedValue = selection;
      if (selection == "") {
        this.changeStyle = false;
      } else {
        this.changeStyle = true;
      }
    },
    pushCheck(fn) {
      let arr = this.selectedValue.map(item => {
        return item.l7_server_id
      })
      pushCheck({nginx_conf_id: this.$route.query.nginx_conf_id}, arr).then(res => {
        if(this.asyncOk(res) && this.isEmptyObject(res.data.result)) {
          fn()
        }else if (!this.isEmptyObject(res.data.result)){
          this.$Modal.confirm({
            render: (h) => {
              return h('div', [
                h('p','您当前需要发布的配置文件中包含以下PLUS版本的配置信息：'),
                h('p',{
                  domProps: {
                    innerHTML: res.data.result.plus_conf_param
                  },
                  style: {
                    color: '#333',
                    fontSize: '14px'
                  },
                } ),
                h('div', [
                  h('span', '所选实例中'),
                  res.data.result.l7ServerName.map(item => {
                    return h('span', {
                      'class': 'l7ServerName',
                      domProps: {
                        innerHTML: item
                      },
                    })
                  }),
                  h('span', '不支持以上配置。'),
                ]),
                h('p','继续发布将跳过以上实例发布。是否继续？')
              ])
            },
            onOk: () => {
             fn()

            }
          })
        }
      })
    },
    /* 显示loading */
    showSpin(){
      this.$Spin.show({
        render: (h) => {
          return h('Spin', [
            h('div', {
              'class': 'loader',
            },[
              h('svg',{
                'class': 'circular',
                attrs: {
                  viewBox: '25 25 50 50',
                }
              },[
                h('circle',{
                  'class': 'path',
                  attrs: {
                    cx: '50',
                    cy: '50',
                    r: '20',
                    fill: 'none',
                    'stroke-width': '2',
                    'stroke-miterlimit': '0'
                  }
                })
              ])
            ]),
            h('div', {
              domProps: {
                innerHTML: '正在推送'
              },
              style: {
                color: '#333',
                fontSize: '14px'
              },
            })
          ])
        }
      });
    },
  /*  //推送全部实例
    async pushAllInstance() {
      this.showSpin()
      this.selectedValue = this.TableValue
      let res = await pushInstance(this.TableValue);
      this.$Spin.hide()
      if (this.asyncOk(res)) {
        this.$Message.info(`${res.data.result}`);
        this.getNgcInstanceList();
      } else {
        this.$Message.error(`${res.data.result}`);
      }
    },*/
    //推送勾选的实例
    async pushsSelectedInstance() {
      if (this.selectedValue == "") {
        this.$Message.info("请选中要推送的实例");
      } else {
        this.showSpin()

        let res = await pushInstance(this.selectedValue);
        this.$Spin.hide()
        if (this.asyncOk(res)) {
          this.$Message.info(`${res.data.result}`);
          this.getNgcInstanceList();
        } else {
          this.$Message.error(`${res.data.result}`);
        }
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
  bottom: 60px;
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
/deep/.ivu-table-body {
  background-color: #f8f8f9;
}
/deep/.ivu-table-header {
  background-color: #f8f8f9;
}
/deep/.ivu-spin-fix {
  background-color: #f8f8f9;
  border: none;
}
@keyframes ani-demo-spin {
  from { transform: rotate(0deg);}
  50%  { transform: rotate(180deg);}
  to   { transform: rotate(360deg);}
}
/deep/.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
</style>
