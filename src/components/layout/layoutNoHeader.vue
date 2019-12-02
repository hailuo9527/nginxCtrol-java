<template>
    <div class="layout">
        <div class="logo">ngController</div>
        <div class="layout_content">
            <router-view class="content"/>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'layout_no_header',
    }
</script>
<style lang="less" scoped>
    @import "default";
    .layout:before {
        background: #161616;
    }
</style>
