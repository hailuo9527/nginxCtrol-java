<template>
    <my-form-item  title="ALLOW / DENY"
                   @closeConfig = "cancel"
                   @saveConfig = "saveConfig"
                   @cancel = "cancel"
                   @edit="edit"
                   :modify="modify"
                   :open = "form.allow_deny_state"
                   :valid="valid"
                   info="Allow or deny access for specific IP or network.">
        <div slot="edit">
            <draggable v-model="dragList" handle=".drag-handle" @start="drag = true"
                       ghost-class="drag-item-ghost"
                       @end="drag = false">
                <transition-group >
                    <div v-for="element in dragList" :key="element.id">
                        <div  class="ctrl-edit-item ctrl-edit-item_edit drag-edit-item mulity">
                            <span class="drag-handle" v-if="dragList.length>1"></span>
                            <Form ref="form" :model="form" :rules="formRules"    @submit.native.prevent>
                                <FormItem label="" class="inline-form-item options">
                                    <Select >
                                        <Option value="dataready">ALLOW</Option>
                                        <Option value="httpready">DENY</Option>
                                    </Select>
                                    <Input placeholder="certs/myserver.crt"></Input>
                                </FormItem>
                            </Form>

                            <div class="item-body-remove">
                                <Icon type="ios-trash" class="remove-icon" @click="" size="20"/>
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
            <draggable v-model="dragList" handle=".drag-handle" @start="drag = true"
                       ghost-class="drag-item-ghost"
                       @end="drag = false">
                <transition-group >
                    <div v-for="element in dragList" :key="element.id">
                        <div class="ctrl-edit-item drag-edit-item">
                            <span class="drag-handle" v-if="dragList.length>1"></span>
                            <span class="allow_deny">allow</span>
                            <span class="allow_deny_value">192.168.0.1</span>
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
    export default {
        mixins: [mixin],
        name: 'allow/deny',
        components: {
            draggable,
        },
        data () {

            return {
                dragList: [
                    { name: "John", text: "", id: 0 },
                    { name: "Joao", text: "", id: 1 },
                    { name: "Jean", text: "", id: 2 }
                ],
                drag: false,
                formRules: {

                },
            }
        },
        computed: {

        },
        methods: {

        },

        mounted() {

        }
    }
</script>
<style lang="less" scoped>
    @import "../modal-form";
</style>
