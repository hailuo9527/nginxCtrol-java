<template>
  <div class="aside-wrap">
    <Input
      suffix="ios-search"
      placeholder="实例名"
      v-model.trim="searchString"
      clearable
    />
    <div style="display: flex; justify-content: center">
      <div class="add-list" @click="addModel">
        <!--      <span>添加</span>-->
        <Tooltip
          content="添加L7设备"
          placement="top"
          max-width="200"
          theme="light"
        >
          <Icon type="md-add" color="#fff" :size="25" />
        </Tooltip>
        <!--<Icon type="md-add" color="#fff" :size="25"/>-->
      </div>
    </div>

    <div class="aside-list">
      <div class="aside-list-wrap">
        <div
          class="aside-item"
          :class="{
            active: item.l7ServerId === $route.params.prewarn,
            disable: !item.run_status,
          }"
          @click="changeAside(item)"
          v-for="(item, index) in filterAside"
          :key="item.l7ServerId"
        >
          <div class="title">
            <span :class="item.usable_status ? 'online' : 'error'"></span>
            {{ item.l7ServerName }}
          </div>
          <div class="info">
            {{ item.nginxVersion || "NGINX安装失败或未安装" }}
          </div>
          <!--<Icon
            type="md-close"
            title="删除此项"
            class="delete"
            size="18"
            color="#555"
            @click.stop="delL7ServerInfo(item.l7ServerId)"
          />
          <Icon type="ios-create" size="18" color="#555" title="编辑" class="edit" @click.stop="editModel(item)" />-->
          <Icon
            type="md-more"
            size="20"
            color="#000"
            title="编辑"
            class="menu"
            @click.stop="editModel(item)"
          />
        </div>
      </div>
      <div
        class="aside-list-wrap"
        style="text-align: center"
        v-if="!filterAside.length"
      >
        未搜索到匹配的实例
      </div>
      <div
        class="load-wrap"
        style="display: flex; justify-content: center;align-items: center;"
        v-if="listLoading"
      >
        <Loading />
      </div>
    </div>

    <Modal v-model="l7_model_add" width="480">
      <p slot="header" style="color:#333;text-align:center">
        <span>{{ edit ? "修改服务器配置" : "添加NGINX服务器" }}</span>
      </p>
      <div style="text-align:center">
        <Form ref="formValidate" :model="add_l7_form" :rules="ruleValidate">
          <FormItem label="实例别名" prop="l7ServerName">
            <Input v-model="add_l7_form.l7ServerName"></Input>
          </FormItem>
          <FormItem label="ssh连接实例的IP" prop="l7ServerSSHIp">
            <Input v-model="add_l7_form.l7ServerSSHIp"></Input>
          </FormItem>
          <FormItem label="ssh连接实例的用户" prop="l7ServerSSHName">
            <Input v-model="add_l7_form.l7ServerSSHName"></Input>
          </FormItem>
          <FormItem label="ssh连接实例的密码" prop="l7ServerSSHPwd">
            <Input v-model="add_l7_form.l7ServerSSHPwd"></Input>
          </FormItem>
          <FormItem label="ssh连接实例的端口" prop="l7ServerSSHPort">
            <Input v-model="add_l7_form.l7ServerSSHPort"></Input>
          </FormItem>
          <FormItem label="备注" v-if="addMoment">
            <Input v-model="add_l7_form.remark"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button
          class="fl"
          v-if="!addMoment"
          ghost
          type="error"
          @click.stop="delL7ServerInfo(add_l7_form.l7ServerId)"
          >删除</Button
        >
        <Button @click="l7_model_add = false">取消</Button>
        <Button
          type="primary"
          :loading="modal_loading"
          @click="addL7('formValidate')"
          v-if="addMoment"
          >确认</Button
        >
        <Button
          type="primary"
          :loading="modal_loading"
          @click="updL7ServerInfo('formValidate')"
          v-else
          >确认</Button
        >
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from "vuex";
import {
  addL7ServerInfo,
  delL7ServerInfo,
  updL7ServerInfo,
} from "../../api/L7";
import { selL7ServerInfoAll } from "../../api/L7";

export default {
  name: "MyAside",
  data() {
    const validatel7ServerName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("别名不能为空"));
      } else {
        callback();
      }
    };
    const validatel7ServerSSHIp = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("IP不能为空"));
      } else if (
        !/^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/.test(
          value
        )
      ) {
        callback("IP格式不正确");
      } else {
        callback();
      }
    };
    const validatel7ServerSSHName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户不能为空"));
      } else {
        callback();
      }
    };
    const validatel7ServerSSHPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    const validatel7ServerSSHPort = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("端口不能为空"));
      } else if (
        !/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(
          value
        )
      ) {
        callback("端口号格式不正确");
      } else {
        callback();
      }
    };
    return {
      addMoment: true,
      l7_model_add: false,
      add_l7_form: {
        l7ServerId: "",
        l7ServerName: "",
        l7ServerSSHIp: "",
        l7ServerSSHName: "",
        l7ServerSSHPwd: "",
        l7ServerSSHPort: "",
        remark: "",
      },
      ruleValidate: {
        l7ServerId: [
          { required: true, message: "序列号不能为空", trigger: "blur" },
        ],
        l7ServerName: [
          { required: true, validator: validatel7ServerName, trigger: "blur" },
        ],
        l7ServerSSHIp: [
          { required: true, validator: validatel7ServerSSHIp, trigger: "blur" },
        ],
        l7ServerSSHName: [
          {
            required: true,
            validator: validatel7ServerSSHName,
            trigger: "blur",
          },
        ],
        l7ServerSSHPwd: [
          {
            required: true,
            validator: validatel7ServerSSHPwd,
            trigger: "blur",
          },
        ],
        l7ServerSSHPort: [
          {
            required: true,
            validator: validatel7ServerSSHPort,
            trigger: "blur",
          },
        ],
      },
      modal_loading: false,
      edit: false,
      searchString: "",
      timer: null,
    };
  },
  watch: {
    asideList(newVal, oldVal) {
      //console.log(...arguments);
    },
    l7_model_add(newVal, oldVal) {
      if (this.l7_model_add === false) {
        this.addMoment = true;
      }
    },
    // '$route.params.prewarn': {
    //   handler(newVal, oldVal) {
    //     if (newVal === undefined) {
    //       this.$router.replace(`/prewarn/${oldVal}`)
    //     }
    //   },
    //   deep: true
    // }
  },
  computed: {
    ...mapState({
      asideList: (state) => state.L7.asideList,
      l7ServerId: (state) => state.L7.activeAside.l7ServerId,
      listLoading: (state) => state.L7.listLoading,
    }),
    // 匹配搜索
    filterAside: function() {
      let arr = this.asideList;
      let searchString = this.searchString;

      if (!searchString) {
        return arr;
      }
      arr = arr.filter(function(item) {
        if (item.l7ServerName.indexOf(searchString) !== -1) {
          return item;
        }
      });

      // 返回过来后的数组
      return arr;
    },
  },
  methods: {
    ...mapActions(["getL7AsideList"]),
    ...mapMutations(["L7setActiveAside", "L7setAsideList"]),
    changeAside(item) {
      if (item.l7ServerId === this.l7ServerId) return;
      this.L7setActiveAside(item);
      this.$router.replace(`/prewarn/${item.l7ServerId}/overview`);
    },
    //展示Model框，数据重置
    addModel() {
      this.edit = false;
      (this.add_l7_form.l7ServerName = ""),
        (this.add_l7_form.l7ServerSSHIp = ""),
        (this.add_l7_form.l7ServerSSHName = ""),
        (this.add_l7_form.l7ServerSSHPwd = ""),
        (this.add_l7_form.l7ServerSSHPort = ""),
        (this.add_l7_form.remark = "");
      // console.log(this.add_l7_form)
      this.l7_model_add = true;
    },
    //添加实例配置信息
    addL7(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.modal_loading = true;
          addL7ServerInfo(this.add_l7_form)
            .then((res) => {
              // console.log(res);
              this.modal_loading = false;
              if (res.data.code === "success") {
                this.l7_model_add = false;
                this.getL7AsideList().then((res) => {
                  /* 第一次添加 */
                  if (this.asyncOk(res) && !this.$route.params.prewarn) {
                    this.$router.replace(
                      `/prewarn/${this.l7ServerId}/overview`
                    );
                  }
                });
              } else {
                this.$Message.error(`${res.data.result}`);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    //删除实例配置信息
    async delL7ServerInfo(code) {
      this.$Modal.confirm({
        title: "提示",
        content: "<p>确定要删除这条吗？删除后该设备信息将会丢失！</p>",
        loading: true,
        onOk: async () => {
          let res = await delL7ServerInfo({ l7ServerId: code });
          this.$Modal.remove();
          this.l7_model_add = false;
          if (this.asyncOk(res)) {
            this.$Message.success("删除成功！");
            this.getL7AsideList().then((res) => {
              if (this.asyncOk(res) && !res.data.result.length) {
                this.$router.push(`/prewarn`);
              }
              if (code === this.$route.params.prewarn) {
                this.$router.replace(`/prewarn/${this.l7ServerId}/overview`);
              }
            });
          } else {
            this.$Message.error("删除失败！");
          }
        },
      });
    },
    //修改实例配置信息
    async updL7ServerInfo(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.modal_loading = true;
          updL7ServerInfo(this.add_l7_form)
            .then((res) => {
              //console.log(res);
              this.modal_loading = false;
              if (res.data.code === "success") {
                this.l7_model_add = false;
                this.$Message.success("修改成功");
                this.getL7AsideList().then((res) => {
                  if (res.data.code === "success") {
                    /* if (this.asideList.length){
                      this.$router.replace(`/L7/${this.asideList[0].app_service_name}`);
                    }*/
                  }
                });
              } else {
                this.$Message.error(`${res.data.result}`);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    //展示Model框，展示当前实例的数据
    editModel(item) {
      console.log(item);
      this.edit = true;
      this.add_l7_form.l7ServerId = item.l7ServerId;
      this.add_l7_form.l7ServerName = item.l7ServerName;
      this.add_l7_form.l7ServerSSHIp = item.l7ServerSSHIp;
      this.add_l7_form.l7ServerSSHName = item.l7ServerSSHName;
      this.add_l7_form.l7ServerSSHPwd = item.l7ServerSSHPwd;
      this.add_l7_form.l7ServerSSHPort = item.l7ServerSSHPort;
      this.addMoment = false;
      this.l7_model_add = true;
    },
  },
  created() {
    this.getL7AsideList().then((res) => {
      if (this.asyncOk(res) && res.data.result.length) {
        if (!this.$route.params.prewarn) {
          this.$router.replace(`/prewarn/${this.l7ServerId}/overview`);
        } else {
          this.asideList.map((item) => {
            if (item.l7ServerId === this.$route.params.prewarn) {
              this.L7setActiveAside(item);
            }
          });
        }
      }
    });
  },
  mounted() {
    this.timer = setInterval(() => {
      selL7ServerInfoAll()
        .then((res) => {
          if (this.asyncOk(res)) {
            this.L7setAsideList(res.data.result || []);
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    }, 1000 * 60);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="less" scoped>
@import "aside";
</style>
