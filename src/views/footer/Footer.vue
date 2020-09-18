<template>
    <div class="footer">
        <Tabs value="name1">
            <TabPane label="近期任务" name="name1">近期任务</TabPane>
            <TabPane label="警告" name="name2">警告</TabPane>
        </Tabs>
    </div>
</template>

<script>
export default {
    name: "Footer",
    data() {
        return {};
    },
};
</script>

<style lang="less" scoped></style>
