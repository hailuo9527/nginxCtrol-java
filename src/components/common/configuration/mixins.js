


    import myFormItem from './form-item'
    export default {
        props: {
            data: {
                type: Object,
                default: () => {}
            },
            modify: false,
        },
        components: {
            myFormItem
        },
        data () {

            return {
                form: {},
                valid: false,
                switchStatus: false,
            }
        },
        watch: {
            data : {
                handler(nv, ov){
                    /* 拷贝对象 */
                    this.form = this.copyJson(nv)
                },
                immediate: true
            },
            form: {
                handler() {
                    this.valid = false  //  表单变化时重新验证
                },
                deep: true
            }
        },

        methods: {

            /* 保存配置项 */
            saveConfig() {
                this.$refs['form'].validate((valid) => {

                    if (valid) {
                        this.valid = true
                        console.log(this.form)
                        this.$emit('readyOk', this.form)
                    } else {
                        this.valid = false
                        this.$Message.error('Fail!');
                    }
                })
            },
            /* 还原配置 */
            backConfig(obj,target){
                Object.keys(obj).map(item => {
                    this.form[item] = target[item]
                })
            },
            /* 重置配置项 */
            resetConfig(target){
                let json = {}
                Object.keys(this.form).map(item => {
                    json[item] = target[item]
                })
                console.log(json)
                this.$emit('readyOk', json)
            },
            /* 取消配置修改 */
            cancel(target) {
                target = target || this.data
                this.backConfig(this.data,target)
            },
            /* 开关变化时 */
            closeConfig(data){
              //console.log(data)
              this.switchStatus = data
            },
            /* 检查是否有未保存选项 */
            edit(data){
                console.log(data)
                let json = {
                    name: this.title,
                    value: data
                }
                this.$emit('edit', json) // 通知父组件未保存当前配置
            }
        }
    }
