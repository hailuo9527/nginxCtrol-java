<template>
    <div class="aside-wrap">
        <Input suffix="ios-search" placeholder="Systems"  clearable />
        <div style="display: flex; justify-content: center">
            <div class="add-list" @click="L4_model_add = true">
                <!--      <span>添加</span>-->
                <Tooltip content="添加L4设备" placement="top" max-width="200" theme="light" >
                    <Icon type="md-add" color="#fff" :size="25"/>
                </Tooltip>
                <!--<Icon type="md-add" color="#fff" :size="25"/>-->
            </div>
        </div>

        <div class="aside-list" style="display: flex; justify-content: center;align-items: center;" v-if="listLoading">
            <Loading />
        </div>
        <div class="aside-list" v-else>

            <div class="aside-item"
                 :class="item.L4_code === $route.params.id ? 'active' : ''"
                 @click="changeAside(item)"
                 v-for="(item, index) in asideList" :key="item.L4_code">
                <div class="title">
                    <span class="online" ></span>
                    {{item.L4_name}}
                </div>
                <div class="info">{{item.L4_code}}</div>
                <Icon type="ios-close-circle" title="删除此项" class="delete" size="18" color="#555" @click.stop="removeDevice(item.L4_code)"/>
            </div>

        </div>

        <Modal v-model="L4_model_add" width="360">
            <p slot="header" style="color:#333;text-align:center">
                <span>添加机器</span>
            </p>
            <div style="text-align:center">
                <Form ref="formValidate" :model="add_L4_form" :rules="ruleValidate" label-position="left">
                    <FormItem label="机器序列号" prop="L4_code">
                        <Input v-model.trim="add_L4_form.L4_code" placeholder="请输入机器序列号"></Input>
                    </FormItem>
                    <FormItem label="自定义名称" prop="L4_name">
                        <Input v-model.trim="add_L4_form.L4_name" placeholder="请输入自定义名称"></Input>
                    </FormItem>
                    <FormItem label="备注" >
                        <Input v-model.trim="add_L4_form.L4_remarks" placeholder="请输入备注"></Input>
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
    import { deviceManage } from "../../api/L4";

    export default {
        name: 'MyAside',
        data () {
            return {
                L4_model_add: false,
                add_L4_form: {},
                ruleValidate: {
                    L4_code: [
                        { required: true, message: '序列号不能为空', trigger: 'blur' }
                    ],
                    L4_name: [
                        { required: true, message: '自定义名称不能为空', trigger: 'blur' }
                    ]
                },
                modal_loading: false

            }
        },
        computed: {
            ...mapState({
                asideList: state => state.L4.asideList,
                L4_code: state => state.L4.activeAside.L4_code,
                listLoading: state => state.L4.listLoading
            })
        },
        methods: {
            ...mapActions(['getAsideList']),
            ...mapMutations([
                'setActiveAside'
            ]),
            changeAside (item) {
                if(item.L4_code === this.L4_code) return
                this.setActiveAside(item)
                this.$router.push(`/L4/${item.L4_code}`)
            },
            addL4(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.modal_loading = true
                        deviceManage('post', this.add_L4_form).then(res => {
                            this.modal_loading = false
                            if (this.asyncOk(res)) {
                                this.L4_model_add = false
                                this.getAsideList()
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
                    content: '<p>确定要删除这条吗？</p>',
                    loading: true,
                    onOk: async () => {
                        let res = await deviceManage('delete', { L4_code: code })
                        this.$Modal.remove()
                        if (this.asyncOk(res)) {
                            this.$Message.success('删除成功！')
                            this.getAsideList()
                        } else {
                            this.$Message.error('删除失败！')
                        }
                    }
                })
            },
        },
        created() {
            console.log(this.listLoading)
            if (this.$route.params.id) {
                this.asideList.map((item) => {
                    if(item.L4_code === this.$route.params.id) {
                        this.setActiveAside(item)
                    }
                })
            }
        },
    }
</script>
<style lang="less" scoped>
    @import 'aside';
</style>
