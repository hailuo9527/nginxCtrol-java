<template>
    <div class="login">
        <div class="login_panel">
            <div class="login_form_wrap">
                <div class="login_form_inner" v-if="!forgotPanel">
                    <div class="login_form_title">登录</div>
                    <Form ref="loginForm" :model="loginForm" :rules="loginFormRules" >
                        <FormItem  prop="mail">
                            <Input v-model="loginForm.mail" placeholder="Enter your name"></Input>
                        </FormItem>
                        <FormItem  prop="password" class="password">
                            <Input v-model="loginForm.password" placeholder="Enter your e-mail"></Input>
                        </FormItem>
                    </Form>
                    <div class="forgot" @click="forgotPanel = true">忘记密码？</div>
                    <Button type="primary" class="submit" :loading="loading" long size="large" @click="toLogin">
                        <span v-if="!loading">登录</span>
                        <span v-else>登陆中...</span>
                    </Button>
                </div>
                <div v-else class="login_form_inner">
                    <div class="back" @click="forgotPanel = false">
                        <Icon type="ios-arrow-back" size="20" class="icon"/>登录
                    </div>
                    <div class="login_form_title">忘记密码</div>
                    <div class="tip">
                        输入您的邮箱账号，我们将会发送重置密码的链接到您的邮箱！
                    </div>
                    <Form ref="forgotForm" :model="forgotForm" :rules="forgotFormRules" >
                        <FormItem  prop="mail">
                            <Input v-model="forgotForm.mail" placeholder="Enter your e-mail"></Input>
                        </FormItem>
                    </Form>
                    <Button type="primary" class="submit" :loading="resetLoading" long size="large" @click="toReset">
                       <!-- <span v-if="!resetLoading">重置密码</span>-->
                        重置密码
                    </Button>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
    export default {
        name: 'login',
        data () {
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error('请再次输入密码'))
                } else if (value !== this.loginForm.password) {
                    return callback(new Error('两次密码不一致'))
                } else {
                    callback()
                }
            }
            return {
                forgotPanel: false, // 忘记密码
                loading: false,
                resetLoading: false,
                loginForm: {},
                loginFormRules: {
                    mail: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur' },
                        { type: 'email', message: '邮箱账号不合法', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, validator: validatePassCheck, trigger: 'blur' },
                    ]
                },
                forgotForm: {},
                forgotFormRules: {
                    mail: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur' },
                        { type: 'email', message: '邮箱账号不合法', trigger: 'blur' }
                    ],
                }
            }
        },
        methods: {
            toLogin () {
                /*this.$refs['loginForm'].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                        this.loading = true
                        setTimeout(() => {
                            this.loading = false
                            this.$router.push('/home')
                        }, 1000)
                    } else {
                        this.$Message.error('Fail!');
                    }
                })*/
                this.loading = true
                setTimeout(() => {
                    this.loading = false
                    this.$router.push('/home')
                }, 1000)
            },
            toReset () {
                this.$refs['forgotForm'].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                        this.resetLoading = true
                        setTimeout(() => {
                            this.resetLoading = false
                            // this.$router.push('/home')
                        }, 1000)
                    } else {
                        this.$Message.error('Fail!');
                    }
                })

            }
        }
    }
</script>
<style lang="less" scoped>
    @import "login";
</style>
