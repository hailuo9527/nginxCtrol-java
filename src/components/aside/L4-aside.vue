<template>
    <div class="aside-wrap">
        <Input suffix="ios-search" placeholder="搜索L4"  v-model.trim="searchString"  clearable />
        <div style="display: flex; justify-content: center">
            <div class="add-list" @click="l4_model_add = true">
                <!--      <span>添加</span>-->
                <Tooltip content="添加L4设备" placement="top" max-width="200" theme="light" >
                    <Icon type="md-add" color="#fff" :size="25"/>
                </Tooltip>
                <!--<Icon type="md-add" color="#fff" :size="25"/>-->
            </div>
        </div>


        <div class="aside-list">
            <div class="aside-list-wrap">
                <div class="aside-item"
                     :class="item.l4_code === $route.params.L4 ? 'active' : ''"
                     @click="changeAside(item)"
                     v-for="(item, index) in filterAside" :key="item.l4_code">
                    <div class="title">
                        <span class="online" ></span>
                        {{item.l4_name}}
                    </div>
                    <div class="info">{{item.l4_code}}</div>
                    <Icon type="ios-close-circle" title="删除此项" class="delete" size="18" color="#555" @click.stop="removeDevice(item.l4_code)"/>
                </div>
            </div>
            <div class="aside-list-wrap" style="text-align: center" v-if="!filterAside.length">
                暂无数据
            </div>
            <div class="load-wrap" style="display: flex; justify-content: center;align-items: center;" v-if="listLoading">
                <Loading />
            </div>


        </div>

        <Modal v-model="l4_model_add" width="360">
            <p slot="header" style="color:#333;text-align:center">
                <span>添加机器</span>
            </p>
            <div style="text-align:center">
                <Form ref="formValidate" :model="add_l4_form" :rules="ruleValidate" label-position="left">
                    <FormItem label="机器序列号" prop="l4_code">
                        <Input v-model.trim="add_l4_form.l4_code" placeholder="请输入机器序列号"></Input>
                    </FormItem>
                    <FormItem label="自定义名称" prop="l4_name">
                        <Input v-model.trim="add_l4_form.l4_name" placeholder="请输入自定义名称"></Input>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="add_l4_form.l4_remarks" placeholder="请输入备注"></Input>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="add_l4_form.domainName" placeholder="请输入备注"></Input>
                    </FormItem>
                </Form>

            </div>
            <div slot="footer">
                <Button type="primary" size="large" long :loading="modal_loading" @click="addL4('formValidate')">确认添加</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import { mapState, mapMutations, mapActions } from 'vuex'
    import { addDevice, removeDevice } from "../../api/L4";

    export default {
        name: 'MyAside',
        data () {
            return {
                l4_model_add: false,
                add_l4_form: {},
                ruleValidate: {
                    l4_code: [
                        { required: true, message: '序列号不能为空', trigger: 'blur' }
                    ],
                    l4_name: [
                        { required: true, message: '自定义名称不能为空', trigger: 'blur' }
                    ]
                },
                modal_loading: false,
                searchString: ''

            }
        },
        computed: {
            ...mapState({
                asideList: state => state.L4.asideList,
                l4_code: state => state.L4.activeAside.l4_code,
                listLoading: state => state.L4.listLoading
            }),
            // 匹配搜索
            filterAside: function () {
                let arr = this.asideList
                let searchString = this.searchString

                if(!searchString){
                    return arr;
                }
                arr = arr.filter(function(item){
                    if(item.l4_name.indexOf(searchString) !== -1){
                        return item;
                    }
                })

                // 返回过来后的数组
                return arr;
            }
        },
        methods: {
            ...mapActions(['getAsideList']),
            ...mapMutations([
                'setActiveAside'
            ]),
            changeAside (item) {
                if(item.l4_code === this.l4_code) return
                this.setActiveAside(item)
                this.$router.replace(`/L4/${item.l4_code}/chart`)
            },
            addL4(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.modal_loading = true
                        addDevice(this.add_l4_form).then(res => {
                           // console.log(res)
                            this.modal_loading = false
                            if (this.asyncOk(res)) {
                                this.l4_model_add = false
                                this.getAsideList().then(res => {
                                    /* 第一次添加 */
                                    if (this.asyncOk(res) && !this.$route.params.L4){
                                        this.$router.replace(`/L4/${this.l4_code}/chart`)
                                    }
                                })
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    } else {
                        // this.$Message.error('Fail!')
                    }
                })
            },
            async removeDevice (code) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确定要删除这条吗？删除后该设备信息将会丢失！</p>',
                    loading: true,
                    onOk: async () => {
                        let res = await removeDevice({ l4_code: code })
                        this.$Modal.remove()
                        if (this.asyncOk(res)) {
                            this.$Message.success('删除成功！')
                            this.getAsideList().then(res => {
                                if (this.asyncOk(res) && !res.data.result.length){
                                    this.$router.push(`/L4`)
                                }
                                if (code === this.$route.params.L4){
                                    this.$router.replace(`/L4/${this.l4_code}/chart`)
                                }
                            })
                        } else {
                            this.$Message.error('删除失败！')
                        }
                    }
                })
            },
        },
        created() {
            this.getAsideList().then(res => {
                if (this.asyncOk(res) && res.data.result.length) {
                    if(!this.$route.params.L4){
                        this.$router.replace(`/L4/${this.l4_code}/chart`)
                    }else{
                        this.asideList.map((item) => {
                            if(item.l4_code === this.$route.params.L4) {
                                this.setActiveAside(item)
                            }
                        })
                    }

                }
            })
        },
    }
</script>
<style lang="less" scoped>
    @import 'aside';
</style>
