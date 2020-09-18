<template>
    <div class="layout_default">
        <header>
            <!-- 导航栏 -->
            <Header></Header>
        </header>
        <ViewSplit>
            <!-- 导航路由 -->
            <div slot="splitTop" style="height:100%;">
                <router-view />
            </div>
            <!-- 底部任务栏 -->
            <div slot="splitBottom">
                <Taskbar></Taskbar>
            </div>
        </ViewSplit>
    </div>
</template>
<script>
import Header from "@/components/header/Header.vue";
import ViewSplit from "@/components/layout/ViewSplit";
import Taskbar from "@/components/footer/Taskbar";
export default {
    name: "layout_default",
    data() {
        return {};
    },
    components: {
        Header,
        ViewSplit,
        Taskbar,
    },
};
</script>
<style lang="less">
.layout_default {
    width: 100%;
    height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    header {
        height: 70px;
    }
    .view-split {
        height: calc(100vh - 70px);
    }
}
</style>
