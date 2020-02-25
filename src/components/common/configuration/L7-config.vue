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
        <div class="l7_config_column column_header">
            <div class="header_item">
                Locations
                <PopTip content="123" style="margin-left: 5px;" placement="bottom"></PopTip>
                <Icon type="md-add" size="26" color="#333" class="add_handler" @click="locationModal = true"/>
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
                <Icon type="md-add" size="26" color="#333" class="add_handler"/>
            </div>
        </div>
        <div  class="l7_config_column column_body column_body_servers">
            <div class="servers">
                <div class="server_item selected" v-for="(item, index) in config.virtual_servers">
                    <Icon type="md-create" class="ctrl-list-item__edit" @click="editVirtualServer(index)"/>
                    <h4 class="ctrl-server__server-name">
                        <span>{{ item.domain_names_m[0] || '*'}}</span>
                    </h4>
                    <div class="ctrl-server__protocols" >
                        http
                        <span v-for="(http, index) in item.listening_m.listening" v-if="http.http2">
                           http2
                        </span>
                    </div>
                    <div>
                        <span class="ctrl-server__port" v-for="(port, index) in item.listening_m.listening">
                            :{{port.listening_address_port}}
                        </span>
                    </div>
                </div>
                <!--<div class="server_item">
                    <div class="ctrl-server__edit icon icon_settings"></div>
                    <h4 class="ctrl-server__server-name">
                        <span>*</span>
                    </h4>
                    <div class="ctrl-server__protocols">http</div>
                    <div>
                        <span class="ctrl-server__port">:80</span>
                    </div>
                </div>-->

            </div>
        </div>
        <div  class="l7_config_column column_body">
            <div class="locations">
                <div class="ctrl-list-item ">
                    <span class="ctrl-location ctrl-location_default"><!-- react-text: 253 -->&nbsp;<!-- /react-text --><!-- react-text: 254 -->/<!-- /react-text -->
                        <span class="ctrl-location__label">default route</span>
                    </span>
                    <Icon type="md-create" class="ctrl-list-item__edit" />
                </div>
                <div class="ctrl-list-item list-selected">
                    <span class="ctrl-location "><!-- react-text: 253 -->&nbsp;<!-- /react-text --><!-- react-text: 254 -->/<!-- /react-text -->
                        <span class="ctrl-location__label">default route</span>
                    </span>
                    <Icon type="md-create" class="ctrl-list-item__edit" />
                </div>
                <div class="ctrl-list-item ">
                    <span class="ctrl-location "><!-- react-text: 253 -->&nbsp;<!-- /react-text --><!-- react-text: 254 -->/<!-- /react-text -->
                        <span class="ctrl-location__label">default route</span>
                    </span>
                    <Icon type="md-create" class="ctrl-list-item__edit" />
                </div>
            </div>
        </div>
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


        <LoadBalancerModal :show="domainModal"  @change="modalVisibleChange" @complete="domainModal = false"/>
        <VirtualServerModal :show="serverModal" :data="virtual_server" @change="modalVisibleChange"/>
        <LocationModal :show="locationModal" :data="virtual_server" @change="modalVisibleChange"/>
        <LocationModal :show="locationModal" :data="virtual_server" @change="modalVisibleChange"/>
        <UpstreamModal :show="upstreamModal" :data="virtual_server" @change="modalVisibleChange"/>
    </div>
</template>
<script>
import PopTip from '@/components/common/pop-tip'
import LoadBalancerModal from './loadBalancerModal'
import VirtualServerModal from './virtualServerModal'
import LocationModal from './locationModal'
import UpstreamModal from './upstreamModal'
import drawLine from '../../../libs/drawLine'
import { getConfigInfoByConfigName } from "../../../api/L7";
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
            config: {},
            virtual_server: {}
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
        /* 获取配置 */
        dropdownHandler (name) {

            switch (name) {
                case '1':
                    this.domainModal = true
                    //this.serverModal = false
                    break
                case '2':
                    this.serverModal = true
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
            let res = await getConfigInfoByConfigName()
            console.log(res)
            if (this.asyncOk(res)) {
                this.config = res.data.result || {}
            }
        },
        /* 编辑server配置*/
        editVirtualServer(index) {
            console.log(index)
            this.serverModal = true
            this.virtual_server = this.config.virtual_servers[index]
            console.log(this.virtual_server)

        }
    },
    mounted() {
        if (this.$route.params.configId) {
            this.getConfig()
        }
        this.drawLine()
        window.addEventListener('resize' ,this.drawLine)
       /* setTimeout(()=>{
            this.virtual_server = {
                name: 123
            }

        },3000)*/

    },
    beforeDestroy() {
        window.removeEventListener('resize', this.drawLine)
    }
}
</script>
<style lang="less" scoped>
  @import "L7-config";

</style>
