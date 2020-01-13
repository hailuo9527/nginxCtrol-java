<template>
    <div class="l7_config_layout">
       <div class="l7_config_column column_header">
           <div class="header_item">
                Virtual Servers
               <PopTip content="123" style="margin-left: 5px;" placement="bottom"></PopTip>
               <Dropdown trigger="click"  :transfer="true" class="add_handler" >
                   <Icon type="md-add" size="26" color="#333" class="add"/>
                   <DropdownMenu slot="list">
                       <DropdownItem @on-click="domainModel = true">Load Balancer Wizard</DropdownItem>
                       <DropdownItem divided>New Virtual Server</DropdownItem>
                   </DropdownMenu>
               </Dropdown>

           </div>
           <Modal
                   width="840"
                   class-name="vertical-center-modal ctrl-wizard"
                   v-model="domainModel"
                   >
               <div class="ctrl-wizard">
                   <div class="ctrl-wizard__head">
                       <div class="ctrl-wizard__tabs">
                           <div class="ctrl-wizard__tab ctrl-wizard__tab_ready_1 ctrl-wizard__tab_valid ctrl-wizard__tab_active">Names and Addresses</div>
                           <div class="ctrl-wizard__tab">Pool Configuration</div>
                           <div class="ctrl-wizard__tab">Route</div>
                       </div>
                   </div>
                   <div v-show="step===0">
                       <div class="ctrl-wizard__title">Listening Address and Port</div>
                       <div class="ctrl-wizard__description">
                           <div><!-- react-text: 893 -->Specify the inbound IP address and port for this load balancer. This should be one of the system’s IP addresses (or a "wildcard" listen). Please refer to the <!-- /react-text -->
                               <i>listen</i><!-- react-text: 895 --> directive in NGINX documentation.<!-- /react-text -->
                           </div>
                       </div>
                       <!--<div class="ctrl-edit-item ctrl-edit-item_edit">
                           <Button  icon="md-close" class="tag">Default</Button>
                           <Input v-model="domainName" placeholder="example.com *.example.com" style="width: 300px" />
                       </div>-->
                   </div>
                   <div v-show="step===1">
                       <div class="ctrl-wizard__title">Listening Address and Port</div>
                       <div class="ctrl-wizard__description">
                           <div>
                               Specify the inbound IP address and port for this load balancer.
                               This should be one of the system’s IP addresses (or a "wildcard" listen).
                               Please refer to the listen directive in NGINX documentation.
                           </div>
                       </div>

                   </div>
                   <div v-show="step===2">
                       <div class="ctrl-wizard__title">Pool Servers</div>
                       <div class="ctrl-wizard__description">
                           <div>
                               Specify the backend servers of the load balancing pool.
                               A backend server is identified by an IP address or FQDN.
                               An optional port may be specified by appending :port to the address or FQDN.
                               If no port is provided, the default is port 80.
                               By default, traffic to this load balancer will be evenly distributed across the backend servers.
                               This corresponds with the server directive in an upstream group in NGINX configuration.
                           </div>
                       </div>

                   </div>
                   <div v-show="step===3">
                       <div class="ctrl-wizard__title">Pool Name</div>
                       <div class="ctrl-wizard__description">
                           <div>
                               Please specify a name for the load balancing pool.
                               This corresponds with the group name in the upstream directive in NGINX configuration.

                           </div>
                       </div>

                   </div>
                   <div v-show="step===4">
                       <div class="ctrl-wizard__title">Route</div>
                       <div class="ctrl-wizard__description">
                           <div>
                               This load balancer can be limited to service a specific URI pattern.
                               The default behavior is to match any request URI by using the "/" prefix.
                               Please refer to the location directive in NGINX documentation.

                           </div>
                       </div>

                   </div>
                   <Form ref="balanceForm" :model="balanceForm" :rules="balanceFormRules">
                       <FormItem prop="user" v-show="step === 0">
                           <Button  icon="md-close" class="tag">Default</Button>
                           <Input type="text" v-model="balanceForm.domain" placeholder="example.com *.example.com">
                           </Input>
                       </FormItem>
                       <FormItem prop="user" v-show="step === 1">
                           <Input type="text" v-model="balanceForm.domain" placeholder="192.168.101.1:80">
                           </Input>
                       </FormItem>
                       <FormItem prop="user" v-show="step === 2">
                           <Button  icon="md-close" class="tag">Default</Button>
                           <Input type="text" v-model="balanceForm.domain" placeholder="IP address or FQDN">
                           </Input>
                       </FormItem>
                       <FormItem prop="user" v-show="step === 3">
                           <Input type="text" v-model="balanceForm.domain" placeholder="name">
                           </Input>
                       </FormItem>
                       <FormItem prop="user" v-show="step === 4">

                       </FormItem>

                   </Form>
                   <div class="tip">

                   </div>


               </div>
               <div class="ctrl-wizard__actions" slot="footer">
                    <Button @click="step--" class="prev" v-show="step">后退</Button>
                    <Button type="primary" class="next" @click="step++" v-show="step<3">下一步</Button>
               </div>

           </Modal>
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

export default {
    data () {
        return {
            dropdown: true,
            domainModel: true,
            domainName: '',
            step: 0,
            balanceForm: {},
            balanceFormRules: {

            }
        }

    },

    components: {
        PopTip
    },
    methods: {

        /* 获取元素坐标 */
        getXY (obj) {
          let x = 0,y = 0;
          if (obj.getBoundingClientRect) {
              let box = obj.getBoundingClientRect();
              let D = document.documentElement;
               x = box.left + Math.max(D.scrollLeft, document.body.scrollLeft) - D.clientLeft ;
               y = box.top + Math.max(D.scrollTop, document.body.scrollTop) - D.clientTop

              //x = box.left
              //x2 = box.right
             // y = box.top + box.height / 2

          }
          else{
              for (; obj != document.body; x += obj.offsetLeft, y += obj.offsetTop, obj = obj.offsetParent) {}
          }
          return {
              x: x,
              y: y,
          }
      },
        /* 元素相对画布位置 */
        getPosition (obj) {
            let x = this.getXY(obj).x - this.getXY(this.$refs.canvas).x
            let y = this.getXY(obj).y - this.getXY(this.$refs.canvas).y
            return {
                x:  x,
                y : y
            }
        },
        /* 获取画笔起始位置 */
        getLineStart(obj) {
           // console.log(obj.getBoundingClientRect().width)
            let x = this.getPosition(obj).x + obj.getBoundingClientRect().width
            let y = this.getPosition(obj).y + obj.getBoundingClientRect().height / 2
            return {
                x: x,
                y: y
            }
        },
        /* 获取画笔结束位置 */
        getLineEnd(obj) {
            let x = this.getPosition(obj).x - 10
            let y = this.getPosition(obj).y + obj.getBoundingClientRect().height / 2
            return {
                x: x,
                y: y
            }
        },
        /* drawLine 绘制关系连线 */
        drawLine (start, end) {
            let c = document.getElementById('canvas');
            let ctx = c.getContext("2d");
            ctx.beginPath();

            ctx.moveTo(this.getLineStart(start).x, this.getLineStart(start).y); // 创建起点


            let r = (this.getLineEnd(end).x - this.getLineStart(start).x)/2
            let x1 = this.getLineStart(start).x + r
            let y1 = this.getLineStart(start).y
            let x2 = x1
            let y2 = y1 + r

            let x3, y3, x4, y4
            x3 = x1
            y3 = this.getLineEnd(end).y
            x4 = this.getLineEnd(end).x
            y4 = y3

            if ( this.getLineStart(start).y === this.getLineEnd(end).y ) { // 水平连线时
                ctx.lineTo(this.getLineEnd(end).x, this.getLineEnd(end).y);
            } else {
                ctx.arcTo(x1, y1, x2, y2, r);   // 创建一个弧
                ctx.lineTo(x1, this.getLineEnd(end).y - r);           // 继续垂直线
                ctx.arcTo(x3, y3, x4, y4, r);   // 创建一个弧
            }

            ctx.strokeStyle="#e5e5e5";
            ctx.lineWidth=3;
            ctx.stroke();
        }
    },
    mounted() {

        this.drawLine(this.$refs.start1, this.$refs.end1)
        this.drawLine(this.$refs.start1, this.$refs.end2)
        this.drawLine(this.$refs.start1, this.$refs.end3)
        this.drawLine(this.$refs.start1, this.$refs.end4)
        this.drawLine(this.$refs.start1, this.$refs.end5)

    }
}
</script>
<style lang="less" scoped>
  @import "L7-config";

</style>
