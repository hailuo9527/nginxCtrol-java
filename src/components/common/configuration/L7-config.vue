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

           <LoadBalancerModal :show="domainModel" @change="modalVisibleChange" @complete="domainModel = false"/>
           <VirtualServerModal :show="serverModal" @change="modalVisibleChange"/>
       </div>
        <div class="l7_config_column column_header">
            <div class="header_item">
                Locations
                <PopTip content="123" style="margin-left: 5px;" placement="bottom"></PopTip>
                <Icon type="md-add" size="26" color="#333" class="add_handler"/>
            </div>
        </div>
        <div  class="l7_config_column column_header">
            <div class="header_item">
                Upstream Groups
                <PopTip content="123" style="margin-left: 5px;" placement="bottom"></PopTip>
                <Icon type="md-add" size="26" color="#333" class="add_handler"/>
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
                <div class="server_item selected">
                    <div class="ctrl-server__edit icon icon_settings"></div>
                    <h4 class="ctrl-server__server-name">
                        <span>*</span>
                    </h4>
                    <div class="ctrl-server__protocols">http</div>
                    <div>
                        <span class="ctrl-server__port">:80</span>
                    </div>
                </div>
                <div class="server_item">
                    <div class="ctrl-server__edit icon icon_settings"></div>
                    <h4 class="ctrl-server__server-name">
                        <span>*</span>
                    </h4>
                    <div class="ctrl-server__protocols">http</div>
                    <div>
                        <span class="ctrl-server__port">:80</span>
                    </div>
                </div>
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


    </div>
</template>
<script>
import PopTip from '@/components/common/pop-tip'
import LoadBalancerModal from './loadBalancerModal'
import VirtualServerModal from './virtualServerModal'
import drawLine from '../../../libs/drawLine'
export default {
    data () {
        return {
            dropdown: true,
            domainModel: false,
            serverModal: false, //
            domainName: '',
            step: 0,

        }

    },

    components: {
        PopTip, LoadBalancerModal, VirtualServerModal
    },
    methods: {
        dropdownHandler (name) {
            switch (name) {
                case '1':
                    this.domainModel = true
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
                    this.domainModel = data.data
                    break
                case 'serverModal':
                    this.serverModal = data.data
                    break
            }

        },



    },
    mounted() {

        drawLine(this.$refs.canvas, this.$refs.start1, this.$refs.end1)
        drawLine(this.$refs.canvas, this.$refs.start1, this.$refs.end2)
        drawLine(this.$refs.canvas, this.$refs.start1, this.$refs.end3)
        drawLine(this.$refs.canvas, this.$refs.start1, this.$refs.end4)
        drawLine(this.$refs.canvas, this.$refs.start1, this.$refs.end5)

    }
}
</script>
<style lang="less" scoped>
  @import "L7-config";

</style>
