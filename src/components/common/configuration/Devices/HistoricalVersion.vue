<template>
  <div class="content">
    <Table
      :columns="columns"
      :data="TableValue"
      width="815"
      style="margin: 0 auto;margin-top: 50px;"
      :loading="loading"
    >
      <template slot-scope="{ row, index }" slot="button">
        <div class="column" v-if="index !== 0"></div>
        <div class="indexColumn" v-else></div>
        <div class="circle" v-if="index === 0">{{row.version_no}}</div>
        <div
          class="exceptIndex"
          v-if="index !== 0"
          @click="changeStyle(index)"
          :class="changestyle && num === index?'buttonStyle': '' "
        >{{row.version_no}}</div>
      </template>
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.user_name }}</strong>
      </template>
      <template slot-scope="{ row }" slot="insync">
        <strong>{{ row.create_time }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="version_nane">
        <div
          class="version_name_father"
          v-if="row.version_name === null || row.version_name === '' "
        >
          <div class="inclusion">
            <h4 class="add_name" @click="change(row, index)" v-if="number !== index">修改名称</h4>
            <Input
              v-if="StyleChange &&number === index"
              ref="res"
              v-model="row.version_name"
              @on-blur="missBlurOne(row.version_name, row.id, index)"
            />
          </div>
        </div>
        <div class="version_name_father" v-else>
          <div class="inclusion">
            <h4
              class="show_value"
              @click="valueChange(index)"
              v-if="number !== index"
            >{{row.version_name}}</h4>
            <Input
              class="input_value"
              v-model="row.version_name"
              ref="re"
              @on-blur="missBlurTwo(row.version_name, row.id, index)"
              v-if="number === index"
            />
          </div>
        </div>
      </template>
    </Table>
    <div class="compareButton" :class="changestyle?'compareChange' : '' ">对比和还原...</div>
  </div>
</template>

<script>
import { selNgcVersionByConfId, updNgcVersionNameByConfId } from "@/api/L7";
export default {
  data() {
    return {
      StyleChange: false,
      changestyle: false,
      number: "",
      num: "",
      loading: true,
      columns: [
        {
          width: 80,
          align: "center",
          slot: "button"
        },
        { title: "创建人", slot: "name" },
        { title: "创建时间", slot: "insync" },
        { title: "版本名称", slot: "version_nane" }
      ],
      TableValue: []
    };
  },
  methods: {
    // 查询nginx历史版本信息
    async getNgcVersionByConfId() {
      let res = await selNgcVersionByConfId({
        nginx_conf_id: this.$route.query.nginx_conf_id
      });
      if (this.asyncOk(res)) {
        this.TableValue = res.data.result;
        this.loading = false;
      } else {
        this.loading = false;
      }
    },
    // 编辑历史版本信息别名
    async updNgcVersionNameByConfId(id, version_name) {
      let res = await updNgcVersionNameByConfId({ id, version_name });
    },
    // 点击后改变圆形div的样式
    changeStyle(index) {
      this.changestyle = true;
      this.num = index;
    },
    //点击后,隐藏add name和输入框聚焦
    change(row, index) {
      this.number = index;
      this.StyleChange = true;
      this.$nextTick(() => {
        this.$refs.res.focus();
      });
    },
    //失去焦点，如果没有值触发
    missBlurOne(data, id, index) {
      if (data === "" || data === null) {
        this.number = "";
      } else {
        this.number = index;
      }
    },
    //失去焦点,如果有值触发
    missBlurTwo(data, id, index) {
      if (data === "" || data === null) {
        this.updNgcVersionNameByConfId(id, data);
        this.number = "";
        this.StyleChange = false;
      } else {
        this.updNgcVersionNameByConfId(id, data);
        this.number = "";
      }
    },
    //点击后,隐藏值和输入框聚焦
    valueChange(index) {
      this.number = index;
      this.$nextTick(() => {
        this.$refs.re.focus();
      });
    }
  },
  mounted() {
    this.getNgcVersionByConfId();
  }
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  overflow-y: scroll;
}
/deep/.ivu-table:before,
/deep/.ivu-table:after {
  display: none;
}
/deep/.ivu-table-wrapper {
  border: none;
}
/deep/.ivu-table td {
  border-bottom: none;
  border: none;
  background-color: #f8f8f9;
  height: 0;
}
/deep/.ivu-table-tbody {
  border-top: none;
  border: none;
}
/deep/.ivu-table-row {
  border-top: none;
  border: none;
  // height: 40px;
  overflow: hidden;
  height: 0;
}
/deep/.ivu-table-row td:nth-child(2) .ivu-table-cell {
  margin-top: 20px;
}
/deep/.ivu-table-row td:nth-child(3) .ivu-table-cell {
  margin-top: 20px;
}
/deep/.ivu-table-row td:nth-child(4) .ivu-table-cell {
  margin-top: 0;
}
/deep/.ivu-table-header {
  background-color: #f8f8f9;
}
/deep/.ivu-table-header th {
  border: none;
  // height: 60px;
  overflow: hidden;
}
/deep/.ivu-table-header {
  background-color: #f8f8f9;
}
/deep/.ivu-table-body {
  background-color: #f8f8f9;
}
/deep/.ivu-table-header th:nth-child(1) {
  color: #f8f8f9;
}
.compareButton {
  position: absolute;
  bottom: 20px;
  right: 40px;
  z-index: 2;
  width: 180px;
  height: 40px;
  border-radius: 3px;
  font-size: 14px;
  line-height: 40px;
  text-align: center;
  background: #eeeeee;
  color: #ababab;
  cursor: default;
}
/deep/.ivu-input {
  border: none;
  background: #f8f8f9;
  border-radius: 0;
  /*cursor: pointer;*/
  border-bottom-color: #515a6e;
}
/deep/ .ivu-input-wrapper {
  overflow: hidden;
  border-radius: 0;
  /*cursor: pointer;*/
  border-bottom-color: #515a6e;
}
/deep/.ivu-input:focus {
  border-color: #f8f8f9;
  border-radius: 0;
  border-bottom-color: #515a6e;
}
.column {
  width: 2px;
  height: 20px;
  background: lightgray;
  margin: 0 24px;
}
.indexColumn {
  width: 2px;
  height: 20px;
  background: lightgray;
  margin: 0 auto;
  visibility: hidden;
}
.inclusion {
  height: 32px;
}
.show_value {
  height: 32px;
  cursor: pointer;
  display: block;
  line-height: 46px;
}
.version_name_father {
  position: relative;
  height: 32px;
}
.add_name {
  cursor: pointer;
  color: dodgerblue;
  text-decoration: underline;
  height: 32px;
  display: block;
  line-height: 46px;
}
.input_value {
  height: 32px;
}
.circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #00e173;
  color: #fff;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
}
.exceptIndex {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #fff;
  color: #333;
  text-align: center;
  line-height: 50px;
  border: 2px solid #d8d8d8;
}
.exceptIndex:hover {
  cursor: pointer;
  border: 2px solid #00e173;
}
.buttonStyle {
  color: #fff;
  background: #666666;
  border: 2px solid #666666;
}
.compareChange {
  background-color: #333;
  color: #fff;
  cursor: pointer;
}
/deep/.ivu-table-wrapper > .ivu-spin-fix {
  border: none;
}
/deep/.ivu-spin-fix {
  background-color: #f8f8f9;
  border: none;
}
</style>