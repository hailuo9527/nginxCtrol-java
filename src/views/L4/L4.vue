<template>
    <div class="content_wrap">
        <Aside/>
        <div class="content_right" v-if="asideList.length">
            <div class="content_right_scroll">
                <div class="content_header">
                    <div class="header_title">
                        <span>{{activeAside.l4_name}} <Icon class="icon" @click="openDrawer = true" type="md-settings" /></span>
                        <Drawer title="Basic Drawer" placement="left" :closable="false" v-model="openDrawer">
                            <p>{{test}}</p>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                        </Drawer>
                    </div>
                    <div class="header_tab">
                        <div class="tab">
                            <!--<router-link :to="`/L4/${$route.params.id}/nginx`" class="tab_item">nginx</router-link>-->
                           <!-- <router-link :to="`/L4/${$route.params.id}`" class="tab_item">系统</router-link>-->
                            <router-link :to="`/L4/${$route.params.L4}/chart`" class="tab_item">{{activeAside.l4_name}}</router-link>
                            <router-link :to="`/L4/${$route.params.L4}/config`" class="tab_item">配置</router-link>
                        </div>


                        <apply-filter v-if="$route.name === 'L4-chart'"/>
                    </div>
                </div>
                <router-view class="content_main"></router-view>
            </div>
        </div>
        <div class="content_right" v-else>
            <div class="no-data">
                暂无数据，请先去添加L4设备
            </div>

        </div>
    </div>
</template>
<script>
    import Aside from '@/components/aside/L4-aside.vue'
    import applyFilter from '@/components/common/filter.vue'
    import { deviceManage } from "../../api/L4";
    import { mapState, mapMutations } from 'vuex'
    export default {
        name: 'L4',
        data () {
            return {
                openDrawer: false,
                test: ''
            }
        },
        components: {
            Aside, applyFilter
        },
        methods: {
            ...mapMutations([
                'setActiveAside'
            ]),
        },
        watch: {
            openDrawer (val, oldVal) {
                if (val) {

                }
            }
        },
        computed: {
            ...mapState({
                asideList: state => state.L4.asideList,
                activeAside: state => state.L4.activeAside
            })
        },



        beforeRouteLeave (to, from, next) {
            // 导航离开该组件的对应路由时调用
            // 可以访问组件实例 `this`
            this.setActiveAside(this.asideList[0])
            next()
        },

    }
</script>
<style lang="less" scoped>
    @import "L4";

</style>
