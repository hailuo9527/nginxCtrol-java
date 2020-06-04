<template>
  <div class="l7_config_layout">
    <div class="l7_config_column column_header">
      <div class="header_item">
        main
        <PopTip content="" style="margin-left: 5px;" placement="bottom"></PopTip>
        <!-- <Icon type="md-add" size="26" color="#333" class="add_handler" v-if="!$route.params.L7" @click="editMain(0, false)"/> -->
      </div>
    </div>
    <div class="l7_config_column column_header">
      <div class="header_item">
        server
        <PopTip content="Select Instances system或tagVirtual servers是传入请求的入口点。虚拟服务器定义域名和端口、NGINX路由请求的方式以及安全策略。NGINX配置中可以定义许多虚拟服务器。"
                style="margin-left: 5px;" placement="bottom"></PopTip>
        <!--<Dropdown trigger="click"  :transfer="true" class="add_handler" v-if="$route.params.configName" @on-click="dropdownHandler" >
            <Icon type="md-add" size="26" color="#333" class="add"/>
            <DropdownMenu slot="list" >
              &lt;!&ndash;  <DropdownItem name="1">Load Balancer Wizard</DropdownItem>&ndash;&gt;
                <DropdownItem name="2" divided>New Virtual Server</DropdownItem>
            </DropdownMenu>
        </Dropdown>-->
        <Icon type="md-add" size="26" color="#333" class="add_handler" v-if="!$route.params.L7"
              @click="editVirtualServer(0, false)"/>
      </div>


    </div>
    <!--header tab-->
    <div class="l7_config_column column_header">
      <div class="header_item">
        locations
        <PopTip content="Locations描述NGINX中的请求路由。Locations匹配导致对特定请求使用代理/负载平衡，或直接为内容提供服务。Locations属于虚拟服务器层次结构。可以为单个虚拟服务器定义多个Locations/routes。"
                style="margin-left: 5px;" placement="bottom"></PopTip>
        <Icon type="md-add" size="26" color="#333" class="add_handler" v-if="!$route.params.L7"
              @click="editLocation(0,false)"/>
      </div>
    </div>
    <div class="l7_config_column column_header">
      <div class="header_item">
        upstream
        <PopTip content="Upstream Groups是用于代理/负载平衡的服务器池。Upstream Groups包含Upstream Servers定义和负载平衡选项。Upstream Groups可以在跨多个虚拟服务器的任何location/route中使用。"
                style="margin-left: 5px;" placement="bottom"></PopTip>
        <Icon type="md-add" size="26" color="#333" class="add_handler" v-if="!$route.params.L7"
              @click="editUpstream(0, false)"/>
      </div>
    </div>
    <div class="l7_config_column column_header">
      <div class="header_item">
        server(upstream)
        <PopTip content="Upstream Servers是NGINX负载均衡器发送流量的应用程序后端。服务器定义属于Upstream Groups。Upstream Servers可以在许多Upstream Groups中定义。"
                style="margin-left: 5px;" placement="bottom"></PopTip>
        <!--<Icon type="md-add" size="26" color="#333" class="add_handler"/>-->
      </div>
    </div>
    <!--header tab end-->

    <!-- main -->
    <div class="l7_config_column column_body ">
      <div class="main">
        <div class="main_item">
          <Icon type="md-create" class="ctrl-list-item__edit" @click="editMain(0, false)"/>
          <div><span>worker_rlimit_nofile:</span> <span class="main-value">{{config.work_rlimit_nofile ==null?'null':config.work_rlimit_nofile}}</span>
          </div>
          <div><span>worker_connections:</span> <span class="main-value">{{config.worker_connections == null?'null':config.worker_connections}}</span>
          </div>
          <div><span>worker_processes:</span> <span class="main-value">{{config.worker_processes==null?'null':config.worker_processes}}</span>
          </div>
        </div>
      </div>
    </div>

    <!--virtual servers-->
    <div class="l7_config_column column_body column_body_servers">
      <div class="servers">
        <div class="server_item" @click="selectVirtualServer(index)"
             :class="virtualServerIndex === index? 'selected': ''"
             v-for="(item, index) in virtualServerGroup">
          <Icon type="md-create" class="ctrl-list-item__edit" @click="editVirtualServer(index,true)"/>
          <h4 class="ctrl-server__server-name">
            <span v-if="item.domain_name!==null">{{ item.domain_name.split(',')[0] || '*'}}</span>
            <span v-else>{{ item.domain_name=''}}</span>
          </h4>
          <div class="ctrl-server__protocols">
            http
            <span v-for="(http, index) in item.ngcListenings" v-if="http.http2_state === 'on'">
                               http2
                            </span>
          </div>
          <div>
                            <span class="ctrl-server__port" v-for="(port, index) in item.ngcListenings">
                                :{{port.listening_address_port || '80'}}
                            </span>
          </div>
        </div>


      </div>
    </div>
    <!--location-->
    <div class="l7_config_column column_body" ref="locations">
      <div class="locations">
        <div ref="start" class="ctrl-list-item "
             @click="selectLocation(index)"
             v-for="(item, index) in ngcLocationsGroup"
             :key="index"
             :class="{ 'list-selected' : activeLocationIndex === index, 'line-selected': item.isLine && activeLocationIndex === null }"
        >
                        <span class="ctrl-location "
                              :class="item.url_path_route_value === '/' ? 'ctrl-location_default' : ''"
                              @click="locationsIndex=index">
                        <span>{{item.url_path_route_value|| '无'}}</span>
                        <span class="ctrl-location__label">{{item.url_path_route_value === '/' ? 'default route': ''}}</span>
                        </span>
          <Icon type="md-create" class="ctrl-list-item__edit" @click="editLocation(index,true)"/>
        </div>


      </div>
    </div>
    <!--upstream groups-->
    <div class="l7_config_column column_body column_body_upstream" ref="upstreamGroup">
      <div class="upstream-groups">
        <div
                v-if="config.ngcUpstreamGroups.length"
                v-for="(item, key) in config.ngcUpstreamGroups"
                :class="{'list-selected':upstreamIndex === key , 'line-selected': item.isLine && activeLocationIndex!== null}"
                @click="selectUpstream(key)"
                class="ctrl-list-item ctrl-list-item_corners ">
                        <span ref="end" class="ctrl-list-item__corner-left">
                            <span class="ctrl-list-item__corner-inner"></span>
                        </span>
          <span>{{item.group_name}}</span>
          <Icon type="md-create" class="ctrl-list-item__edit" @click="editUpstream(key, true)"/>
          <span ref="start1" class="ctrl-list-item__corner-right">
                            <span class="ctrl-list-item__corner-inner"></span>
                        </span>
        </div>

      </div>
    </div>
    <!--upstream servers-->
    <div class="l7_config_column column_body column_body_upstream" ref="upstreamServers">
      <div class="upstream-groups">
        <div
                v-for="(item, end) in ngcUpstreamServers"
                :class="upstreamServerIndex === end? 'list-selected':'' "
                @click="selectUpServer(end)"
                class="ctrl-list-item ctrl-list-item_corners default ">
                    <span ref="end1" class="ctrl-list-item__corner-left">
                        <span class="ctrl-list-item__corner-inner"></span>
                    </span>
          <!--<span>{{item.upstream_servers_name}}</span>-->
          <span>{{item.upstream_servers_name}}</span>
          <!--<Icon type="md-create" class="ctrl-list-item__edit"  />-->
          <span class="ctrl-list-item__corner-right">
                        <span class="ctrl-list-item__corner-inner"></span>
                    </span>
        </div>

      </div>


    </div>

    <!--loading-->
    <div class="loading-wrap "
         v-if="loading">
      <Loading/>
    </div>
    <!-- 关系连线 canvas -->
    <div class="ctrl-relations-canvas" ref="canvas">
      <canvas width="2000" height="2000" id="canvas" style="width: 2000px; height: 2000px;"></canvas>
    </div>
    <!-- 页脚按钮 -->

    <div class="config-page__bottom-buttons" v-if="!($route.params.app || $route.params.L7)">
      <div class="config-page__bottom-buttons_container">
        <button type="button"
                @click="previewConfig"
                :disabled="!configName"
                class="config-page__add-new ae-button__black ae-button__button ">
          <span class="ae-button__label">预览</span>
        </button>

        <button :disabled="!$route.params.configName"
                @click="copyAndSaveModel = true"
                type="button" class="config-page__add-new ae-button__black ae-button__button"
        >
          <span class="ae-button__label">复制并保存为...</span>
          <Modal
                  v-model="copyAndSaveModel"
                  :loading="copyAndSaveModelLoading"
                  width="790"
                  title="复制一个新的配置文件"
                  @on-ok="copyAndSaveConfig"
          >
            <div class="copy-save-model">

              <div class="copy-save-model-title">输入想要保存的配置文件名</div>
              <Input type="text" v-model="copyConfigName" placeholder="配置名"></Input>

            </div>

          </Modal>
        </button>
        <button
                :disabled="!canSaveConfig"
                type="button"
                @click="submitConfig"
                class="config-page__add-new ae-button__green ae-button__button" title="Save configuration">
          <span class="ae-button__label" :class="submitLoading? 'loop': ''">{{submitLoading? '正在保存': '保存'}}</span>
        </button>
      </div>
    </div>

    <div class="instance-actions-container" v-else>
      <div class="instance-actions-container__info">
        <div class="tip">
          <router-link :to="{name: 'nginxConfig',
                                            params:{configName: config.config_name,},
                                            query: {nginx_conf_id: config.nginx_conf_id}}">
            修改配置
          </router-link>
        </div>
        <!--<div class="tip">
            <span v-if="!config.nginx_conf_id">没有关联任何配置</span>
            <span v-else>关联配置：
             <router-link :to="{name: 'nginxConfig',
                                    params:{configName: config.config_name,},
                                    query: {nginx_conf_id: config.nginx_conf_id}}">
                                        {{config.config_name}}
              </router-link>
            </span>
        </div>-->
        <!-- <div class="tip">
             <span v-if="!relevanceApp">没有关联任何APP</span>
             <span v-else>关联APP：
              <router-link :to="`/app/${relevanceApp.app_service_id}/overview`">

                                         {{relevanceApp.app_service_name}}
               </router-link>
             </span>
         </div>-->

      </div>

      <div class="instance-actions-container__links">
        <router-link class="instance-actions-container__link" to="/nginxConfigs">查看全部配置</router-link>
        <div class="instance-actions-container__separator"></div>
        <button type="button"
                @click="previewConfig"
                class="instance-actions-container__btn ae-button__black ae-button__button">
          <span class="ae-button__label">预览</span>
        </button>
        <button type="button"
                @click="$router.push('/newNginxConfig')"
                class="instance-actions-container__btn ae-button__green ae-button__button">
          <span class="ae-button__label">新建配置</span>
        </button>
      </div>
    </div>
    <Drawer title="配置预览" v-model="previewOpen" width="50%">
      <!--<pre contenteditable="true">{{previewData}}</pre>-->
      <div class="preview-wrap">
        <div class="preview-content">
          <div :contenteditable="configEditable" class="edit-area" v-html="previewData" ref="editConfig" >
        </div>

        </div>
        <div class="preview-opera" v-if="this.$route.params.configName">
          <Button @click="configEditable = true" type="info" v-if="!configEditable" >编辑</Button>

          <Button v-if="configEditable" @click="configEditable = false" class="edit-button">取消</Button>
          <Button v-if="configEditable" @click="saveEditedConfig" type="primary" >保存</Button>
        </div>
      </div>
    </Drawer>
    <!-- 页脚按钮end -->
    <!-- 功能弹窗 -->
    <LoadBalancerModal :show="domainModal" @change="modalVisibleChange" @complete="domainModal = false"/>
    <VirtualServerModal
            :show="serverModal"
            :modify="modify"
            :data="ngcVirtualServers"
            @removeConfig="removeConfig"
            @submit="addVirtualServer"
            @change="modalVisibleChange"/>
    <LocationModal
            :show="locationModal"
            :modify="modify"
            @removeConfig="removeConfig"
            :data="ngcLocations"
            @submit="addLocationServer"
            @change="modalVisibleChange"/>

    <UpstreamModal
            :show="upstreamModal"
            :modify="modify"
            @removeConfig="removeConfig"
            :data="ngcUpstreamGroups"
            @submit="addUpstream"
            @change="modalVisibleChange"/>

    <MainModal :modify="modify" :show="mainModal" @change="modalVisibleChange" :data="maindata" @submit="modifyMain"/>


  </div>
</template>
<script>
  import PopTip from '@/components/common/pop-tip'
  import loading from '@/components/common/loading'
  import LoadBalancerModal from './loadBalancerModal'
  import VirtualServerModal from './virtualServerModal'
  import LocationModal from './locationModal'
  import UpstreamModal from './upstreamModal'
  import MainModal from './mainModal'
  import drawLine from '../../../libs/drawLine'
  import {
    getNginxConf,
    editNginxConf,
    previewNginxConf,
    selNginxConfByL7ID,
    selNginxConfByAPPID,
    getL7RelevanceConfig,
    ManEditNginxConf
  } from "../../../api/L7";
  import defaultConfig from './defaultConfig'
  import emptyConfig from './emptyConfig'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        loading: false,
        dropdown: true,
        domainModal: false,
        editServerModal: false,
        serverModal: false, //
        locationModal: false,
        upstreamModal: false,
        mainModal: false,
        domainName: '',
        step: 0,
        config: defaultConfig,
        ngcVirtualServers: defaultConfig.ngcVirtualServers[0],
        virtualServerGroup: [],
        ngcLocations: defaultConfig.ngcVirtualServers[0].ngcLocations[0],
        ngcLocationsGroup: [],
        ngcUpstreamGroups: emptyConfig.ngcUpstreamGroups[0],
        ngcUpstreamServers: [],
        modify: false, // 新增/修改配置， 默认新增
        virtualServerIndex: 0, // 选中的virtualServer 序号
        editVirtualServerIndex: 0, // 编辑的virtualServer 序号
        locationsIndex: 0, // locations 序号
        activeLocationIndex: null,
        upstreamIndex: null, // upstream 序号
        upstreamServerIndex: null, // upstream 序号
        submitLoading: false,
        previewOpen: false,
        previewData: '',
        copyAndSaveModel: false,
        copyAndSaveModelLoading: false,
        copyConfigName: '',
        relevanceApp: null, // 关联的app
        maindata: [],
        configEditable: false
      }

    },
    props: {
      configName: ''
    },
    watch: {
      config(newVal, old) {
        // console.log(...arguments)
      },
      '$route'() {
        this.initConfig()
      }
    },
    computed: {
      ...mapState({
        canSaveConfig: state => state.L7.canSaveConfig,
        canSaveAndCopyConfig: state => state.L7.canSaveAndCopyConfig,
        configName: state => state.L7.configName,
        l7ServerId: state => state.L7.activeAside.l7ServerId,
      }),
    },
    components: {
      PopTip, loading, LoadBalancerModal, VirtualServerModal, LocationModal, UpstreamModal, MainModal
    },
    methods: {

      /* 打开新建弹窗 */
      dropdownHandler(name) {

        switch (name) {
          case '1':
            this.domainModal = true
            break
          case '2':
            this.editVirtualServer(0, false)
            break

        }
      },
      modalVisibleChange(data) {
        switch (data.name) {
          case 'domainModal':
            this.domainModal = data.data
            break
          case 'serverModal':
            this.serverModal = data.data

            break
          case 'locationModal':
            this.locationModal = data.data
            break
          case 'upstreamModal':
            this.upstreamModal = data.data
            break
          case 'mainModal':
            this.mainModal = data.data
            break
        }

      },
      /* 重置画布 */
      clearCanvas() {
        let canvas = document.getElementById("canvas");
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
      },
      /* 绘制关系图*/
      drawGroupToServers(start, end) {
        this.clearCanvas()
        this.$nextTick(() => {
          if (this.upstreamServerIndex !== null) {
            drawLine(this.$refs.canvas, start[this.upstreamIndex], end[this.upstreamServerIndex])
          } else {
            end.map((item, index) => {
              drawLine(this.$refs.canvas, start[this.upstreamIndex], end[index])
            })
          }
        })
      },
      drawLocationsToGroup(start, end) {
        this.clearCanvas()
        if (this.activeLocationIndex !== null) {
          this.config.ngcUpstreamGroups.map((value, key) => {
            if (this.ngcLocationsGroup[this.activeLocationIndex].proxy_url.split('//')[1] === value.group_name) {
              value.isLine = true
              drawLine(this.$refs.canvas, start[this.activeLocationIndex], end[key])
            } else {
              value.isLine = false
            }
          })
        } else {
          this.ngcLocationsGroup.map((item, index) => {

            if (item.proxy_url.split('//')[1] === this.config.ngcUpstreamGroups[this.upstreamIndex].group_name) {
              this.$set(item, 'isLine', true)
              drawLine(this.$refs.canvas, start[index], end[this.upstreamIndex])
            } else {
              this.$set(item, 'isLine', false)
            }
          })
        }
      },
      drawLine() {
        this.drawGroupToServers(this.$refs.start1, this.$refs.end1)
        this.drawLocationsToGroup(this.$refs.start, this.$refs.end)
      },
      /* 滚动重绘 */
      checkDivScrollTop(el, callback, start, end) {
        //获取节点
        let scrollDiv = this.$refs[el];
        //绑定事件
        scrollDiv.addEventListener('scroll', () => {
          if (start && end) {
            callback(start, end)

          } else {
            callback()
          }
        });
      },
      /* 获取配置 */
      async getConfig() {
        let res
        this.loading = true
        if (this.$route.params.configName) {
          let json = {nginx_conf_id: this.$route.query.nginx_conf_id}
          res = await getNginxConf(json)
        } else if (this.$route.params.L7) {
          let json = {l7ServerId: this.$route.params.L7}
          res = await selNginxConfByL7ID(json)
        }else if (this.$route.params.app){
          let json = {app_service_id: this.$route.params.app}
          res = await selNginxConfByAPPID(json)
        }
        this.loading = false
        console.log(res)
        if (this.asyncOk(res) && res.data.result) {
          this.config = res.data.result || {}
          if (this.config.ngcVirtualServers[0]) {
            this.virtualServerGroup = this.config.ngcVirtualServers
            this.ngcLocationsGroup = this.config.ngcVirtualServers[0].ngcLocations || []
            this.maindata.push(this.config.work_rlimit_nofile)
            this.maindata.push(this.config.worker_connections)
            this.maindata.push(this.config.worker_processes)
          }

        } else if (this.asyncOk(res)) {
          //console.log(defaultConfig)
          this.virtualServerGroup = defaultConfig.ngcVirtualServers
          this.ngcLocationsGroup = defaultConfig.ngcVirtualServers[0].ngcLocations || []
          this.config = defaultConfig
          this.maindata.push(this.config.work_rlimit_nofile)
          this.maindata.push(this.config.worker_connections)
          this.maindata.push(this.config.worker_processes)
        }
      },
      /* 初始化配置 */
      initConfig() {
        if (this.$route.params.configName) {
          this.getConfig()
        } else if (this.$route.params.L7 || this.$route.params.app) {
          this.getConfig()
        } else {
          this.virtualServerGroup = defaultConfig.ngcVirtualServers
          this.ngcLocationsGroup = defaultConfig.ngcVirtualServers[0].ngcLocations
        }
      },
      /* 编辑main配置 */
      editMain(index, modify) {
        this.modify = modify
        this.mainModal = true
      },
      /* 编辑server配置*/
      editVirtualServer(index, modify) {
        // console.log(modify? '编辑': '新建')
        this.ngcVirtualServers = modify ? this.config.ngcVirtualServers[index] : emptyConfig.ngcVirtualServers[0]
        this.editVirtualServerIndex = index
        this.modify = modify
        this.serverModal = true
      },
      /* 编辑location配置*/
      editLocation(index, modify) {
        this.locationsIndex = index
        // console.log(this.ngcLocations)
        this.ngcLocations = modify ? this.config.ngcVirtualServers[this.virtualServerIndex].ngcLocations[index] : emptyConfig.ngcVirtualServers[0].ngcLocations[0]

        this.modify = modify
        this.locationModal = true
      },
      /* 编辑upstream配置*/
      editUpstream(index, modify) {
        // console.log(modify? '编辑': '新建')
        this.upstreamModal = true
        this.upstreamIndex = index
        this.ngcUpstreamGroups = modify ? this.config.ngcUpstreamGroups[index] : emptyConfig.ngcUpstreamGroups[0]
        //console.log(this.ngcUpstreamGroups)
        this.modify = modify

      },

      /* 保存main */
      modifyMain(data) {
        // console.log(data)
        this.config.work_rlimit_nofile = data.work_rlimit_nofile
        this.config.worker_connections = data.worker_connections
        this.config.worker_processes = data.worker_processes
      },
      /* 保存virtualServer */
      addVirtualServer(data) {
        //data.ngcLocations = this.ngcLocationsGroup
        if (!this.modify) {
          this.config.ngcVirtualServers.push(data)
        } else {
          /* 缓存ngcLocations */
          let ngcLocations = this.config.ngcVirtualServers[this.virtualServerIndex].ngcLocations
          // 修改ngcVirtualServers
          this.config.ngcVirtualServers[this.virtualServerIndex] = data
          // 恢复ngcLocations
          this.config.ngcVirtualServers[this.virtualServerIndex].ngcLocations = ngcLocations
        }
      },
      /* 保存location配置 */
      addLocationServer(data) {
        //console.log(data)
        if (!this.modify) {
          this.config.ngcVirtualServers[this.virtualServerIndex].ngcLocations.push(data)
        } else {
          this.config.ngcVirtualServers[this.virtualServerIndex].ngcLocations[this.locationsIndex] = data
        }
      },
      /* 保存upStream */
      addUpstream(data) {

        if (!this.modify) {
          this.config.ngcUpstreamGroups.push(data)
        } else {
          this.config.ngcUpstreamGroups[this.upstreamIndex] = data
        }
        this.selectUpstream(0)
      },
      /* 选择virtualServer */
      selectVirtualServer(index) {
        this.virtualServerIndex = index
        this.ngcVirtualServers = this.config.ngcVirtualServers[this.virtualServerIndex]
        //console.log(this.ngcVirtualServers)
        this.ngcLocationsGroup = this.ngcVirtualServers.ngcLocations
        this.activeLocationIndex = null
        this.clearCanvas()
      },
      /* 选择location */
      selectLocation(index) {
        this.activeLocationIndex = index
        this.upstreamIndex = null
        this.ngcUpstreamServers = []

        //this.ngcLocations = this.config.ngcVirtualServers[this.virtualServerIndex].ngcLocations[]
        this.drawLocationsToGroup(this.$refs.start, this.$refs.end)
      },
      /* 切换upgroup */
      selectUpstream(index) {
        this.upstreamIndex = index
        this.upstreamServerIndex = null
        this.activeLocationIndex = null
        this.ngcUpstreamGroups = this.config.ngcUpstreamGroups[index]
        this.ngcUpstreamServers = this.ngcUpstreamGroups.ngcUpstreamServers || []
        this.$nextTick(() => {
          this.drawGroupToServers(this.$refs.start1, this.$refs.end1)
          this.drawLocationsToGroup(this.$refs.start, this.$refs.end)
        })

      },
      /* 切换upserver */
      selectUpServer(index) {
        this.upstreamServerIndex = index
        this.drawLine()
      },
      /* 提交配置 */
      async submitConfig() {
        if (this.submitLoading) return
        this.submitLoading = true
        this.config.config_name = this.configName
        let res = await editNginxConf(this.config)
        if (this.asyncOk(res)) {
          this.submitLoading = false
          //this.selectUpstream(0)
          if (this.$route.params.configName) {
            this.$Message.success({
              content: '配置已更新成功',
              duration: 3
            });
            /* 更新配置 */
            this.getConfig()
          } else {
            this.$Message.success({
              content: '配置保存成功',
              duration: 3
            });
            this.$router.push({
              name: 'nginxConfig',
              params: {
                configName: this.configName,
              },
              query: {
                nginx_conf_id: res.data.result,
              }
            })
          }

        } else {
          this.submitLoading = false
          this.$Message.error({
            content: res.data.result,
            duration: 3
          });
        }
      },
      /* 保存并复制配置 */
      async copyAndSaveConfig() {
        this.config.config_name = this.copyConfigName
        this.copyAndSaveModelLoading = true
        let res = await editNginxConf(this.config)
        this.copyAndSaveModelLoading = false
        //console.log(res)
        if (this.asyncOk(res)) {
          this.$Message.success({
            content: '配置已更新成功',
            duration: 3
          });
          this.$router.push('/nginxConfigs')
        } else {
          this.$Message.error({
            content: res.data.result,
            duration: 3
          });
        }
      },
      /* 删除配置项 */
      removeConfig(data) {
        //console.log(data)
        switch (data) {
          case 'serverModal':
            this.config.ngcVirtualServers.splice(this.editVirtualServerIndex, 1)
            // console.log(this.config.ngcVirtualServers)
            this.ngcLocationsGroup = this.config.ngcVirtualServers.ngcLocations || []
            break
          case 'location':
            this.config.ngcVirtualServers[this.virtualServerIndex].ngcLocations.splice(this.locationsIndex, 1)
            break
          case 'upstream':
            this.config.ngcUpstreamGroups.splice(this.upstreamIndex, 1)
            break
        }
      },
      /* 预览配置 */
      async previewConfig() {
        this.previewOpen = true
        let res = await previewNginxConf(this.config)
        if (this.asyncOk(res)) {
          this.previewData = res.data.result || ''
          let strArr = this.previewData.split('\n')
          strArr = strArr.map(item => {
            return  item + '<br>'
          })
          this.previewData = strArr.join('')
          this.previewData = this.previewData.replace(/\s/g, '&nbsp')
        }
      },
      /*/!* 通过实例主键ID查询该实例是否与配置文件或者APP关联 *!/
      async getL7RelevanceConfig() {
          let res = await getL7RelevanceConfig({ l7ServerId : this.l7ServerId})
          if (this.asyncOk(res)){
              this.relevanceApp = res.data.result
          }
      }*/

      /* 保存手动编辑的配置 */
      async saveEditedConfig() {
        this.configEditable = false
        let target = this.$refs.editConfig.innerHTML

        target = target.replace(/&nbsp;/g, ' ')
        target = target.replace(/<br>/g,'\n')
        target = target.replace(/<div>/g,'')
        target = target.replace(/<\/div>/g,'')

        let json = {
          data: target
        }
        let res = await ManEditNginxConf({nginx_conf_id: this.config.nginx_conf_id, config_name: this.configName}, json)
        if(this.asyncOk(res)) {
          this.$Message.success('保存成功！')
          this.previewOpen = false
          this.initConfig()
        }else{
          this.$Message.error(res.data.result)
        }
      }
    },
    mounted() {
      /* 初始化配置 */
      this.initConfig()
      // console.log(this.$route.params)
      /* 绘制配置关系图 */
      window.addEventListener('resize', this.drawLine)
    },
    updated() {

      this.checkDivScrollTop('locations', this.drawLocationsToGroup, this.$refs.start, this.$refs.end);
      this.checkDivScrollTop('upstreamGroup', this.drawLine);
      this.checkDivScrollTop('upstreamServers', this.drawGroupToServers, this.$refs.start1, this.$refs.end1);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.drawLine)
    }
  }
</script>
<style lang="less" scoped>
  @import "L7-config";
  @import "modal-form";
</style>
