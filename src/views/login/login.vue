<template>
    <div class="login">
        <!-- 标题 -->
        <div class="login_head"><span>ngController</span></div>
        <!-- 登录表单 -->
        <div class="login_panel">
            <div class="login_form_wrap">
                <div class="login_form_inner" v-if="!forgotPanel">
                    <div class="login_form_title">登录</div>
                    <Form ref="loginForm" :model="loginForm" :rules="loginFormRules">
                        <FormItem prop="usernumber">
                            <Input v-model="loginForm.usernumber" placeholder="请输入账号"></Input>
                        </FormItem>
                        <FormItem prop="password" class="password">
                            <Input v-model="loginForm.password" placeholder="请输入密码" type="password" @on-enter="toLogin"></Input>
                        </FormItem>
                    </Form>
                    <!-- <div class="forgot" @click="forgotPanel = true">忘记密码？</div> -->
                    <Button type="primary" class="submit" :loading="loading" long size="large" @click="toLogin('loginForm')">
                        <span v-if="!loading">登录</span>
                        <span v-else>登陆中...</span>
                    </Button>
                </div>
                <div v-else class="login_form_inner">
                    <div class="back" @click="forgotPanel = false">
                        <Icon type="ios-arrow-back" size="20" class="icon" />登录
                    </div>
                    <div class="login_form_title">忘记密码</div>
                    <div class="tip">
                        输入您的邮箱账号，我们将会发送重置密码的链接到您的邮箱！
                    </div>
                    <Form ref="forgotForm" :model="forgotForm" :rules="forgotFormRules">
                        <FormItem prop="usernumber">
                            <Input v-model="forgotForm.usernumber" placeholder="Enter your usernumber"></Input>
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
import { mapActions } from "vuex";
import { Util, getToken } from "@/libs/util";
export default {
    name: "login",
    data() {
        const validatePassCheck = (rule, value, callback) => {
            if (value === "") {
                return callback(new Error("密码不能为空"));
            } else if (value !== this.loginForm.password) {
                return callback(new Error("两次密码不一致"));
            } else {
                callback();
            }
        };
        return {
            forgotPanel: false, // 忘记密码
            loading: false,
            resetLoading: false,
            loginForm: {
                usernumber: "",
                password: "",
            },
            loginFormRules: {
                usernumber: [
                    {
                        required: true,
                        message: "账号不能为空",
                        trigger: "blur",
                    },
                    // { type: 'email', message: '邮箱账号不合法', trigger: 'blur' }
                ],
                password: [
                    {
                        required: true,
                        validator: validatePassCheck,
                        trigger: "blur",
                    },
                ],
            },
            forgotForm: {},
            forgotFormRules: {
                usernumber: [
                    {
                        required: true,
                        message: "账号不能为空",
                        trigger: "blur",
                    },
                    // { type: 'email', message: '邮箱账号不合法', trigger: 'blur' }
                ],
            },
        };
    },
    methods: {
        ...mapActions(["handleLogin"]),
        toLogin() {
            this.$refs["loginForm"].validate((valid) => {
                if (valid) {
                    this.login_to();
                } else {
                    this.$Message.error("登录失败!");
                }
            });
        },
        toReset() {
            this.$refs["forgotForm"].validate((valid) => {
                if (valid) {
                    this.$Message.success("Success!");
                    this.resetLoading = true;
                    setTimeout(() => {
                        this.resetLoading = false;
                        // this.$router.push('/home')
                    }, 1000);
                } else {
                    this.$Message.error("Fail!");
                }
            });
        },
        login_to() {
            this.loading = true;
            this.handleLogin({
                user_no: this.loginForm.usernumber,
                password: this.loginForm.password,
            }).then((res) => {
                if (res.data.code === "success") {
                    this.loading = false;
                    this.$router.replace("/home");
                } else {
                    this.loading = false;
                    this.$Message.error(`${res.data.result}`);
                }
            });
        },
    },
};
</script>
<style lang="less" scoped>
// @import "login";
.login {
    width: 100%;
    height: 100vh;
    // margin-top: -70px;
    // padding-top: 70px;
    box-sizing: content-box !important;
    background-color: #161616;
    background: radial-gradient(
        circle at center 25%,
        #383838 0%,
        #161616 80%,
        #161616 100%
    );
    color: #fff;
    .login_panel {
        z-index: 1;
        margin: auto;
        width: 450px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .login_form_wrap {
            height: 100%;
            overflow-y: auto;
            .login_form_inner {
                background: rgba(56, 56, 56, 0.8);
                padding: 38px;
                .login_form_title {
                    margin-bottom: 20px;
                    font-size: 24px;
                }
                .password {
                    margin-bottom: 30px;
                }
                .forgot {
                    color: #999;
                    transition: color 0.1s linear;
                    cursor: pointer;
                    &:hover {
                        color: #fff;
                    }
                }
                // .submit{
                //   margin-top: 30px;
                // }
                .back {
                    margin-bottom: 20px;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #999;
                    &:hover {
                        color: #fff;
                    }
                    .icon {
                        margin-right: 6px;
                    }
                }
                .tip {
                    margin: 10px 0px 20px;
                    color: #999;
                }
            }
        }
    }

    .login_head {
        position: absolute;
        top: 0;
        left: 0;
        padding-left: 2rem;
        width: 100%;
        height: 70px;
        line-height: 70px;
        font-size: 2rem;
        font-weight: bold;
        // background-color: rgba(0, 0, 0, 0.8);
    }
}
/deep/.ivu-input {
    font-size: 18px;
    line-height: 44px;
    height: 45px;
    border: 0px;
    border-radius: 0;
    padding: 0px;
    border-bottom: 1px solid #666;
    box-sizing: border-box;
    outline: none;
    color: #fff;
    width: 100%;
    transition: color 0.1s linear, border-color 0.1s linear;
    background: transparent;
    &:hover {
        color: #fff;
        border-bottom: 1px solid #fff;
        &::placeholder {
            color: #888;
        }
    }
    &:focus {
        box-shadow: none;
        border-bottom: 2px solid #fff;
    }
    &::placeholder {
        color: #666;
    }
}
</style>
