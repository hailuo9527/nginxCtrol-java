<template>
    <div class="l7_config_layout">
       <div class="l7_config_column column_header">
           <div class="header_item">
                Virtual Servers <PopTip content="123" placement="bottom"></PopTip>
           </div>
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
        .l7_config_column{
            width: 25%;
            box-sizing: border-box;
            position: relative;
            font-size: 18px;
            line-height: 54px;
            border-bottom: 1px solid #e5e5e5;
        }
        .column_header{
            height: auto;
        
            background-color: #f8f8f8;
            position: relative;
            overflow: visible;
            z-index: 1;
        }
        .header_item{
            position: relative;
            font-size: 18px;
            line-height: 54px;
            border-bottom: 1px solid #e5e5e5;
        }
        
    }
</style>