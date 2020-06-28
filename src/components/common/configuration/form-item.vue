<template>
    <div class="form-item" :class="classStatus">
        <div class="form-item-header" >
            <i-switch v-model="expand" :disabled="onlyShowConfig" v-if="!important && !noSwitch" @on-change="expandChange" ></i-switch>
            <span class="title" :class="title == 'USE AS NGINX API LOCATION'||title == 'ACTIVE HEALTHCHECK'||title == 'QUEUEING'||title == 'ntlm'||title == 'PERSISTENT STATE'? 'title-color':''">{{title}}</span>
            <PopTip :content="info"  placement="right"></PopTip>
            <div class="actions" v-if="expand && !actionButton">
                <Button shape="circle" icon="md-close" @click="cancel" v-if="showEdit"></Button>
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
            title: '',
            info: '',
            childTitle: '',
            important: false,
            onlyShow: false, // 只展示无编辑
            noSwitch: false,
            defaultIsShow: false,
            modify: {
                type: Boolean,
                default: false
            },
            open: {
                type: Boolean,
                default: false
            },
            valid: false,
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data () {
          return {
              showEdit: false,
              expand: false,
              onlyShowConfig: false,
              actionButton: false
          }
        },
        components: {
            PopTip
        },
        watch: {
            open: {
                handler(nv,ov){
                    this.expand = nv

                    if (this.onlyShow){ // 只展示无编辑功能
                        this.showEdit = false
                    } else {
                        if (nv) { // 初始值为true
                           // console.log(1)
                            if (this.important){

                                if (!this.modify){ // 新增模式下
                                    this.showEdit = true
                                    this.$emit('edit', nv)
                                 }else { // 修改模式下
                                    this.showEdit = false
                                    this.$emit('edit', false)
                                }
                            }else {  //初始值为false 打开编辑模式

                                if (!this.modify){ // 新增模式下
                                    this.showEdit = true
                                    this.$emit('edit', nv)
                                }
                            }


                        }else{
                            this.showEdit = true
                        }

                    }
                },
                immediate: true
            },
            showEdit: {
                handler(nv,ov) { // 通知父组件编辑模式打开， 未保存
                    if (!this.onlyShow) {
                        this.$emit('edit', nv)
                        //console.log('showEdit变化')
                    }
                },

            },
            valid(nv, ov) {
                if (nv) {
                    this.showEdit = false
                }
            },
            disabled(nv) {
                //console.log(nv+ 'disabled')
                if (nv){
                    this.expand = false
                    this.onlyShowConfig = true
                }else{
                    this.onlyShowConfig = false
                }

            },
            onlyShow(nv) {
                //console.log(this.onlyShowConfig)
                if (nv && !this.onlyShowConfig){
                    this.actionButton = nv
                } else {
                    //console.log('423434')
                }

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
                if(this.onlyShow) {  // onlyshow 为真则只显示预览
                    this.showEdit = false
                }else if(!data){
                    this.$emit('edit', data)
                }
                this.$emit('closeConfig',data)
            },
            cancel() {
                if (!this.open){
                    this.expand = false
                } else this.showEdit = this.important;
                this.$emit('cancel')
            },

            ok () {
                this.$emit('saveConfig')
                if(this.valid){
                    this.showEdit = false
                }

            },

        },
        mounted() {
            this.onlyShowConfig = !!(this.$route.params.L7||this.$route.params.app)
            this.actionButton = !!(this.$route.params.L7||this.$route.params.app)
            if (this.onlyShow && !this.onlyShowConfig){
                this.actionButton = true
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
        transition: all .2s;
        .form-item-header{
            display: flex;
            height: 30px;
            align-items: center;
            transition: border-color 0.1s linear, background-color 0.1s linear;
        }
        .title{
            margin: 0 10px;
            font-size: 12px;
            letter-spacing: 1.2px;
            color: #333;
            font-weight: bold;
        }
        .title-color {
            color: blue;
        }
        .actions{
            flex: 1;
            text-align: right;
            height: 30px;
            .ivu-btn-circle.ivu-btn-icon-only, .ivu-btn-circle-outline.ivu-btn-icon-only{
                width: 40px;
                height: 30px;
                border-radius: 15px;
                margin-left: 10px;
            }
        }
        &.form-item-edit{
            background: #fff;
            transition: all .2s;
        }
        &.important {
            border-bottom: 3px solid #000;
        }

    }


</style>
