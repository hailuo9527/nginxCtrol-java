<template>
    <my-form-item  :title="title"
                   @closeConfig = "closeConfig"
                   @saveConfig = "saveConfig"
                   @cancel = "cancel"
                   @edit="edit"
                   :modify="modify"
                   :disabled="disabled"
                   :open = "form.allow_deny_state"
                   :valid="valid"
                   info="允许或拒绝特定IP或网络的访问">
        <div slot="edit">
            <draggable v-model="form.ngcAllowDenies" handle=".drag-handle" @start="drag = true"
                       ghost-class="drag-item-ghost"
                       @update="dragEnd"
                       @end="drag = false">
                <transition-group >
                    <div v-for="(item, index) in form.ngcAllowDenies" :key="index">
                        <div  class="ctrl-edit-item ctrl-edit-item_edit drag-edit-item mulity">
                            <span class="drag-handle" v-if="form.ngcAllowDenies.length>1"></span>
                            <Form ref="form" :model="form.ngcAllowDenies[index]" :rules="formRules" class="inlineForm"    @submit.native.prevent>
                                <FormItem label="" class="inline-form-item options">
                                    <Select v-model="item.allow_deny_value">
                                        <Option value="allow">ALLOW</Option>
                                        <Option value="deny">DENY</Option>
                                    </Select>

                                </FormItem>
                                <FormItem label="" class="inline-form-item options" prop="allow_deny_ip">
                                    <Input placeholder="certs/myserver.crt" v-model.trim="item.allow_deny_ip"></Input>
                                </FormItem>

                            </Form>

                            <div class="item-body-remove">
                                <Icon type="ios-trash" class="remove-icon" @click="removeList(form.ngcAllowDenies, index)" size="20"/>
                            </div>
                        </div>

                    </div>
                </transition-group>
            </draggable>
            <div class="add-listen" @click="addRule">

                <Icon class="icon" size="22" type="ios-add-circle-outline" />
                <span class="tip">Add rule</span>
            </div>



        </div>

        <div slot="show">
            <draggable v-model="form.ngcAllowDenies" handle=".drag-handle"
                       @update="dragEnd"
                       @start="drag = true"
                       ghost-class="drag-item-ghost"
                       @end="drag = false">
                <transition-group >
                    <div v-for="(item, key) in form.ngcAllowDenies" :key="key">
                        <div class="ctrl-edit-item drag-edit-item">
                            <span class="drag-handle" v-if="form.ngcAllowDenies.length>1"></span>
                            <span class="allow_deny">{{item.allow_deny_value}}</span>
                            <span class="allow_deny_value">{{item.allow_deny_ip}}</span>
                        </div>

                    </div>
                </transition-group>
            </draggable>

        </div>
    </my-form-item>
</template>

<script>
    import mixin from '../mixins'
    import draggable from 'vuedraggable'
    import emptyConfig from '../emptyConfig'
    export default {
        mixins: [mixin],

        components: {
            draggable,
        },
        data () {
            const ipAddressRules = (rule, value, callback) => {
                let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                if (!reg.test(value)) {
                    callback(new Error('请检查IP地址格式！'))
                }
                callback()
            }
            return {
                title: 'ALLOW / DENY',
                drag: false,
                formRules: {
                    allow_deny_ip: [
                        { required: true, message: '不能为空'},
                        { validator: ipAddressRules, trigger: 'blur' }
                    ]
                },
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            /* 开关变化时 */
            closeConfig(data){
                if (!data){
                    this.resetConfig(emptyConfig.ngcVirtualServers[0].ngcLocations[0])
                } else{
                    this.form.allow_deny_state = data
                }

            },
            /* 拖拽结束后更改sort */
            dragEnd(evt) {

                this.form.ngcAllowDenies[evt.newIndex].allow_deny_sort = evt.newIndex
                this.form.ngcAllowDenies[evt.oldIndex].allow_deny_sort = evt.oldIndex
            },
            addRule() {

                let json = this.copyJson(emptyConfig.ngcVirtualServers[0].ngcAllowDenies[0])
                json.allow_deny_sort = this.form.ngcAllowDenies.length

                this.form.ngcAllowDenies.push(json)
            },
            removeList(arr, index) {
                arr.splice(index, 1)
            },

            /* 保存配置项 */
            saveConfig() {
                let flag = true
                for(let item of this.$refs['form']){
                    item.validate(valid => {
                        if (!valid) {
                            flag = false
                        }
                    })
                }
                this.valid = flag
                console.log(this.form)
                if (flag){
                    this.$emit('readyOk', this.form)
                } else {
                    this.$Message.error('验证失败')
                }


            },

        },
        mounted() {
           // console.log(this.form)
           if (this.form.ngcAllowDenies[0].allow_deny_sort==null) {
                this.form.ngcAllowDenies[0].allow_deny_sort = 0
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "../modal-form";
</style>
