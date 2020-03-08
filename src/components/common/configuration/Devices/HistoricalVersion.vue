<template>
  <div>
    <Table
      :columns="columns"
      :data="TableValue"
      width="815"
      style="margin: 0 auto;margin-top: 50px;"
    >
      <template slot-scope="{ row, index }" slot="button">
        <div class="column" v-if="index !== 0"></div>
        <Button shape="circle" type="primary" >{{index+1}}</Button>
      </template>
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.user_name }}</strong>
      </template>
      <template slot-scope="{ row }" slot="insync">
        <strong>{{ row.create_time }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="version_nane"  >
        <div v-if="row.version_name == null || row.version_name == '' ">
        <h4  class="addName" @click="change" v-if="StyleChange">add name</h4>
        <Input v-model="row.version_name" @on-blur="missBlur(row.version_name, row.id)"  v-else  ref="res" />
        </div>
        <div v-else>
          <h4 v-if="showValue" @click="valueChange" class="show_value">{{row.version_name}}</h4>
          <Input v-model="row.version_name" @on-blur="missBlur(row.version_name, row.id)" v-else ref="re" />
        </div>
      </template>
    </Table>
    <Button size="large" class="compareButton">Compare and Revert...</Button>
  </div>
</template>

<script>
  import { selNgcVersionByConfId, updNgcVersionNameByConfId } from "@/api/L7";
export default {
  data() {
    return {
      show: true,
      StyleChange: true,
      value: false,
      showValue: true,
      columns: [
        {
          //   type: "index",
          width: 80,
          align: "center",
          slot: "button"
        },

        { title: "Created By", slot: "name" },
        { title: "Created Date", slot: "insync" },
        { title: "Version Name", slot: "version_nane" }
      ],
      TableValue: []
    };
  },
  methods: {
    async getNgcVersionByConfId() {
      let res = await selNgcVersionByConfId({
      nginx_conf_id: this.$route.query.nginx_conf_id
    })
      if (this.asyncOk(res)) {
//       console.log(res)
        this.TableValue = res.data.result
      }
    },
    async updNgcVersionNameByConfId(id, version_name) {
      let res = await updNgcVersionNameByConfId({id, version_name})
//      console.log(res)
  },
    change() {
    this.showValue = false
      this.StyleChange = false;
    this.$nextTick(()=>{
      this.$refs.res.focus();
  });
  },
    missBlur(data, id) {
//    console.log(data)
    if (data === '' || data === null) {
      this.updNgcVersionNameByConfId(id, data)
      this.StyleChange = true
    } else {
        this.updNgcVersionNameByConfId(id, data)
      this.showValue = true
    }
  },
  valueChange() {
    this.showValue = false;
    this.$nextTick(()=>{
      this.$refs.re.focus();
  });
  },
  },
  mounted() {
    this.getNgcVersionByConfId()
  }
};
</script>

<style lang="less" scoped>
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
}
/deep/.ivu-table-tbody {
  border-top: none;
  border: none;
}
/deep/.ivu-table-row {
  border-top: none;
  border: none;
        height: 80px;
  overflow: hidden;
}
/deep/.ivu-table-header th{
  border: none;
        height:60px;
        overflow: hidden;
}
/deep/.ivu-table-header th:nth-child(1){
        color: #f8f8f9;
      }
.addName {
  cursor: pointer;
  color: dodgerblue;
  text-decoration: underline;
}
.compareButton {
  position: absolute;
  bottom: 20px;
  right: 40px;
  z-index: 2;
}
  /deep/.ivu-input {
          border:none;
          background: #f8f8f9;
          border-radius: 0;
          /*cursor: pointer;*/
          border-bottom-color: #515A6E;
        }
  /deep/ .ivu-input-wrapper {
           overflow: hidden;
           border-radius: 0;
           /*cursor: pointer;*/
           border-bottom-color: #515A6E;
         }
  /deep/.ivu-input:focus{
          border-color: #f8f8f9;
          border-radius: 0;
          border-bottom-color: #515A6E;
        }
  .column {
    width:2px;
    height:14px;
    background: lightgray;
    margin:0 auto;
  }
  .show_value {
    cursor: pointer;
  }
</style>