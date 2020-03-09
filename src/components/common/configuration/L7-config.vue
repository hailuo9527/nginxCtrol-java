<template>
    <div class="l7_config_layout">
       <div class="l7_config_column column_header">
           <div class="header_item">
                Virtual Servers
               <PopTip content="123" style="margin-left: 5px;" placement="bottom"></PopTip>
               <Dropdown trigger="click"  :transfer="true" class="add_handler" v-if="$route.params.configName" @on-click="dropdownHandler" >
                   <Icon type="md-add" size="26" color="#333" class="add"/>
                   <DropdownMenu slot="list" >
                       <DropdownItem name="1">Load Balancer Wizard</DropdownItem>
                       <DropdownItem name="2" divided>New Virtual Server</DropdownItem>
                   </DropdownMenu>
               </Dropdown>

           </div>


       </div>
        <!--header tab-->
        <div class="l7_config_column column_header">
            <div class="header_item">
                Locations
                <PopTip content="123" style="margin-left: 5px;" placement="bottom"></PopTip>
                <Icon type="md-add" size="26" color="#333" class="add_handler" v-if="$route.params.configName" @click="editLocation(0,false)"/>
            </div>
        </div>
        <div  class="l7_config_column column_header">
            <div class="header_item">
                Upstream Groups
                <PopTip content="123" style="margin-left: 5px;" placement="bottom"></PopTip>
                <Icon type="md-add" size="26" color="#333" class="add_handler" v-if="$route.params.configName" @click="editUpstream(0, false)"/>
            </div>
        </div>
        <div class="l7_config_column column_header">
            <div class="header_item">
                Upstream Servers
                <PopTip content="123" style="margin-left: 5px;" placement="bottom"></PopTip>
                <!--<Icon type="md-add" size="26" color="#333" class="add_handler"/>-->
            </div>
        </div>
        <!--header tab end-->
        <!--virtual servers-->
        <div  class="l7_config_column column_body column_body_servers">
            <div class="servers">
                    <div class="server_item" @click="selectVirtualServer(index)"
                         :class="virtualServerIndex === index? 'selected': ''"
                         v-for="(item, index) in virtualServerGroup">
                        <Icon type="md-create" class="ctrl-list-item__edit" @click="editVirtualServer(index,true)"/>
                        <h4 class="ctrl-server__server-name">
                            <span>{{ item.domain_name.split(',')[0] || '*'}}</span>
                        </h4>
                        <div class="ctrl-server__protocols" >
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
        <div  class="l7_config_column column_body">
            <div class="locations">
                <div class="ctrl-list-item "
                     @click="selectLocation(index)"
                     v-if=""
                     v-for="(item, index) in ngcLocationsGroup"
                     :key="index"
                     :class="locationsIndex === index ? 'list-selected' : ''"
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
        <div  class="l7_config_column column_body column_body_upstream">
            <div class="upstream-groups">
                <div ref="start1"
                     v-if="config.ngcUpstreamGroups.length"
                     v-for="(item, key) in config.ngcUpstreamGroups"
                     :class="upstreamIndex === key ? 'list-selected': ''"
                     @click="selectUpstream(key)"
                     class="ctrl-list-item ctrl-list-item_corners ">
                        <span class="ctrl-list-item__corner-left">
                            <span class="ctrl-list-item__corner-inner"></span>
                        </span>
                        <span>{{item.group_name}}</span>
                        <Icon type="md-create" class="ctrl-list-item__edit" @click="editUpstream(key, true)"/>
                        <span class="ctrl-list-item__corner-right">
                            <span class="ctrl-list-item__corner-inner"></span>
                        </span>
                </div>

            </div>
        </div>
        <!--upstream servers-->
        <div class="l7_config_column column_body column_body_upstream">
            <div  class="upstream-groups" >
                <div ref="end1"

                     v-for="(item, end) in ngcUpstreamServers"
                     :class="upstreamServerIndex === end? 'list-selected':'' "
                     @click="selectUpServer(end)"
                     class="ctrl-list-item ctrl-list-item_corners default ">
                    <span class="ctrl-list-item__corner-left">
                        <span class="ctrl-list-item__corner-inner"></span>
                    </span>
                    <!--<span>{{item.upstream_servers_name}}</span>-->
                    <span>{{item.upstream_servers_name}}</span>
                    <Icon type="md-create" class="ctrl-list-item__edit"  />
                    <span class="ctrl-list-item__corner-right">
                        <span class="ctrl-list-item__corner-inner"></span>
                    </span>
                </div>

            </div>




        </div>

        <!-- 关系连线 canvas -->
        <div class="ctrl-relations-canvas" ref="canvas" >
            <canvas width="2000" height="2000" id = "canvas" style="width: 2000px; height: 2000px;"></canvas>
        </div>
        <!-- 页脚按钮 -->
        <button type="button" class="ctrl-layout__new-load-balancer ae-button__white ae-button__button"><span class="ae-button__label">Load Balancer Wizard</span></button>
        <div class="config-page__bottom-buttons" v-if="!$route.params.L7">
            <div class="config-page__bottom-buttons_container">
                <button type="button"
                        @click="previewConfig"
                        class="config-page__add-new ae-button__black ae-button__button" title="">
                    <span class="ae-button__label">预览</span>
                </button>

                <button :disabled="!canSaveConfig" type="button" class="config-page__add-new ae-button__black ae-button__button" title="Save as a new configuration">
                    <span class="ae-button__label">Copy and Save As...</span>
                </button>
                <button
                        :disabled="!canSaveConfig"
                        type="button"
                        @click="submitConfig"
                        class="config-page__add-new ae-button__green ae-button__button" title="Save configuration">
                    <span class="ae-button__label">{{submitLoading? '正在保存': 'Save'}}</span>
                </button>
            </div>
        </div >

        <div class="instance-actions-container" v-if="$route.params.L7">
            <div class="instance-actions-container__info">
                <span>没有关联任何配置</span>
            </div>
            <div class="instance-actions-container__links">
                <router-link class="instance-actions-container__link" to="/nginxConfigs">查看全部配置</router-link>
                <div class="instance-actions-container__separator"></div>
                <button type="button"
                        @click="previewConfig"
                        class="instance-actions-container__btn ae-button__black ae-button__button" title="Preview">
                    <span class="ae-button__label">预览</span>
                </button>
                <button type="button"
                        @click="$router.push('/newNginxConfig')"
                        class="instance-actions-container__btn ae-button__green ae-button__button" title="New Load Balancer Configuration">
                    <span class="ae-button__label" >新建配置</span>
                </button>
            </div>
        </div>
        <Drawer title="配置预览" v-model="previewOpen" width="50%">
            <pre>{{previewData}}</pre>
        </Drawer>
        <!-- 页脚按钮end -->
        <!-- 功能弹窗 -->
        <LoadBalancerModal :show="domainModal"   @change="modalVisibleChange" @complete="domainModal = false"/>
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



    </div>
</template>
<script>
import PopTip from '@/components/common/pop-tip'
import LoadBalancerModal from './loadBalancerModal'
import VirtualServerModal from './virtualServerModal'
import LocationModal from './locationModal'
import UpstreamModal from './upstreamModal'
import drawLine from '../../../libs/drawLine'
import { getNginxConf,editNginxConf, previewNginxConf, selNginxConfByL7ID } from "../../../api/L7";
import defaultConfig from './defaultConfig'
import emptyConfig from './emptyConfig'
import { mapState } from 'vuex'
export default {
    data () {
        return {
            dropdown: true,
            domainModal: false,
            editServerModal: false,
            serverModal: false, //
            locationModal: false,
            upstreamModal: false,
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
            previewData: ''
        }

    },

    watch:{
        config(newVal, old){
           // console.log(...arguments)
            if (newVal) {

            }
        }
    },
    computed: {
        ...mapState({
            canSaveConfig: state => state.L7.canSaveConfig,
            canSaveAndCopyConfig: state => state.L7.canSaveAndCopyConfig,
            configName: state => state.L7.configName,

        }),
    },
    components: {
        PopTip, LoadBalancerModal, VirtualServerModal, LocationModal, UpstreamModal
    },
    methods: {

        /* 打开新建弹窗 */
        dropdownHandler (name) {

            switch (name) {
                case '1':
                    this.domainModal = true
                    break
                case '2':
                    this.editVirtualServer(0, false)
                    break

            }
        },
        modalVisibleChange(data){
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
            }

        },

        /* 绘制关系图*/
        drawLine () {

            let canvas = document.getElementById("canvas");
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            this.$nextTick(() => {
                //console.log(this.$refs.end1)
                if (!this.$refs.end1) return
                if(this.upstreamServerIndex !== null){
                    drawLine(this.$refs.canvas, this.$refs.start1[this.upstreamIndex], this.$refs.end1[this.upstreamServerIndex])
                }else {
                    this.$refs.end1.map((item,index)=> {
                        drawLine(this.$refs.canvas, this.$refs.start1[this.upstreamIndex], this.$refs.end1[index])
                    })
                }
            })





        },
        /* 获取配置 */
        async getConfig () {
            let res

            if (this.$route.params.configName) {
                let json = { nginx_conf_id: this.$route.query.nginx_conf_id }
                res = await getNginxConf(json)
            }else if (this.$route.params.L7) {
                let json = {l7ServerId: this.$route.params.L7}
                res = await selNginxConfByL7ID(json)
            }

            console.log(res)
            if (this.asyncOk(res) && res.data.result) {
                this.config = res.data.result || {}
                if (this.config.ngcVirtualServers[0]){
                    this.virtualServerGroup = this.config.ngcVirtualServers
                    this.ngcLocationsGroup = this.config.ngcVirtualServers[0].ngcLocations || []
                } else if (!res.data.result) {
                    this.config = defaultConfig
                }

            }
        },
        /* 初始化配置 */
        initConfig() {
            if (this.$route.params.configName) {
                this.getConfig(this.$route.query.nginx_conf_id)
            }else if (this.$route.params.L7) {
                this.getConfig(this.$route.params.L7)
            }else {
                this.virtualServerGroup = defaultConfig.ngcVirtualServers
                this.ngcLocationsGroup = defaultConfig.ngcVirtualServers[0].ngcLocations
            }
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
            console.log(modify? '编辑': '新建')
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
            console.log(this.ngcUpstreamGroups)
            this.modify = modify

        },

        /* 保存virtualServer */
        addVirtualServer(data) {
            //console.log(data)
            if(!this.modify){
                this.config.ngcVirtualServers.push(data)
            } else {
                this.config.ngcVirtualServers[this.virtualServerIndex] = data
            }
        },
        /* 保存location配置 */
        addLocationServer(data) {
            //console.log(data)
            if(!this.modify){
                this.config.ngcVirtualServers[this.virtualServerIndex].ngcLocations.push(data)
            } else {
                this.config.ngcVirtualServers[this.virtualServerIndex].ngcLocations[this.locationsIndex] = data
            }
        },
        /* 保存upStream */
        addUpstream(data) {

            if(!this.modify){
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
           // console.log(this.ngcVirtualServers)
            this.ngcLocationsGroup =  this.ngcVirtualServers.ngcLocations
            this.locationsIndex = null
        },
        selectLocation(index) {
            this.activeLocationIndex = index
            //this.ngcLocations = this.config.ngcVirtualServers[this.virtualServerIndex].ngcLocations[]
        },
        /* 切换upgroup */
        selectUpstream(index){
            this.upstreamIndex = index
            this.upstreamServerIndex = null
            this.ngcUpstreamGroups = this.config.ngcUpstreamGroups[index]
            this.ngcUpstreamServers = this.ngcUpstreamGroups.ngcUpstreamServers || []
            this.drawLine()
        },
        /* 切换upserver */
        selectUpServer(index){
            this.upstreamServerIndex = index
            this.drawLine()
        },
        /* 提交配置 */
        async submitConfig() {
            this.submitLoading = true
            this.config.config_name = this.configName
            let res = await editNginxConf(this.config)
            console.log(res)
            if (this.asyncOk(res)){
                this.submitLoading = false
                //this.selectUpstream(0)
                if (this.$route.params.configName){
                    this.$Message.success({
                        content: '配置已更新成功',
                        duration: 3
                    });
                }else {
                    this.$Message.success({
                        content: '配置保存成功',
                        duration: 3
                    });
                }

            } else {
                this.submitLoading = false
                this.$Message.error({
                    content: '配置保存失败',
                    duration: 3
                });
            }
        },
        /* 删除配置项 */
        removeConfig(data){
            //console.log(data)
            switch (data) {
                case 'serverModal':
                    this.config.ngcVirtualServers.splice(this.editVirtualServerIndex,1)
                   // console.log(this.config.ngcVirtualServers)
                    this.ngcLocationsGroup = this.config.ngcVirtualServers.ngcLocations || []
                    break
                case 'location':
                    this.config.ngcVirtualServers[this.virtualServerIndex].ngcLocations.splice(this.locationsIndex,1)
                    break
                case 'upstream':
                    this.config.ngcUpstreamGroups.splice(this.upstreamIndex,1)
                    break
            }
        },
        /* 预览配置 */
        async previewConfig() {
            this.previewOpen = true
            let res = await previewNginxConf(this.config)
            console.log(res)
            if (this.asyncOk(res)) {
                this.previewData = res.data.result
            }
        }
    },
    mounted() {
        /* 初始化配置 */
        this.initConfig()
        console.log(this.$route.params)
        /* 绘制配置关系图 */
        window.addEventListener('resize' ,this.drawLine)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.drawLine)
    }
}
</script>
<style lang="less" scoped>
  @import "L7-config";

</style>
