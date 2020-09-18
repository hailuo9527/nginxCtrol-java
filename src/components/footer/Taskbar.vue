<template>
    <div class="taskbar">
        <Table border :columns="columns" :data="taskbarList" height="200">
            <!-- 状态 -->
            <template slot-scope="{ row }" slot="status">
                <div v-if="row.status==='execution'">正在执行中</div>
                <div v-else-if="row.status==='finished'">执行完成</div>
                <div v-else>执行失败</div>
            </template>
            <!-- 进度条 -->
            <template slot-scope="{ row }" slot="rate">
                <Progress :percent="row.rate" status="active" />
            </template>
        </Table>
    </div>
</template>

<script>
import { mapState,mapMutations} from "vuex";
export default {
    name: "Taskbar",
    data() {
        return {
            columns: [
                {
                    title: "用户",
                    key: "cUser",
                    resizable: true,
                    width: 150,
                },
                {
                    title: "任务名称",
                    key: "tName",
                    resizable: true,
                    width: 150,
                },
                {
                    title: "消息",
                    key: "message",
                    resizable: true,
                },
                {
                    title: "进度",
                    slot: "rate",
                    resizable: true,
                },
                {
                    title: "时间",
                    key: "cTime",
                    resizable: true,
                    width: 200,
                },
                {
                    title: "状态",
                    slot: "status",
                    resizable: true,
                    width: 150,
                },
            ],
            // dataTable: [
            //     {
            //         cUser: "张三",
            //         tName: "喝酒",
            //         message: "喝到脸红了",
            //         cTime: "就在昨天",
            //         status: "不省人事中....",
            //     },
            // ],
        };
    },
    computed: {
        ...mapState({
            taskbarList: (state) => state.taskbar.taskbarList,
            isTaskbarShow: (state) => state.taskbar.isTaskbarShow,
        }),
    },
    methods:{
        ...mapMutations([
            "updateIsTaskbarShow"
        ]),
    },
    mounted() {
        setTimeout(() => {
            this.dataTable = [];
        }, 5 * 1000);
    },
    watch:{
        taskbarList(vl,ol){
            if(vl.length === 0){
                this.updateIsTaskbarShow(false);
            }
        },
    }
};
</script>

<style lang="less" scoped>
</style>