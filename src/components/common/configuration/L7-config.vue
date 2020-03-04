<template>
    <div class="l7_config_layout">
       <div class="l7_config_column column_header">
           <div class="header_item">
                Virtual Servers
               <PopTip content="123" style="margin-left: 5px;" placement="bottom"></PopTip>
               <Dropdown trigger="click"  :transfer="true" class="add_handler" @on-click="dropdownHandler" >
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
                <Icon type="md-add" size="26" color="#333" class="add_handler" @click="editLocation(0,false)"/>
            </div>
        </div>
        <div  class="l7_config_column column_header">
            <div class="header_item">
                Upstream Groups
                <PopTip content="123" style="margin-left: 5px;" placement="bottom"></PopTip>
                <Icon type="md-add" size="26" color="#333" class="add_handler" @click="upstreamModal = true"/>
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
                         v-for="(item, index) in config.ngcVirtualServers">
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
                     v-for="(item, index) in config.ngcVirtualServers[virtualServerIndex].ngcLocations"
                     :key="index"
                     :class="locationsIndex === index ? 'list-selected' : ''"
                >
                    <span class="ctrl-location "
                          :class="item.url_path_route_value === '/' ? 'ctrl-location_default' : ''"
                          @click="locationsIndex=index">
                        <span>{{item.url_path_route_value}}</span>
                        <span class="ctrl-location__label">{{item.url_path_route_value === '/' ? 'default route': ''}}</span>
                    </span>
                    <Icon type="md-create" class="ctrl-list-item__edit" @click="editLocation(index,true)"/>
                </div>
                <!--<div class="ctrl-list-item list-selected">
                    <span class="ctrl-location ">
                        <span>=/50x.html</span>
                        <span class="ctrl-location__label">default route</span>
                    </span>
                    <Icon type="md-create" class="ctrl-list-item__edit" />
                </div>-->

            </div>
        </div>
        <!--upstream groups-->
        <div  class="l7_config_column column_body column_body_upstream">
            <div class="upstream-groups">
                <div ref="start1" class="ctrl-list-item ctrl-list-item_corners list-selected">
                    <span class="ctrl-list-item__corner-left">
                        <span class="ctrl-list-item__corner-inner"></span>
                    </span>
                    <span>123</span>
                    <Icon type="md-create" class="ctrl-list-item__edit" />
                    <span class="ctrl-list-item__corner-right">
                        <span class="ctrl-list-item__corner-inner"></span>
                    </span>
                </div>
                <div class="ctrl-list-item ctrl-list-item_corners">
                    <span class="ctrl-list-item__corner-left">
                        <span class="ctrl-list-item__corner-inner"></span>
                    </span>
                    <span>123</span>
                    <Icon type="md-create" class="ctrl-list-item__edit" />
                    <span class="ctrl-list-item__corner-right">
                        <span class="ctrl-list-item__corner-inner"></span>
                    </span>
                </div>
            </div>
        </div>
        <!--upstream servers-->
        <div class="l7_config_column column_body column_body_upstream">
            <div  class="upstream-groups">
                <div ref="end1" class="ctrl-list-item ctrl-list-item_corners list-selected">
                    <span class="ctrl-list-item__corner-left">
                        <span class="ctrl-list-item__corner-inner"></span>
                    </span>
                    <span>123</span>
                    <Icon type="md-create" class="ctrl-list-item__edit" />
                    <span class="ctrl-list-item__corner-right">
                        <span class="ctrl-list-item__corner-inner"></span>
                    </span>
                </div>
                <div ref="end2" class="ctrl-list-item ctrl-list-item_corners default">
                    <span class="ctrl-list-item__corner-left">
                        <span class="ctrl-list-item__corner-inner"></span>
                    </span>
                    <span>123</span>
                    <Icon type="md-create" class="ctrl-list-item__edit" />
                    <span class="ctrl-list-item__corner-right">
                        <span class="ctrl-list-item__corner-inner"></span>
                    </span>
                </div>
                <div ref="end3" class="ctrl-list-item ctrl-list-item_corners default">
                    <span class="ctrl-list-item__corner-left">
                        <span class="ctrl-list-item__corner-inner"></span>
                    </span>
                    <span>123</span>
                    <Icon type="md-create" class="ctrl-list-item__edit" />
                    <span class="ctrl-list-item__corner-right">
                        <span class="ctrl-list-item__corner-inner"></span>
                    </span>
                </div>
                <div ref="end4" class="ctrl-list-item ctrl-list-item_corners default">
                    <span class="ctrl-list-item__corner-left">
                        <span class="ctrl-list-item__corner-inner"></span>
                    </span>
                    <span>123</span>
                    <Icon type="md-create" class="ctrl-list-item__edit" />
                    <span class="ctrl-list-item__corner-right">
                        <span class="ctrl-list-item__corner-inner"></span>
                    </span>
                </div>
                <div ref="end5" class="ctrl-list-item ctrl-list-item_corners default">
                    <span class="ctrl-list-item__corner-left">
                        <span class="ctrl-list-item__corner-inner"></span>
                    </span>
                    <span>123</span>
                    <Icon type="md-create" class="ctrl-list-item__edit" />
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
        <div class="config-page__bottom-buttons">
            <div class="config-page__bottom-buttons_container">
                <button type="button" class="config-page__add-new ae-button__black ae-button__button" title="Save as a new configuration">
                    <span class="ae-button__label">Copy and Save As...</span>
                </button>
                <button type="button" class="config-page__add-new ae-button__green ae-button__button" title="Save configuration">
                    <span class="ae-button__label">Save</span>
                </button>
            </div>
        </div>
        <!-- 页脚按钮end -->
        <!-- 功能弹窗 -->
        <LoadBalancerModal :show="domainModal"   @change="modalVisibleChange" @complete="domainModal = false"/>
        <VirtualServerModal
                :show="serverModal"
                :modify="modify"
                :data="ngcVirtualServers"
                @submit="addVirtualServer"
                @change="modalVisibleChange"/>
        <LocationModal
                :show="locationModal"
                :modify="modify"
                :data="ngcLocations"
                @change="modalVisibleChange"/>
        <!--<UpstreamModal  :show="upstreamModal" :data="ngcVirtualServers" @change="modalVisibleChange"/>-->
    </div>
</template>
<script>
import PopTip from '@/components/common/pop-tip'
import LoadBalancerModal from './loadBalancerModal'
import VirtualServerModal from './virtualServerModal'
import LocationModal from './locationModal'
import UpstreamModal from './upstreamModal'
import drawLine from '../../../libs/drawLine'
import { getNginxConf } from "../../../api/L7";
import defaultConfig from './defaultConfig'
import emptyConfig from './emptyConfig'
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
            ngcLocations: defaultConfig.ngcVirtualServers[0].ngcLocations[0],
            modify: false, // 新增/修改配置， 默认新增
            virtualServerIndex: 0, // 选中的virtualServer 序号
            locationsIndex: null, // locations 序号
        }

    },

    watch:{
        config(newVal, old){
            console.log(...arguments)
        }
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
            drawLine(this.$refs.canvas, this.$refs.start1, this.$refs.end1)
            drawLine(this.$refs.canvas, this.$refs.start1, this.$refs.end2)
            drawLine(this.$refs.canvas, this.$refs.start1, this.$refs.end3)
            drawLine(this.$refs.canvas, this.$refs.start1, this.$refs.end4)
            drawLine(this.$refs.canvas, this.$refs.start1, this.$refs.end5)
        },
        /* 获取配置 */
        async getConfig () {
            let json = {
                nginx_conf_id: this.$route.query.nginx_conf_id ,
                version_no: this.$route.query.version_no
            }
            let res = await getNginxConf(json)
           // console.log(res)
            if (this.asyncOk(res) && res.data.result) {
                this.config = res.data.result
            }
        },
        /* 编辑server配置*/
        editVirtualServer(index, modify) {
            console.log(modify? '编辑': '新建')
            this.ngcVirtualServers = modify ? this.config.ngcVirtualServers[index] : emptyConfig.ngcVirtualServers[0]
           // console.log(this.ngcVirtualServers)
            this.modify = modify
            this.serverModal = true
        },
        /* 编辑server配置*/
        editLocation(index, modify) {
            console.log(modify? '编辑': '新建')
            this.ngcLocations = modify ? this.config.ngcVirtualServers[this.virtualServerIndex].ngcLocations[this.locationsIndex] : emptyConfig.ngcVirtualServers[0].ngcLocations[0]
            console.log(this.ngcLocations)
            this.modify = modify
            this.locationModal = true
        },
        /* 初始化配置 */
        initConfig() {
            if (this.$route.params.configName) {
                this.getConfig()
            }
        },
        /* 保存virtualServer */
        addVirtualServer(data) {
            console.log(data)
            this.config.ngcVirtualServers.push(data)
        },
        /* 选择virtualServer */
        selectVirtualServer(index) {
            this.virtualServerIndex = index
            this.ngcVirtualServers = this.config.ngcVirtualServers[this.virtualServerIndex]
        }

    },
    mounted() {
        /* 初始化配置 */
        this.initConfig()

        /* 绘制配置关系图 */
        this.drawLine()
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
