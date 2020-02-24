<template>
    <div class="form-item" :class="classStatus">
        <div class="form-item-header" >
            <i-switch v-model="expand" v-if="!important" @on-change="expandChange" ></i-switch>
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


        <slot name="edit" v-if="expand && showEdit"></slot>
        <slot name="show" v-if="expand && !showEdit"></slot>
    </div>
</template>

<script>
    import PopTip from '@/components/common/pop-tip'
    export default {
        props: {
            obj:[Array, Object],
            title: '',
            info: '',
            childTitle: '',
            important: false

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
            //  this.expand = !this.isEmptyObject(newVal)
          }
        },
        computed: {
          classStatus: function () {
              let className

              if (this.important) {
                  className = 'form-item-edit important'
              } else if (this.expand){
                  className = 'form-item-edit'
              } else {
                  className = ''
              }
              return className
          }
        },
        methods: {
            editHandler () {
                this.showEdit = !this.showEdit
            },
            expandChange (data) {
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
            initStatus (obj) {
                this.showEdit = this.isEmptyObject(obj)
                this.expand = !this.isEmptyObject(obj)
                if ( this.important ) {
                    if (this.isEmptyObject(obj)) {
                        this.expand = true
                        this.showEdit = true
                    }
                }
            }
        },

        mounted() {
            console.log(this.obj)
            if (this.obj instanceof Array){
                if (this.isEmptyObject(this.obj)){
                    this.initStatus(this.obj)
                } else {
                   this.initStatus(this.obj[0])
                }

            } else {
                this.initStatus(this.obj)
                /*this.showEdit = this.isEmptyObject(this.obj)
                this.expand = !this.isEmptyObject(this.obj)
                if ( this.important ) {
                    if (this.isEmptyObject(this.obj)) {
                        this.expand = true
                        this.showEdit = true
                    }
                }*/
            }


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
            font-size: 14px;
            color: #333;
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
        &.important {
            border-bottom: 3px solid #000;
        }

    }


</style>
