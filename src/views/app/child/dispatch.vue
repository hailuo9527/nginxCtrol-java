<template>
  <div class="dispatch">
    <div class="table-wrap">

      <div class="table">

        <Card >
          <Table :loading="loading" :columns="columns" :data="dispatch.data">
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
        </Card>
        <div class="advanced" @click="showAdvance = !showAdvance" :class="{active: showAdvance}">高级<Icon class="icon" size="20" type="md-arrow-dropdown" /></div>
        <transition name="fade">

          <Card v-if="showAdvance" :dis-hover="true">
            <Row>
              <Col span="10" offset="7" style="text-align: left">
                <Form hide-required-mark ref="formValidate" :model="advanceForm" :rules="advanceValidate" >
                  <Card class="card" :dis-hover="true">
                    <p slot="title">类型</p>
                    <FormItem  >
                      <Row>
                        <Col span="20" >
                          <Select v-model="advanceForm.type" @on-change="typeChange">
                            <Option value="url">URL</Option>
                            <Option value="ippart">IP-PART</Option>
                            <Option value="cookie">COOKIE</Option>
                            <Option value="request">REQUEST</Option>
                          </Select>
                        </Col>
                      </Row>
                    </FormItem>
                  </Card>

                  <Card class="card" :dis-hover="true"  v-if="advanceForm.type === 'url'">
                    <p slot="title">URL</p>
                    <Row  v-for="(item, index) in advanceForm.dispatchParams"
                          :key="index"
                          style="margin-bottom: 10px"
                    >
                      <Col span="20" :class=" advanceForm.dispatchParams.length>1 ? 'dispatch-form-main': ''">
                        <Row>
                          <FormItem
                                  label="URL"
                                  :prop="'dispatchParams.' + index + '.url'"
                                    :rules="{required: true, message: '不能为空', trigger: 'blur'}">
                            <Input v-model="item.param">
                              <Select v-model="item.urlPrepend" slot="prepend" style="width: 100px">
                                <Option value="^~">prefix</Option>
                                <Option value="=">exact</Option>
                                <Option value="~">regex</Option>
                                <Option value="~*">regex(case-insensitive)</Option>
                              </Select>
                            </Input>
                          </FormItem>
                          <FormItem
                                  label="服务器名"
                                  :prop="'dispatchParams.' + index + '.upstream_name'"
                                    :rules="{required: true, message: '不能为空', trigger: 'blur'}">
                            <Input v-model="item.upstream_name"></Input>
                          </FormItem>
                        </Row>
                      </Col>
                      <Col span="2" offset="2">
                        <Icon type="ios-trash" size="20" v-if="advanceForm.dispatchParams.length>1" @click="handleRemove(index, advanceForm.upstreaParams)">Delete</Icon>
                      </Col>

                    </Row>
                    <FormItem>
                      <Row>
                        <Col span="12">
                          <Button type="dashed" long @click="handleAdd(1)" icon="md-add">添加</Button>
                        </Col>
                      </Row>
                    </FormItem>
                  </Card>
                  <Card class="card" :dis-hover="true" v-if="advanceForm.type === 'ippart'">
                    <p slot="title">IP-PART</p>
                    <div v-if="advanceForm.type === 'ippart'">
                      <Row style="margin-bottom: 10px"  v-for="(item, index) in advanceForm.dispatchParams" :key="index">
                        <Col span="20" :class=" advanceForm.dispatchParams.length>1 ? 'dispatch-form-main': ''">
                          <Row class="flex-box">
                            <Col span="11">
                              <FormItem label="起始IP"
                                        :prop="'dispatchParams.' + index + '.startIp'"
                                        :rules="{required: true, message: '不能为空', trigger: 'blur'}">
                                <Input v-model.trim="item.startIp" placeholder="起始IP"></Input>
                              </FormItem>
                            </Col>
                            <Col span="2" style="text-align: center; color: #666">--</Col>
                            <Col span="11">
                              <FormItem label="结束IP"
                                        :prop="'dispatchParams.' + index + '.endIp'"
                                        :rules="{required: true, message: '不能为空', trigger: 'blur'}">
                                <Input v-model.trim="item.endIp" placeholder="结束IP"></Input>
                              </FormItem>
                            </Col>
                          </Row>
                          <FormItem
                                  label="服务器名"
                                  :prop="'dispatchParams.' + index + '.upstream_name'"
                                  :rules="{required: true, message: '不能为空', trigger: 'blur'}">
                            <Input v-model="item.upstream_name"></Input>
                          </FormItem>
                        </Col>
                        <Col span="2" offset="2">
                          <Icon type="ios-trash" size="20" v-if="advanceForm.dispatchParams.length>1" @click="handleRemove(index,advanceForm.dispatchParams )">Delete</Icon>
                        </Col>
                      </Row>
                    </div>

                    <FormItem>
                      <Row>
                        <Col span="12">
                          <Button type="dashed" long @click="handleAdd(1)" icon="md-add">添加</Button>
                        </Col>
                      </Row>
                    </FormItem>
                  </Card>
                  <Card class="card" :dis-hover="true"  v-if="advanceForm.type === 'cookie'">
                    <p slot="title">COOKIE</p>
                    <div  v-if="advanceForm.type === 'cookie'">
                      <Row v-for="(item, index) in advanceForm.dispatchParams"
                           :key="index"
                           style="margin-bottom: 10px">
                        <Col span="20" :class=" advanceForm.dispatchParams.length>1 ? 'dispatch-form-main': ''">
                          <Row>
                            <FormItem
                                    label="KEY"
                                    :prop="'dispatchParams.' + index + '.key'"
                                    :rules="{required: true, message: '不能为空', trigger: 'blur'}">
                              <Input v-model="item.key"></Input>
                            </FormItem>
                            <FormItem
                                    label="VALUE"
                                    :prop="'dispatchParams.' + index + '.cookie'"
                                    :rules="{required: true, message: '不能为空', trigger: 'blur'}">
                              <Input v-model="item.cookie">
                                <Select v-model="item.cookiePrepend" slot="prepend" style="width: 100px">
                                  <Option value="^~">prefix</Option>
                                  <Option value="=">exact</Option>
                                  <Option value="~">regex</Option>
                                  <Option value="~*">regex(case-insensitive)</Option>
                                </Select>
                              </Input>
                            </FormItem>
                            <FormItem
                                    label="服务器名"
                                    :prop="'dispatchParams.' + index + '.upstream_name'"
                                    :rules="{required: true, message: '不能为空', trigger: 'blur'}">
                              <Input v-model="item.upstream_name"></Input>
                            </FormItem>
                          </Row>
                        </Col>
                        <Col span="2" offset="2">
                          <Icon type="ios-trash" size="20" v-if="advanceForm.dispatchParams.length>1" @click="handleRemove(index, advanceForm.upstreaParams)">Delete</Icon>
                        </Col>
                      </Row>
                    </div>

                  </Card>
                  <Card class="card" :dis-hover="true" v-if="advanceForm.type === 'request'">
                    <p slot="title">REQUEST</p>
                    <div  v-if="advanceForm.type === 'request'">
                      <Row v-for="(item, index) in advanceForm.dispatchParams"
                           :key="index"
                           style="margin-bottom: 10px">
                        <Col span="20" :class=" advanceForm.dispatchParams.length>1 ? 'dispatch-form-main': ''">
                          <Row>
                            <FormItem
                                    label="REQUEST"
                                    :prop="'dispatchParams.' + index + '.param'"
                                    :rules="{required: true, message: '不能为空', trigger: 'blur'}">
                              <Input v-model="item.param"></Input>
                            </FormItem>
                            <FormItem
                                    label="服务器名"
                                    :prop="'dispatchParams.' + index + '.upstream_name'"
                                    :rules="{required: true, message: '不能为空', trigger: 'blur'}">
                              <Input v-model="item.upstream_name"></Input>
                            </FormItem>

                          </Row>
                        </Col>
                        <Col span="2" offset="2">
                          <Icon type="ios-trash" size="20" v-if="advanceForm.dispatchParams.length>1" @click="handleRemove(index, advanceForm.upstreaParams)">Delete</Icon>
                        </Col>
                      </Row>
                    </div>
                  </Card>

                  <Card :dis-hover="true" >
                    <p slot="title">服务器</p>
                    <Row
                            style="margin-bottom: 10px"
                            v-for="(item, index) in advanceForm.upstreaParams"
                            :key="index"
                    >

                      <Row class="flex-box bg-gray">
                        <Col span="20" :class=" advanceForm.upstreaParams.length>1 ? 'dispatch-form-main': ''">
                          <div style="margin-bottom: 20px">
                            <FormItem label="命名" :prop="'upstreaParams.' + index + '.upstream_server_name'"
                                      :rules="{required: true, message: '不能为空', trigger: 'blur'}">
                              <Input type="text" v-model.trim="item.upstream_server_name" placeholder="命名" ></Input>
                            </FormItem>
                          </div>

                          <div>
                            <Button  icon="md-close" class="tag"
                                     :key="i"
                                     v-if="item"
                                     @click="removeTag(index, i)"
                                     v-for="(item, i) in advanceForm.upstreaParams[index].upstream_server_address">{{item}}</Button>
                          </div>


                          <div style="flex: 1; flex-basis: 30%">
                            <FormItem label="地址" :prop="'upstreaParams.' + index + '.upstream_server_address_input'"

                                      :rules="{validator: address}">
                              <Input type="text"

                                     @on-blur="addDomainName(index, item.upstream_server_address_input)"
                                     @on-enter="addDomainName(index, item.upstream_server_address_input)"
                                     v-model.trim="item.upstream_server_address_input" placeholder="服务器地址">
                              </Input>
                            </FormItem>

                          </div>

                        </Col>
                        <Col span="2" offset="2">
                          <Icon type="ios-trash" size="20" v-if="advanceForm.upstreaParams.length>1" @click="handleRemove(index, advanceForm.upstreaParams)">Delete</Icon>
                        </Col>
                      </Row>
                    </Row>
                    <FormItem>
                      <Row>
                        <Col span="12">
                          <Button type="dashed" long @click="handleAdd(2)" icon="md-add">添加服务器</Button>
                        </Col>
                      </Row>
                    </FormItem>
                  </Card>

                </Form>
              </Col>
            </Row>

          </Card>
        </transition>


      </div>
      <div class="save-bottom">
        <Button type="primary" :loading="saveLoading" @click="save"
          >保存</Button
        >
      </div>
    </div>
    <Modal
      v-model="modal"
      title="修改权重"
      :closable="false"
      :mask-closable="false"
    >
      <div class="modal_content" v-if="modal">
        <Form ref="formDynamic" :model="dispatch">
          <FormItem
            :rules="{ validator: validaterule }"
            :prop="'data.' + index + '.weight'"
          >
            <Input
              v-model="dispatch.data[index].weight"
              placeholder="权重，数值越大权重越大"
            ></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="cancel()">取消</Button>
        <Button type="primary" @click="handleSubmit('formDynamic')"
          >确定</Button
        >
      </div>
    </Modal>
  </div>
</template>
<script>
import { selAppDispatch, updAppWeight, ngxDispatch, selNgxDispatch} from "@/api/app";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "dispatch",
  data() {
    this.validaterule = (rule, value, callback) => {
      let reg = /^\+?[1-9][0-9]*$/;
      if (value === "") {
        callback(new Error("权重不能为空"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入大于零的整数"));
      } else {
        callback();
      }
    };
    this.ipAndPort = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/

    this.address = (rule, value, callback) => {
      if(!value){
        callback()
      }else {
        if ( !this.ipAndPort.test(value)){
          callback(new Error("地址格式错误"));
        }
      }


    }
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
      dispatch: {
        data: [],
      },
      modal: false,
      form: {},
      ruleValidate: {},
      upstream_server: "",
      weight: "",
      upstream_request: "",
      index: 0,
      saveLoading: false,
      weights: '',
      showAdvance: true,
      cacheDispatch: {},
      advanceForm: {
        type: 'url',
        dispatchParams: [
          {
            param: '',
            upstream_name: ''
          }
        ],
        upstreaParams: [
          {
            upstream_server_address: [],
            upstream_server_name: ""
          }
        ]
      },
      advanceValidate: {
        name: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
      }
    };
  },
  computed: {
    ...mapState({
      activeAside: (state) => state.app.activeAside,
    }),
  },
  methods: {
    ...mapActions(["getAppAsideList"]),
    ...mapMutations(["appSetActiveAside", "appSetAsideList"]),
    modify(row, index) {
        // console.log(row);
      this.index = index;
      this.weights = row.weight
      this.modal = true;
      this.upstream_server = row.upstream_server;
      this.upstream_request = row.upstream_request;
    },

    async GetselAppDispatch() {
      this.loading = true;
      let res = await selAppDispatch({
        app_server_id: this.$route.params.app,
      });
      //   console.log(res);
      if (res.data.code === "success") {
        this.loading = false;
        this.dispatch.data = res.data.result;
      } else {
        this.loading = false;
      }
    },
    async save() {
      this.saveLoading = true;
      this.dispatch.data.map((item) => {
        item.app_service_id = this.$route.params.app;
      });
      let res = await updAppWeight(this.dispatch.data);
      this.saveLoading = false;
      if (res.data.code === "success") {
        this.$Message.info(`${res.data.result}`);
        let json = this.activeAside;
        json.appDefaultPublishConfList = this.dispatch.data;
        this.getAppAsideList('update');
        this.appSetActiveAside(json);
        this.GetselAppDispatch();
        /* 修改app*/
      } else {
        this.$Message.error(`${res.data.result}`);
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.modal = false;
        } else {
          this.modal = true;
          this.$Message.error("Fail!");
        }
      });
    },
    cancel() {
        this.modal = false
        this.dispatch.data[this.index].weight = this.weights
    },
    /* 添加 */
    handleAdd (target) {
      switch (target) {
        case 1:
          this.advanceForm.dispatchParams.push({
            param: '',
            upstream_name: ''
          })
          break
        case 2:
          this.advanceForm.upstreaParams.push(
            {
              upstream_server_address: [],
              upstream_server_name: ""
            }
          )
          break
        default: break
        }
    },
    handleRemove(index, target) {
      target.splice(index, 1)
    },
    removeTag(index, i) {
      let arr = this.advanceForm.upstreaParams[index].upstream_server_address
      arr.splice(i, 1)
    },
    addDomainName(index, str) {
      if (!this.ipAndPort.test(str)) return
      this.advanceForm.upstreaParams[index].upstream_server_address.push(str)
      this.advanceForm.upstreaParams[index].upstream_server_address_input = ''
    },
    typeChange(value) {
      if (value !== this.cacheDispatch.type){
        this.advanceForm.dispatchParams = []
        this.advanceForm.dispatchParams.push({
          param: '',
          upstream_name: ''
        })
      }else {
        this.advanceForm.dispatchParams = this.cacheDispatch.dispatchParams
      }

    },
    /* 获取高级调度 */
    async selNgxDispatch() {
      let res = await selNgxDispatch()
      if (this.asyncOk(res)) {
        // this.cacheDispatch = this.copyJson(res.data.result)
        // this.advanceForm = res.data.result
      }
    },
    /* 配置高级调度 */
    ngxDispatch(fn) {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!');
          fn()


        } else {
          this.$Message.error('Fail!');
        }
      })
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
      overflow: auto;
      margin-top: 15px;
      .advanced{
        padding: 15px 0;
        text-align: center;
        cursor: pointer;
        .icon{
          transition: all .3s;
        }

        &.active{
          .icon{
            transform: rotateX(180deg);
          }


        }
      }
    }
    .save-bottom {
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
  /deep/.ivu-form .ivu-form-item-label{
    text-align: left;
  }
  .flex-box{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    &.bg-gray{

    }
  }
.tag{
  margin-right: 10px;
  display: inline-block;
  padding: 5px 10px;
  background: #f3f3f3;
  color: #333;
  margin-bottom: 10px;
}
  .dispatch-form-main{
    border-right: 1px solid #eee;
    padding-right: 20px;
  }
  .card{
    margin-bottom: 20px;
  }
</style>
