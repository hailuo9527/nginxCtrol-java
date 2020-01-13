<template>
    <div class="l7_config_layout">
       <div class="l7_config_column column_header">
           <div class="header_item">
                Virtual Servers
               <PopTip content="123" style="margin-left: 5px;" placement="bottom"></PopTip>
               <Icon type="md-add" size="26" color="#333" class="add"/>
           </div>
       </div>
        <div class="l7_config_column column_header">
            <div class="header_item">
                Locations
                <PopTip content="123" style="margin-left: 5px;" placement="bottom"></PopTip>
                <Icon type="md-add" size="26" color="#333" class="add"/>
            </div>
        </div>
        <div class="l7_config_column column_header">
            <div class="header_item">
                Upstream Groups
                <PopTip content="123" style="margin-left: 5px;" placement="bottom"></PopTip>
                <Icon type="md-add" size="26" color="#333" class="add"/>
            </div>
        </div>
        <div class="l7_config_column column_header">
            <div class="header_item">
                Upstream Servers
                <PopTip content="123" style="margin-left: 5px;" placement="bottom"></PopTip>
                <Icon type="md-add" size="26" color="#333" class="add"/>
            </div>
        </div>
        <div class="l7_config_column column_body column_body_servers">
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
        <div class="l7_config_column column_body">
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
        <div class="l7_config_column column_body column_body_upstream">
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            </div><div class="upstream-groups">
            <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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
            <div class="upstream-groups">
                <div class="ctrl-list-item ctrl-list-item_corners list-selected">
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

        <!-- 关系连线 canvas -->
        <div class="ctrl-relations-canvas">
            <canvas width="3000" height="4000" style="width: 2400px; height: 3200px;"></canvas>
        </div>
    </div>
</template>
<script>
import PopTip from '@/components/common/pop-tip'
export default {
    components: {
        PopTip
    }
}
</script>
<style lang="less" scoped>
    .l7_config_layout{
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        height: 100%;

        .l7_config_column{
            color: #333;
            width: calc(25%);
            padding: 0 20px;
            box-sizing: border-box;
            position: relative;
            height: calc(100% - 56px);
            overflow-y: overlay;
            overflow-x: hidden;

        }
        .column_header{
            line-height: 54px;
            height: auto;
            font-size: 18px;
            background-color: #f8f8f8;
            position: relative;
            overflow: visible;
            z-index: 1;
        }
        .header_item{
            border-bottom: 1px solid #e5e5e5;
            position: relative;
            font-size: 18px;
            line-height: 54px;
            .add{
                width: 25px;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                cursor: pointer;
                opacity: 0.3;
                transition: opacity 0.1s linear;
                display: flex;
                align-items: center;
                &:hover{
                    opacity: 1;
                }
            }
        }
        .column_body{
            //margin-top: 20px;
            padding-top: 20px;
            .servers{
                .server_item{
                    background: #ffffff;
                    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
                    padding: 10px 15px 13px;
                    cursor: pointer;
                    position: relative;
                    margin-bottom: 10px;
                }
                .selected{
                    box-shadow: 0 2px 15px 0 rgba(5, 48, 118, 0.3);
                    background: #2a79f8;
                    color: #fff;
                    .ctrl-server__protocols {
                        color: rgba(255, 255, 255, 0.6);
                    }
                    .ctrl-server__port {
                        background: rgba(0, 0, 0, 0.2);
                        color: #fff;
                    }
                }
                .ctrl-server__edit {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 10px;
                    height: 11px;
                    visibility: hidden;
                }
                .ctrl-server__server-name {
                    font: 14px/16px 'RobotoMedium', Arial, sans-serif;
                    font-weight: normal;
                    margin: 0 0 4px 0;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    letter-spacing: 0;
                    padding-right: 10px;
                    span{
                        font-size: 16px;
                    }
                }
                .ctrl-server__protocols {
                    font: 10px/11px 'RobotoBold', Arial, sans-serif;
                    font-weight: normal;
                    color: rgba(136, 136, 136, 0.6);
                    text-transform: uppercase;
                    margin-bottom: 15px;
                }
                .ctrl-server__port {
                    font: 10px/15px 'RobotoMedium', Arial, sans-serif;
                    font-weight: normal;
                    display: inline-block;
                    padding: 0 4px;
                    border-radius: 2px;
                    margin-right: 3px;
                    background: #f0f0f0;
                    color: #666666;
                }
            }
            .locations{
                .ctrl-list-item {
                    line-height: 33px;
                    padding: 0 10px;
                    letter-spacing: 0;
                    cursor: pointer;
                    border-radius: 100px;
                    border: 1px solid transparent;
                    margin-bottom: 8px;
                    position: relative;
                    &:hover{
                        background: #e5e5e5;
                        .ctrl-list-item__edit {
                            visibility: visible;
                        }
                    }

                }
                .ctrl-location {
                    display: block;
                    margin: 0 -10px;
                    padding: 0 30px 0 10px;
                    border-radius: 100px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .ctrl-location_default {
                    border: 1px dashed #ababab;
                }
                .ctrl-location__label {
                    position: absolute;
                    right: 35px;
                }

            }
            .upstream-groups{
                .ctrl-list-item {
                    line-height: 33px;
                    padding: 0 10px;
                    letter-spacing: 0;
                    cursor: pointer;
                    border-radius: 100px;
                    border: 1px solid transparent;
                    margin-bottom: 8px;
                    position: relative;
                    &_corners{
                        border-radius: 2px;
                    }
                    &:hover{
                        background: #e5e5e5;
                        .ctrl-list-item__corner-left, .ctrl-list-item__corner-right{
                            visibility: visible;
                        }
                        .ctrl-list-item__corner-inner{
                            background: #e5e5e5;
                        }
                        .ctrl-list-item__edit {
                            visibility: visible;
                        }
                    }
                    &__corner-inner{
                        width: 25px;
                        height: 27px;
                        display: inline-block;
                        border-radius: 3px;
                        transform: rotate(45deg);
                        margin-top: 4px;
                        margin-left: 5px;
                    }

                }
                .ctrl-list-item__corner-left, .ctrl-list-item__corner-right {
                    position: absolute;
                    top: -1px;
                    transform: rotateY(-45deg);
                    width: 19px;
                    height: 34px;
                    overflow: hidden;
                    visibility: hidden;
                    z-index: 999;
                }
                .ctrl-list-item__corner-left {
                    left: -15px;

                }
                .ctrl-list-item__corner-right {
                    right: -17px;
                    .ctrl-list-item__corner-inner {
                        margin-left: -13px;
                    }
                }
            }
            .ctrl-list-item__edit{
                visibility: hidden;
                position: absolute;
                right: 5px;
                top: 5px;
                width: 25px;
                height: 25px;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                &:hover{
                    background: #fff;
                    border-radius: 50%;
                    color: #000;
                }
            }
            .list-selected {
                background: #2a79f8 !important;
                box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.1);
                color: #fff;
                border: 1px solid #2a79f8;
                .ctrl-location{
                    border-color: transparent;
                }
                .ctrl-list-item__corner-inner {
                    background: #2a79f8!important;
                }
                .ctrl-list-item__corner-left, .ctrl-list-item__corner-right{
                    visibility: visible;
                }
            }
        }
        .column_body_servers{
            height: calc(100% - 56px - 75px);
        }
        .column_body_upstream{
            padding-bottom: 70px;
        }
        .ctrl-relations-canvas {
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            overflow: hidden;
            z-index: 0;
        }
    }
</style>
