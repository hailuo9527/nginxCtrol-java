<template>
    <my-form-item  :title="title"
                   @closeConfig = "closeConfig"
                   @saveConfig = "saveConfig"
                   @cancel = "cancel"
                   @edit="edit"
                   :modify="modify"
                   :disabled="disabled"
                   :open = "form.index_files_state"
                   :valid="valid"
                   :info="info">
        <div slot="edit">

            <Form ref="form" :model="form" :rules="formRules"    @submit.native.prevent>
                <div  class="ctrl-edit-item ctrl-edit-item_edit">
                    <FormItem class="input line-form-item with-button" prop="indexFile">
                        <Button  icon="md-close" class="tag"
                                 :key="index"
                                 v-if="item"
                                 @click="removeTag(item)"
                                 v-for="(item, index) in form.index_files.split(',')">{{item}}</Button>
                        <Input  v-model.trim="form.indexFiles" @on-blur="addIndexFiles" @on-enter="addIndexFiles" @on-keydown="keyDown" placeholder="files"></Input>
                    </FormItem>
                </div>

            </Form>

        </div>

        <div slot="show">
            <div  class="ctrl-edit-item" >
                <div class="name-list" v-for="(item, index) in form.index_files.split(',')">
                    <span  class="tag" >{{item}}</span>
                </div>
            </div>
        </div>
    </my-form-item>
</template>

<script>
    import mixin from '../mixins'
    import emptyConfig from "../emptyConfig";
    export default {
        mixins: [mixin],
        data () {
            const indexFile = (rule, value, callback) => {
                const reg = /^[^ ]+$/
                if (value === '') {
                    callback(new Error('至少需要一个文件'))
                }else if (!reg.test(value)){
                        callback(new Error('不能含有空格'))
                } else {
                    callback()
                }
            };
            return {
                title: 'INDEX FILES',
                info: '定义针对特定错误显示的响应。',
                formRules: {
                    indexFile: [
                        { validator: indexFile }
                    ]

                },
            }
        },
        computed: {

        },
        methods: {
            addIndexFiles () {
                if(this.form.indexFiles === "") return
                let arr = this.form.index_files.split(',')
                arr.push(this.form.indexFiles)
                arr.map((item, index)=> {
                    if (!item) arr.splice(index,1)
                })
                this.form.index_files = arr.join(',')
                this.form.indexFiles = ''
            },
            removeTag(str) {
                let arr = this.form.index_files.split(',')
                let index = arr.indexOf(str)
                arr.splice(index, 1)
                this.form.index_files = arr.join(',')
            },
            /* 开关变化时 */
            closeConfig(data){

                if (!data){
                    this.resetConfig(emptyConfig.ngcVirtualServers[0].ngcLocations[0])
                } else{
                    this.form.index_files_state = data
                }


            },
            keyDown(e) {
                if (e.code === 'Space') {
                    this.addIndexFiles()
                }
            }
        },

        mounted() {

        }
    }
</script>
<style lang="less" scoped>
    @import "../modal-form";
</style>
