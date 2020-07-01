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
        <div class="circle" v-if="index === 0">{{ row.version_no }}</div>
        <div
          class="exceptIndex"
          v-if="index !== 0"
          @click="changeStyle(index, row.version_no)"
          :class="changestyle && num === index ? 'buttonStyle' : ''"
        >
          {{ row.version_no }}
        </div>
      </template>
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.user_name }}</strong>
      </template>
      <template slot-scope="{ row }" slot="insync">
        <strong>{{ row.create_time }}</strong>
      </template>
      <template slot-scope="{ row }" slot="nginx_plus_status">
        <strong>{{ row.nginx_plus_status }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="version_nane">
        <div
          class="version_name_father"
          v-if="row.version_name === null || row.version_name === ''"
        >
          <div class="inclusion">
            <h4
              class="add_name"
              @click="change(row, index)"
              v-if="number !== index"
            >
              修改名称
            </h4>
            <Input
              v-if="StyleChange && number === index"
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
            >
              {{ row.version_name }}
            </h4>
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
    <div
      class="compareButton"
      :class="changestyle ? 'compareChange' : ''"
      @click="CompareData()"
    >
      对比和还原...
    </div>  
    <Modal v-model="CompareModal" width="80" :mask-closable="false">
      <template slot="close">
        <span></span>
      </template>
      <div>
        <div slot="close" style="text-align: right;margin: -10px -6px 10px 0;" v-if="!Compareloading">
          <Icon
            type="md-close"
            size="22"
            style="cursor: pointer;"
            @click="CompareModal = false"
          />
        </div>
        <code-diff
          :old-string="oldStr"
          :new-string="newStr"
          :context="1000"
          outputFormat="side-by-side"
          v-if="!Compareloading"
        />
        <div class="loading-spin">
          <Loading color="#01c864" v-if="Compareloading" />
        </div>
      </div>
      <div slot="footer">
        <Button @click="CompareModal = false" style="margin-right: 10px"
          >取消</Button
        >
        <Poptip
          confirm
          title="是否确定还原?"
          ok-text="确定"
          @on-ok="RevertData"
          cancel-text="取消"
          style="color: #000"
        >
          <Button type="primary" :disabled="isDiff">还原</Button>
        </Poptip>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  selNgcVersionByConfId,
  updNgcVersionNameByConfId,
  nginxConfCompare,
  nginxConfRestore,
} from "@/api/L7";
import CodeDiff from "vue-code-diff";
import Loading from "@/components/common/loading.vue";
export default {
  components: { CodeDiff, Loading },
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
          slot: "button",
        },
        { title: "创建人", slot: "name" },
        { title: "创建时间", slot: "insync" },
        { title: "PLUS版本配置", slot: "nginx_plus_status" },
        { title: "版本名称", slot: "version_nane" },
      ],
      TableValue: [],
      versionNumber: "",
      CompareModal: false,
      oldStr: "",
      newStr: "",
      Compareloading: false,
      isDiff: false,
    };
  },
  methods: {
    // 查询nginx历史版本信息
    async getNgcVersionByConfId() {
      let res = await selNgcVersionByConfId({
        nginx_conf_id: this.$route.query.nginx_conf_id,
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
    changeStyle(index, row) {
      this.changestyle = true;
      this.num = index;
      this.versionNumber = row;
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
    },
    //配置文件不同版本比较
    async CompareData() {
      this.CompareModal = true;
      this.Compareloading = true;
      this.isDiff = true;
      let res = await nginxConfCompare({
        nginx_conf_id: this.$route.query.nginx_conf_id,
        version: this.versionNumber,
      });
      if (res.data.code === "success") {
        // console.log(res);
        if (res.data.result.conf_old === res.data.result.conf_new) {
          let strNew = "VERSION:" + res.data.result.version_new + "\n";
          let strOld = "VERSION:" + res.data.result.version_old + "\n";
          this.oldStr = strOld.concat(res.data.result.conf_old);
          this.newStr = strNew.concat(res.data.result.conf_new);
          this.Compareloading = false;
        } else {
          let str_New = "VERSION:" + res.data.result.version_new + "\n";
          let str_Old = "VERSION:" + res.data.result.version_old + "\n";
          this.oldStr = str_Old.concat(res.data.result.conf_old);
          this.newStr = str_New.concat(res.data.result.conf_new);
          this.Compareloading = false;
          this.isDiff = false;
        }
      } else {
        this.Compareloading = false;
        this.$Message.error(`${res.data.result}`);
      }
    },
    //还原历史版本配置
    async RevertData() {
      let res = await nginxConfRestore({
        nginx_conf_id: this.$route.query.nginx_conf_id,
        version: this.versionNumber,
      });
      if (res.data.code === "success") {
        this.CompareModal = false;
        this.$Message.success("还原成功");
        this.getNgcVersionByConfId();
      } else {
        this.$Message.error(`${res.data.result}`);
      }
    },
  },
  mounted() {
    this.getNgcVersionByConfId();
  },
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
  margin-top: 20px;
  margin-left: 26px;
}
/deep/.ivu-table-row td:nth-child(5) .ivu-table-cell {
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
.loading-spin {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
