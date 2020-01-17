<template>
    <div class="aside-wrap">
        <Input suffix="ios-search" placeholder="Systems"  clearable />
        <div style="display: flex; justify-content: center">
            <div class="add-list" @click="l7_model_add = true">
                <!--      <span>添加</span>-->
                <Tooltip content="添加L7设备" placement="top" max-width="200" theme="light" >
                    <Icon type="md-add" color="#fff" :size="25"/>
                </Tooltip>
                <!--<Icon type="md-add" color="#fff" :size="25"/>-->
            </div>
        </div>


        <div class="aside-list">
            <div class="aside-list-wrap">
                <div class="aside-item"
                     :class="item.l7ServerId === $route.params.L7 ? 'active' : ''"
                     @click="changeAside(item)"
                     v-for="(item, index) in asideList" :key="item.l7ServerId">
                    <div class="title">
                        <span class="online" ></span>
                        {{item.l7ServerName}}
                    </div>
                    <div class="info">{{item.l7ServerId}}</div>
                    <Icon type="ios-close-circle" title="删除此项" class="delete" size="18" color="#555" @click.stop="delL7ServerInfo(item.l7ServerId)"/>
                </div>
            </div>
            <div class="load-wrap" style="display: flex; justify-content: center;align-items: center;" v-if="listLoading">
                <Loading />
            </div>


        </div>

        <Modal v-model="l7_model_add" width="360">
            <p slot="header" style="color:#333;text-align:center">
                <span>添加NGINX服务器</span>
            </p>
            <div style="text-align:center">


            </div>
            <div slot="footer">
                <Button type="primary" size="large" long :loading="modal_loading" @click="addL7('formValidate')">确认添加</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    import { addL7ServerInfo, delL7ServerInfo } from "../../api/L7";

    export default {
        name: 'MyAside',
        data () {
            return {
                l7_model_add: false,
                add_l7_form: {},
                ruleValidate: {
                    l7ServerId: [
                        { required: true, message: '序列号不能为空', trigger: 'blur' }
                    ],
                    l7ServerName: [
                        { required: true, message: '自定义名称不能为空', trigger: 'blur' }
                    ]
                },
                modal_loading: false,


            }
        },
        watch : {
          asideList(newVal, oldVal) {
              console.log(...arguments)
          }
        },
        computed: {
            ...mapState({
                asideList: state => state.L7.asideList,
                l7ServerId: state => state.L7.activeAside.l7ServerId,
                listLoading: state => state.L7.listLoading
            })
        },
        methods: {
            ...mapActions(['getL7AsideList']),
            ...mapMutations([
                'L7setActiveAside'
            ]),
            changeAside (item) {
                if(item.l7ServerId === this.l7ServerId) return
                this.L7setActiveAside(item)
                this.$router.push(`/L7/${item.l7ServerId}`)
            },
            addL7(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.modal_loading = true
                        addL7ServerInfo(this.add_l7_form).then(res => {
                           // console.log(res)
                            this.modal_loading = false
                            if (this.asyncOk(res)) {
                                this.l7_model_add = false
                                this.getL7AsideList()
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    } else {
                        // this.$Message.error('Fail!')
                    }
                })
            },
            async delL7ServerInfo (code) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确定要删除这条吗？删除后该设备信息将会丢失！</p>',
                    loading: true,
                    onOk: async () => {
                        let res = await delL7ServerInfo({ l7ServerId: code })
                        this.$Modal.remove()
                        if (this.asyncOk(res)) {
                            this.$Message.success('删除成功！')
                            this.getL7AsideList()
                        } else {
                            this.$Message.error('删除失败！')
                        }
                    }
                })
            },
        },
        created() {
            if (this.$route.params.L7) {
                console.log(this.asideList)
                this.asideList.map((item) => {
                    if(item.l7ServerId === this.$route.params.L7) {
                        this.L7setActiveAside(item)
                    }
                })
            }
        },

    }
</script>
<style lang="less" scoped>
    @import 'aside';
</style>
