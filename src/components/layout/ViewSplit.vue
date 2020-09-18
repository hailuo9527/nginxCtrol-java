<template>
    <div class="view-split">
        <div class="split-top">
            <slot name="splitTop"></slot>
        </div>
        <div class="split-bottom" ref="splitBottom">
            <Tabs value="name1">
                <TabPane label="近期任务" name="name1">
                    <div v-show="isTaskbarShow">
                        <slot name="splitBottom"></slot>
                    </div>
                </TabPane>
                <Icon type="md-arrow-up" @click="handleTabsAdd" slot="extra" :class="{'clickTabsIcon':isTaskbarShow}" />
            </Tabs>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
    name: "ViewSplit",
    computed: {
        ...mapState({
            isTaskbarShow: (state) => state.taskbar.isTaskbarShow,
        }),
    },
    methods: {
        ...mapMutations(["updateIsTaskbarShow"]),
        //  点击任务栏展开收缩图标
        handleTabsAdd() {
            this.updateIsTaskbarShow(!this.isTaskbarShow);
        },
    },
};
</script>
<style scoped lang="less">
.view-split {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    .split-top {
        flex: 1;
        overflow-y: auto;
    }
    .split-bottom {
        // background-color: yellow;
        position: relative;
        width: 100%;
        text-align: center;
        z-index: 9999;
        background-color: #fff;
        .parting-line {
            width: 100%;
            height: 16px;
            line-height: 16px;
            background-color: #f8f8f9;
            border: 1px solid #dcdee2;
            user-select: none;
            box-sizing: border-box;
            &:hover {
                cursor: move;
            }
        }

        /deep/.ivu-tabs-bar {
            margin-bottom: 0;
            .ivu-tabs-nav-right {
                margin-top: 5px;
                margin-right: 10px;
                .ivu-icon {
                    font-size: 1.4rem;
                    transition: 0.5s;
                    &:hover {
                        cursor: pointer;
                        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
                    }
                }
                .clickTabsIcon {
                    transform: rotate(180deg);
                }
            }
        }
        /deep/.ivu-table-header thead tr th {
            padding: 0;
        }
    }
}
</style>
