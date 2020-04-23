
import { setToken } from '@/libs/util'
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
        handleLogin ({ commit }, { userNo, password }) {
            return new Promise((resolve, reject) => {

            })
        },
        // 退出登录
        handleLoginOut ({ commit }) {
            return new Promise((resolve, reject) => {

            })
        }
    }
}
