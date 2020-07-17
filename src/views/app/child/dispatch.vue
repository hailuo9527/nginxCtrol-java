<template>
  <div class="dispatch">
    <div class="table-wrap">

      <div class="table">
        <Table stripe  :loading="loading" max-height="500" border :columns="columns" :data="dispatch.data">
          <template slot-scope="{ row }" slot="upstream_request">{{row.upstream_request || '无'}}</template>
          <template slot-scope="{ row, index }" slot="action">
            <Button
                    type="warning"
                    size="small"
                    style="margin-right: 5px"
                    @click="modify(row, index)"
            >修改</Button
            >
          </template>
        </Table>
        <!--<Card :dis-hover="true">

        </Card>-->
        <div class="advanced" @click="showAdvance = !showAdvance" :class="{active: showAdvance}">高级<Icon class="icon" size="20" type="md-arrow-dropdown" /></div>
        <transition name="fade">

          <div v-show="showAdvance">

            <Table stripe  :loading="advanceloading" max-height="500" border :columns="advanceColumns" :data="advanceData">
              <div slot="header" style="text-align: right">
                <Button
                        type="info"
                        style="margin-right: 5px"
                        @click="newAdvance"
                >新建</Button>
              </div>
              <template slot-scope="{ row, index }" slot="dispatchParams">
                <div v-for="(item, i) in row.dispatchParams" style="display: flex; text-align: left">
                  <div style="flex-basis: 40%">
                    {{row.type}}: <span style="margin-left: 10px">{{item.param}}</span>
                  </div>
                  <div>
                    <span style="margin: 0 10px">
                      <Icon type="ios-arrow-round-forward" size="24" color="#000"/>
                    </span>
                  </div>
                  <div style="flex-basis: 50%">
                    <span style="margin-left: 10px;" class="important-text">{{item.upstream_name}}</span>
                  </div>

                </div>
              </template>
              <template slot-scope="{ row, index }" slot="upstreaParams">
                <div v-for="(item, i) in row.upstreaParams" :key="i" class="tree-box">
                  <div>
                    <div class="tree-name">
                      <span class="tree-status"></span> upstream: <span class="inner-text important-text">{{item.upstream_server_name}}</span>
                    </div>
                    <div class="tree-child">
                      <p v-for="(address, ii) in item.upstream_server_address" :key="ii">
                      <span class="child">
                        address: <span class="inner-text">{{address}}</span>
                      </span>

                      </p>
                    </div>
                  </div>

                </div>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <Button
                        type="warning"
                        size="small"
                        style="margin-right: 5px"
                        @click="advanceModify(row, index)"
                >修改</Button>
                <Poptip
                        confirm
                        :transfer="true"
                        title="确定要删除这一项吗?"
                        @on-ok="advanceRemove(row, index)">
                  <Button
                          type="error"
                          size="small"
                          style="margin-right: 5px"
                  >删除</Button>
                </Poptip>

              </template>

            </Table>
          </div>


        </transition>


      </div>
      <div class="save-bottom">
        <Button type="primary" :disabled="!(hasNotSavedAdvance || hasNotSavedDispatch)" :loading="saveLoading" @click="save"
          >保存</Button
        >
      </div>
    </div>
    <Modal
      v-model="modal"
      title="修改"
      :mask-closable="false"
      width="40"
    >
      <div slot="close" style="margin-top: 4px;margin-right: 4px;"><Icon type="md-close" style="color: #fff" size="22" @click="cancel()" /></div>
      <div class="modal_content" v-if="modal">
        <Form ref="formDynamic" :model="dispatch" label-position="left" :label-width="70">
          <FormItem
            label="修改权重"
            :rules="{ validator: validaterule }"
            :prop="'data.' + index + '.weight'"
          >
            <Input
              v-model="dispatch.data[index].weight"
              placeholder="权重，数值越大权重越大"
            ></Input>
          </FormItem>
          <FormItem label="备份">
               <i-switch v-model="dispatch.data[index].backup" size="large" @on-change="getStatus">
                <span slot="open">On</span>
                <span slot="close">Off</span>
            </i-switch>
          </FormItem>
          <FormItem label="禁止">
              <i-switch v-model="dispatch.data[index].down" size="large" @on-change="GetStatus">
                <span slot="open">On</span>
                <span slot="close">Off</span>
            </i-switch>
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
    <Modal v-model="advanceModal" fullscreen :title="modifyMode? '修改高级调度' : '新建高级调度'">
      <div>
        <Row class="advance-card">
             <Col span="12" offset="6" style="text-align: left">
               <Form hide-required-mark ref="formValidate" :model="advanceForm" :rules="advanceValidate" >
                 <Card class="card" :dis-hover="true">
                   <p slot="title">端口</p>
                   <FormItem
                           prop="listen_part"
                           :rules="{required: true, message: '不能为空，没有可用端口无法创建高级调度', trigger: 'blur'}" >
                     <Row>
                       <Col span="20" >
                         <Select v-model="advanceForm.listen_part">
                           <Option :value="item" v-for="(item, index) in portList" :key="index">{{item}}</Option>
                         </Select>
                       </Col>
                     </Row>
                   </FormItem>
                 </Card>
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
                   <p slot="title">条件</p>
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
                           <Input v-model="item.url">
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
                                 :rules="{required: true, message: '不能为空，没有服务器时请添加服务器', trigger: 'change'}"
                                 >
                           <Select v-model="item.upstream_name">
                             <Option v-if="i.upstream_server_name"  v-for="i in advanceForm.upstreaParams" :value="i.upstream_server_name" :key="i.upstream_server_name">{{ i.upstream_server_name }}</Option>
                           </Select>
                         </FormItem>
                       </Row>
                     </Col>
                     <Col span="2" offset="2">
                       <Icon type="ios-trash" class="remove-icon" size="20" v-if="advanceForm.dispatchParams.length>1" @click="handleRemove(index, advanceForm.dispatchParams)">Delete</Icon>
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
                   <p slot="title">条件</p>
                   <div v-if="advanceForm.type === 'ippart'">
                     <Row style="margin-bottom: 10px"  v-for="(item, index) in advanceForm.dispatchParams" :key="index">
                       <Col span="20" :class=" advanceForm.dispatchParams.length>1 ? 'dispatch-form-main': ''">
                         <Row class="flex-box">
                           <Col span="11">
                             <FormItem label="起始IP"
                                       :prop="'dispatchParams.' + index + '.startIp'"
                                       :rules="{validator: ipRule}">
                               <Input v-model.trim="item.startIp" placeholder="起始IP"></Input>
                             </FormItem>
                           </Col>
                           <Col span="2" style="text-align: center; color: #666">--</Col>
                           <Col span="11">
                             <FormItem label="结束IP"
                                       :prop="'dispatchParams.' + index + '.endIp'"
                                       :rules="{validator: ipRule}">
                               <Input v-model.trim="item.endIp" placeholder="结束IP"></Input>
                             </FormItem>
                           </Col>
                         </Row>
                         <FormItem
                                 label="服务器名"
                                 :rules="{required: true, message: '不能为空，没有服务器时请添加服务器', trigger: 'change'}"
                                 :prop="'dispatchParams.' + index + '.upstream_name'"
                                 >
                           <!--<Input v-model="item.upstream_name"></Input>-->
                           <Select v-model="item.upstream_name">
                             <Option v-if="i.upstream_server_name"  v-for="i in advanceForm.upstreaParams" :value="i.upstream_server_name" :key="i.upstream_server_name">{{ i.upstream_server_name }}</Option>
                           </Select>
                         </FormItem>
                        <!-- <FormItem
                                 label="服务器名"
                                 :prop="'dispatchParams.' + index + '.upstream_name'"
                                 :rules="{required: true, message: '不能为空', trigger: 'blur'}">
                           <Input v-model="item.upstream_name"></Input>
                         </FormItem>-->
                       </Col>
                       <Col span="2" offset="2">
                         <Icon type="ios-trash" class="remove-icon" size="20" v-if="advanceForm.dispatchParams.length>1" @click="handleRemove(index,advanceForm.dispatchParams )">Delete</Icon>
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
                   <p slot="title">条件</p>
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
                                   :rules="{required: true, message: '不能为空，没有服务器时请添加服务器', trigger: 'change'}"
                                   :prop="'dispatchParams.' + index + '.upstream_name'"
                                   >
                             <!--<Input v-model="item.upstream_name"></Input>-->
                             <Select v-model="item.upstream_name">
                               <Option v-if="i.upstream_server_name"  v-for="i in advanceForm.upstreaParams" :value="i.upstream_server_name" :key="i.upstream_server_name">{{ i.upstream_server_name }}</Option>
                             </Select>
                           </FormItem>
                         </Row>
                       </Col>
                       <Col span="2" offset="2">
                         <Icon type="ios-trash" class="remove-icon" size="20" v-if="advanceForm.dispatchParams.length>1" @click="handleRemove(index, advanceForm.upstreaParams)">Delete</Icon>
                       </Col>
                     </Row>
                   </div>

                 </Card>
                 <Card class="card" :dis-hover="true" v-if="advanceForm.type === 'request'">
                   <p slot="title">条件</p>
                   <div>
                     <Row v-for="(item, index) in advanceForm.dispatchParams"
                          :key="index"
                          style="margin-bottom: 10px">
                       <Col span="20" :class=" advanceForm.dispatchParams.length>1 ? 'dispatch-form-main': ''">
                         <Row>
                           <FormItem
                                   label="REQUEST"
                                   :prop="'dispatchParams.' + index + '.param'"
                                   :rules="{required: true, message: '不能为空，没有服务器时请添加服务器', trigger: 'change'}">
                             <Input v-model="item.param"></Input>
                           </FormItem>
                           <FormItem
                                   label="服务器名"
                                   :prop="'dispatchParams.' + index + '.upstream_name'"
                                   >
                             <!--<Input v-model="item.upstream_name"></Input>-->
                             <Select v-model="item.upstream_name">
                               <Option v-if="i.upstream_server_name" v-for="i in advanceForm.upstreaParams" :value="i.upstream_server_name" :key="i.upstream_server_name">{{ i.upstream_server_name }}</Option>
                             </Select>
                           </FormItem>

                         </Row>
                       </Col>
                       <Col span="2" offset="2">
                         <Icon type="ios-trash" class="remove-icon" size="20" v-if="advanceForm.dispatchParams.length>1" @click="handleRemove(index, advanceForm.upstreaParams)">Delete</Icon>
                       </Col>
                     </Row>
                   </div>
                 </Card>

                 <Card :dis-hover="true" >
                   <p slot="title">UPSTREAM</p>
                   <Row
                           style="margin-bottom: 10px"
                           v-for="(item, index) in advanceForm.upstreaParams"
                           :key="index"
                   >

                     <Row class="flex-box bg-gray">
                       <Col span="20" :class=" advanceForm.upstreaParams.length>1 ? 'dispatch-form-main': ''">
                         <Row style="margin-bottom: 20px">
                           <FormItem label="命名" :prop="'upstreaParams.' + index + '.upstream_server_name'"
                                     :rules="{required: true, message: '不能为空', trigger: 'blur'}">
                             <Input type="text" v-model.trim="item.upstream_server_name" placeholder="命名" ></Input>
                           </FormItem>
                         </Row>

                         <Row style="flex: 1; flex-basis: 30%">
                           <FormItem label="地址" :prop="'upstreaParams.' + index + '.upstream_server_address_input'"
                                     :rules="{validator: address}">
                             <Input type="text"
                                    @on-blur="addDomainName(index, item.upstream_server_address_input)"
                                    @on-enter="addDomainName(index, item.upstream_server_address_input)"
                                    v-model.trim="item.upstream_server_address_input" placeholder="服务器地址">
                             </Input>
                           </FormItem>

                         </Row>
                         <Row>
                           <Button  icon="md-close" class="tag"
                                    :key="i"
                                    v-if="item"
                                    @click="removeTag(index, i)"
                                    v-for="(item, i) in advanceForm.upstreaParams[index].upstream_server_address">{{item}}</Button>
                         </Row>

                       </Col>
                       <Col span="2" offset="2">
                         <Icon type="ios-trash" class="remove-icon" size="20" v-if="advanceForm.upstreaParams.length>1" @click="handleRemove(index, advanceForm.upstreaParams)">Delete</Icon>
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
      </div>
      <div slot="footer">
        <Button @click="advanceModal = false">取消</Button>
        <Button type="primary" @click="checkAdvanceForm">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {ngxDispatch, selAppDispatch, selNgxDispatch, updAppWeight, getListenPart, delDisPatchConfigFile} from "@/api/app";
  import {mapActions, mapMutations, mapState} from "vuex";
  import VeTree from 'v-charts/lib/tree.common'

  export default {
  name: "dispatch",
  components: {
    VeTree
  },
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
      let index = rule.field.split('.')[1]
      if(!value){
        if(!this.advanceForm.upstreaParams[index].upstream_server_address.length){
          callback(new Error('至少添加一条服务器地址'))
        }
        callback()
      }else {
        if ( !this.ipAndPort.test(value)){
          callback(new Error("地址格式错误"));
        }else{
          callback()
        }
      }
    }
    this.ipRule = (rule, value, callback) => {

      if (value){
        let ip = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
        if(ip.test(value)){
          callback()
        }else{
          callback(new Error('IP格式错误'))
        }
      }else{
        callback(new Error('不能为空'))
      }

    }
    return {
      loading: false,
      columns: [
        {
            title: "服务群组名称",
            key: "upstream_name",
            align: 'center'
        },
        {
          title: "IP",
          key: "upstream_server",
          align: 'center'
        },
        {
          title: "流量",
          slot: "upstream_request",
          align: 'center'
        },
        {
          title: "权重",
          key: "weight",
          align: 'center'
        },
        {
            title: "备份",
            key: "backup",
            align: "center"
        },
        {
            title: "禁止",
            key: "down",
            align: "center"
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
      showAdvance: false,
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
      advanceValidate: {},
      advanceloading: false,
      advanceColumns: [
        {
          title: "端口",
          key: "listen_part",
          align: 'center'
        },
        {
          title: "类型",
          key: "type",
          align: 'center'
        },
        {
          title: "条件",
          slot: "dispatchParams",
          align: 'center'
        },
        {
          title: 'upstream',
          slot: 'upstreaParams',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      advanceData: [],
      advanceModal: false,
      portList: [],
      modifyMode: false, // 修改/新建 高级调度，默认新建
      hasNotSavedAdvance: false,
      hasNotSavedDispatch: false,
      activeAdvanceIndex: 0, // 当前修改的是哪一项
      backupStatus: "",
      downStatus: ""
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
      this.index = index;
      this.weights = row.weight
      this.backupStatus = row.backup
      this.downStatus = row.down
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
    /* 保存基础调度 */
    async saveDispatch() {
      this.dispatch.data.map((item) => {
        item.app_service_id = this.$route.params.app;
      });
      let res = await updAppWeight(this.dispatch.data);
      if (res.data.code === "success") {
        let json = this.activeAside;
        json.appDefaultPublishConfList = this.dispatch.data;
        this.getAppAsideList('update');
        this.appSetActiveAside(json);
        this.GetselAppDispatch();
        this.$Message.success(`基础调度${res.data.result}`);
      } else {
        this.$Message.error(`基础调度${res.data.result}`);
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.modal = false;
          this.hasNotSavedDispatch = true
        } else {
          this.modal = true;
          this.$Message.error("Fail!");
        }
      });
    },
    cancel() {
        this.modal = false
        this.dispatch.data[this.index].weight = this.weights
        this.dispatch.data[this.index].backup = this.backupStatus
        this.dispatch.data[this.index].down = this.downStatus
    },
    //备份为true时禁止不能为true
    getStatus(status) {
        if (status&&this.dispatch.data[this.index].down) {
            this.dispatch.data[this.index].down = false
        }
    },
    //禁止为true时备份不能为true
    GetStatus(status) {
        if (status&&this.dispatch.data[this.index].backup) {
            this.dispatch.data[this.index].backup = false
        }
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
      if (!this.cacheDispatch.length) return
      if (value !== this.cacheDispatch[this.activeAdvanceIndex].type){
        this.advanceForm.dispatchParams = []
        this.advanceForm.dispatchParams.push({
          param: '',
          upstream_name: ''
        })
      }else {
        this.advanceForm.dispatchParams = this.cacheDispatch[this.activeAdvanceIndex].dispatchParams
      }

    },
    /* 获取高级调度 */
    async selNgxDispatch() {
      let res = await selNgxDispatch({app_service_id: this.$route.params.app})
      //console.log(res)
      if (this.asyncOk(res)) {
        this.cacheDispatch = this.copyJson(res.data.result)
        this.advanceData = res.data.result || []
      }
    },
    /* 获取可用端口 */
    async getListenPart() {
      let res = await getListenPart({app_service_id: this.$route.params.app})
      if (this.asyncOk(res)) {
        this.portList = res.data.result || []
      }
    },
    /* 新建高级调度 */
    newAdvance() {
      this.advanceModal = true
      this.modifyMode = false
      this.getListenPart()
      this.advanceForm = {

        type: 'url',
        dispatchParams: [
          {
            param: '',
            upstream_name: ''
          }
        ],
        listen_part: '',
        upstreaParams: [
          {
            upstream_server_address: [],
            upstream_server_name: ""
          }
        ]
      }
    },
    /* 修改高级调度 */
    advanceModify(row, index){
      this.modifyMode = true
      this.advanceModal = true
      this.getListenPart()
      this.advanceForm = row
      this.activeAdvanceIndex = index
    },
    /* 保存高级调度 */
    async advanceDispatch(){
      // this.saveLoading = true;
      let res = await ngxDispatch(this.advanceData, {app_service_id: this.$route.params.app})
      // this.saveLoading = false;
      if(this.asyncOk(res)){
        this.$Message.success('高级调度保存成功');
        this.cacheDispatch = this.advanceForm
      }else {
        this.$Message.error(`高级调度${res.data.result}`);
      }

    },

    /* 删除高级调度 */
    advanceRemove(row, index){
      this.advanceData.splice(index, 1)
      this.hasNotSavedAdvance = true
    },
    /* 校验高级调度表单 */
    checkAdvanceForm() {
      this.$refs['formValidate'].validate((valid) => {
        if (valid){
          let json = {...this.advanceForm}
          switch (json.type) {
            case 'url':
              json.dispatchParams.map(item => {
                item.param = item.urlPrepend || '' + item.url
              })
              break
            case 'ippart':
              json.dispatchParams.map(item => {
                item.param = item.startIp + '-' + item.endIp
              })
              break
            case 'cookie':
              json.dispatchParams.map(item => {
                item.param = item.key + ',' + item.cookiePrepend || '' + item.cookie
              })
              break
            case 'request':
              break
            default: break
          }
          json.app_service_id = this.$route.params.app
          this.modifyMode
            ? this.advanceData[this.activeAdvanceIndex] = json
            : this.advanceData.push(json)
          this.advanceModal = false
          this.hasNotSavedAdvance = true
        }else {
          this.$Message.error('请检查输入是否正确');
        }
      })
    },
    /* 保存 */
    async save() {
        if (this.activeAside.is_sync) {
            this.saveLoading = true
            if(this.hasNotSavedDispatch){
                await this.saveDispatch()
                this.hasNotSavedDispatch = false
            }

            else if(this.showAdvance && this.hasNotSavedAdvance){
                await this.advanceDispatch()
                this.hasNotSavedAdvance = false
            }

            this.saveLoading = false
        } else {
            this.$Message.error({content: "状态未同步,无法保存", duration: 3})
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
    }
  },
  mounted() {
    this.selNgxDispatch()
    this.GetselAppDispatch();
  },
  beforeRouteLeave(to, from, next) {
    if (this.hasNotSavedAdvance || this.hasNotSavedDispatch) {
      let res = window.confirm('有未保存的改动，是否确定要离开？')
      res ? next() : next(false)
    } else{
      next()
    }
  }
};
</script>
<style lang="less" scoped>
.dispatch {
  .table-wrap {
    width: 100%;
    height: calc(100% - 75px);
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
    border-right: 1px solid @green;
    padding-right: 20px;
  }
  .card{
    margin-bottom: 20px;
  }
  .remove-icon{
    cursor: pointer;
    opacity: .6;
    transition: all .3s;
    &:hover{
      opacity: 1;
    }
  }
  .advance-card /deep/.ivu-card{
    box-shadow: 0 1px 6px rgba(0,0,0,.2);
  }
  /deep/.ivu-card-head{
    background: #f8f8f8;
  }
  .tree-box{
    margin: 10px -18px;
    border-bottom: 1px solid #e8eaec;
    display: flex;
    justify-content: center;
    text-align: left;
    &:last-child{
      border-bottom: none;
    }
    .tree-name{
      margin-left: -10px;

    }
    .tree-status{
      display: inline-block;
      width: 8px;
      height: 8px;
      background: @green;
      border-radius: 50%;
    }
    .tree-child{
      .child{
        padding-left: 10px;
        position: relative;
        &:after{
          content: '';
          display: block;
          width: 12px;
          position: absolute;
          top: -11px;
          bottom: 50%;
          left: -7px;
          margin-bottom: -2px;
          border-width: 1px;
          border-style: solid;
          border-color: transparent transparent #01c864 #01c864;
        }
      }

    }
    .inner-text{
      margin: 0 10px;
    }
  }
  .important-text{
    color: @green;
  }
</style>
