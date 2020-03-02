


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
            /* 取消配置修改 */
            cancel(configName,target) {
                target = target || this.data
                this.backConfig(this.data,target)
            },
            /* 检查是否有未保存选项 */
            edit(data){
                let json = {
                    name: this.$options.name,
                    value: data
                }
                this.$emit('edit', json) // 通知父组件未保存当前配置
            }
        }
    }
