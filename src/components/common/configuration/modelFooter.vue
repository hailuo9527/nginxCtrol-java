<template>
    <div class="diy-footer">
        <div class="diy-footer_left">
            <Button @click="remove" v-if="showRemoveButton">删除{{name}}</Button>
        </div>
        <div class="diy-footer_right">
            <Button @click="cancel">取消</Button>
            <Button type="primary"  @click="handleSubmit">保存</Button>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            name: '',
            showRemoveButton: false
        },
        methods: {
            remove() {
                this.$emit('remove')
            },
            cancel() {
                this.$emit('cancel')
            },
            handleSubmit() {
                this.$emit('save')
            }
        }
    }
</script>
<style lang="less">
    .diy-footer{
        display: flex;
        justify-content: space-between;
        padding: 0 22px;
        &_left{

        }
        &_right{

        }
    }

</style>
