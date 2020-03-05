<template>
  <div>
    <Table
      :columns="columns"
      :data="TableValue"
      width="815"
      style="margin: 0 auto;margin-top: 50px;"
    >
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="add" class="addName" @click="change">
        <h4 v-if="change">add Name</h4>
        <Input v-else v-model="value" style="width: 100px" />
      </template>
    </Table>
    <Button size="large" class="compareButton">Compare and Revert...</Button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      change: false,
      value: "",
      columns: [
        {
          //   type: "index",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "large",
                    shape: "circle"
                  },
                  style: {
                    // marginRight: "5px",
                    background: "#00e173",
                    margin: "0 auto"
                  }
                },
                "1"
              ),
              h("div", {
                style: {
                  height: "19px",
                  width: "2px",
                  background: "#d8d8d8",
                  margin: "0 auto",
                  display: this.show ? "none" : ""
                }
              })
            ]);
          }
        },

        { title: "Created By", slot: "name" },
        { title: "Created Date", key: "insync" },
        { title: "Version Name", slot: "add" }
      ],
      TableValue: [
        {
          name: "John Brown"
        },
        {
          name: "Jim Green"
        }
      ]
    };
  },
  methods: {
    change() {
      this.change = false;
    }
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
}
/deep/.ivu-table-tbody {
  border-top: none;
  border: none;
}
/deep/.ivu-table-row {
  border-top: none;
  border: none;
}
/deep/.ivu-table-header {
  border: none;
}
.addName {
  cursor: pointer;
}
.compareButton {
  position: absolute;
  bottom: 20px;
  right: 40px;
  z-index: 2;
}
</style>