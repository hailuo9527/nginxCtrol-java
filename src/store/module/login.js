
import { setToken } from '@/libs/util'
import { loginInfo } from '@/api/login'
export default {
    state: {
        userInfo: '',
        token: ''
    },
    mutations: {
        setToken(state, token) {
            state.token = token
            setToken(token)
        },
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo
        }
    },
    actions: {
        // 登录
        handleLogin ({ commit }, { user_no, password }) {
            return new Promise((resolve, reject) => {
                loginInfo({ user_no, password }).then(res => {
                    if (res.data.code === 'success') {
                        commit('setUserInfo', res.data.result)
                        commit('setToken', res.data.result.token)
                    }
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 退出登录
        handleLoginOut ({ commit }) {
            return new Promise((resolve, reject) => {

            })
        }
    }
}
