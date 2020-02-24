<template>
    <div class="expand-panel">
        <div class="expand-panel-title">
            <Icon type="ios-arrow-down" class="arrow" :class="expand? 'expand': ''" size="22" @click="expand = !expand"/>
            <span>Advanced settings</span>
        </div>
        <slot v-if="expand"></slot>
    </div>
</template>
<script>
    export default {
        data () {
            return{
                expand: false
            }
        }
    }
</script>
<style lang="less" scoped>
    .expand-panel{
        margin-top: 15px;
        &-title{
            display: flex;
            align-items: center;
            color: #666;
            border-bottom: 1px solid #d8d8d8;
            padding-bottom: 10px;
            .arrow{
                cursor: pointer;
                margin-right: 10px;
                transition: all .2s;
            }
            .expand{
                transform: rotateX(180deg);
            }
        }
    }
</style>
