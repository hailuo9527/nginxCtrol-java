<template>
    <div class="form-item" :class="expand ? 'form-item-edit': ''">
        <div class="form-item-header" >
            <i-switch v-model="expand"  @on-change="expandChange" ></i-switch>
            <span class="title">{{title}}</span>
            <PopTip :content="info"  placement="right"></PopTip>
            <div class="actions" v-if="expand">
                <Button shape="circle" icon="md-close" @click="showEdit = !showEdit" v-if="showEdit"></Button>
                <Button  shape="circle" ghost type="primary" @click="ok" v-if="showEdit" icon="md-checkmark"></Button>
                <Button shape="circle" icon="md-create" @click="editHandler" v-if="!showEdit"></Button>
            </div>
            <div class="actions" v-if="!expand" >
                {{childTitle}}
            </div>
        </div>
        <div class="ctrl-edit-item ctrl-edit-item_edit" v-if="expand && showEdit">
            <slot name="edit"></slot>
        </div>
        <div class="ctrl-edit-item" v-if="expand && !showEdit">
            <slot name="show"></slot>
        </div>
    </div>
</template>

<script>
    import PopTip from '@/components/common/pop-tip'
    export default {
        props: {
            obj: {
                type: Object,
                default: () => {}
            },
            title: '',
            info: '',
            childTitle: '',

        },
        data () {
          return {
              showEdit: false,
              expand: false,
          }
        },
        components: {
            PopTip
        },
        watch: {
          obj(newVal, oldVal){
              console.log(...arguments)
              this.expand = !this.isEmptyObject(newVal)
          }
        },
        methods: {
            editHandler () {
                this.showEdit = !this.showEdit
            },
            expandChange (data) {
               // console.log(data)
                if (!data) {
                    this.showEdit = false
                    this.$emit('closeConfig')
                }
            },
            ok () {
                console.log( 'ok')
                this.showEdit = false
                this.$emit('saveConfig')
            },
        },

        mounted() {
            this.showEdit = this.isEmptyObject(this.obj)
            this.expand = !this.isEmptyObject(this.obj)

        }
    }
</script>
<style lang="less" scoped>
    .form-item{
        width: 100%;
        position: relative;
        padding: 15px 40px;
        border-bottom: 1px solid #e2e2e2;
        background-color: #f3f3f3;
        .form-item-header{
            display: flex;
            align-items: center;
            transition: border-color 0.1s linear, background-color 0.1s linear;
        }
        .title{
            margin: 0 10px;
        }
        .actions{
            flex: 1;
            text-align: right;
            .ivu-btn-circle.ivu-btn-icon-only, .ivu-btn-circle-outline.ivu-btn-icon-only{
                width: 40px;
                height: 30px;
                border-radius: 15px;
                margin-left: 10px;
            }
        }
        &.form-item-edit{
            background: #fff;
        }

    }
    .ctrl-edit-item {
        position: relative;
        margin: 10px 40px;

        padding: 5px 28px 5px 28px;
        border-left: 2px solid #d8d8d8;
        transition: border-color 0.1s linear;
    }
    .ctrl-edit-item_edit {
        border-left-color: @green;
    }
    .ctrl-edit-item__note {
        padding: 10px 0px;
        font: 12px 'RobotoItalic', Arial, sans-serif;
        font-weight: normal;
        color: #888888;
    }
</style>
