<template>
  <div class="dispatch">
    <div class="table-wrap">
      <div class="table">
        <Table :loading="loading" :columns="columns" :data="data">
          <template slot-scope="{ row, index }" slot="action">
            <Button
              type="info"
              size="small"
              style="margin-right: 5px"
              @click="modify(row, index)"
              >修改</Button
            >
          </template>
        </Table>
      </div>
      <div class="save-bottom">
        <Button
                type="primary"
                :loading="saveLoading"
                @click="save"
        >保存</Button>
      </div>
    </div>
    <Modal v-model="modal" title="修改权重" @on-ok="modal = false" >
      <div class="modal_content" v-if="modal">
            <Input
              v-model="data[index].weight"
              placeholder="权重，数值越大权重越大"
            ></Input>

      </div>
    </Modal>
  </div>
</template>
<script>
import { selAppDispatch, updAppWeight } from "@/api/app";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "dispatch",
  data() {
    return {
      loading: false,
      columns: [
        {
          title: "IP",
          key: "upstream_server",
        },
        {
          title: "流量",
          key: "upstream_request",
        },
        {
          title: "权重",
          key: "weight",
        },
        {
          title: "修改",
          slot: "action",
          width: 150,
          align: "center",
        },
      ],
      data: [],
      modal: false,
      form: {},
      ruleValidate: {},
      upstream_server: "",
      weight: "",
      upstream_request: "",
      index: 0,
      saveLoading: false,
    };
  },
  computed: {
    ...mapState({
      activeAside: state => state.app.activeAside
    }),
  },
  methods: {
    ...mapActions(["getAppAsideList"]),
    ...mapMutations(["appSetActiveAside",'appSetAsideList']),
    modify(row, index) {
      console.log(row);
      this.index = index
      this.modal = true;
      this.upstream_server = row.upstream_server;
      this.upstream_request = row.upstream_request;
    },

    async GetselAppDispatch() {
      this.loading = true;
      let res = await selAppDispatch({
        app_server_id: this.$route.params.app,
      });
      // console.log(res);
      if (res.data.code === "success") {
        this.loading = false;
        this.data = res.data.result;
      } else {
        this.loading = false;
      }
    },
    async save() {
      this.saveLoading = true
      this.data.map((item) =>{
        item.app_service_id = this.$route.params.app
      })
      let res = await updAppWeight(this.data);
      this.saveLoading = false
      if (res.data.code === 'success') {
        this.$Message.info(`${res.data.result}`)
        let json = this.activeAside
        json.appDefaultPublishConfList = this.data
        this.getAppAsideList()
        this.appSetActiveAside(json)
        this.GetselAppDispatch()
        /* 修改app*/
      } else {
        this.$Message.error(`${res.data.result}`)
      }
    }
  },
  watch: {
    //监听路由参数app的变化
    "$route.params.app": {
      handler: function(val, oldVal) {
        this.GetselAppDispatch();
      },
      deep: true,
    },
  },
  mounted() {
    this.GetselAppDispatch();
  },
};
</script>
<style lang="less" scoped>
.dispatch {
  .table-wrap {
    width: 100%;
    height: calc(100% - 60px);
    .table {
      padding: 0 30px 0 20px;
      height: 100%;
      overflow: scroll;
    }
    .save-bottom{
      position: absolute;
      left: -20px;
      bottom: 0;
      right: 30px;
      height: 60px;
      padding: 10px;
      z-index: 9999;
      text-align: right;
    }
  }
}
.modal_content {
  padding: 20px;
  .tip-title {
    margin-bottom: 40px;
    font-size: 14px;
    letter-spacing: 0.2em;
    color: #ccc;
  }
}
</style>
