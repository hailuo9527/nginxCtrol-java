import { selL7ServerInfoAll } from "../../api/L7";

export default {
    state: {
        activeAside: {},
        asideList: [],
        listLoading: false,
    },
    mutations: {
        L7setActiveAside (state, item) {
            state.activeAside = item
        },
        L7setAsideList (state, list) {
            state.asideList = list
        },
        L7changeLoadingStatus(state, data) {
            state.listLoading = data
        },

    },
    actions: {
        getL7AsideList({ commit }) {
            return new Promise((resolve, reject) => {
                commit('L7changeLoadingStatus', true)
                selL7ServerInfoAll().then(res => {
                    if (res.data.code === 'success'){
                       // console.log(res)
                        commit('L7setAsideList', res.data.result || [])
                        commit('L7setActiveAside', res.data.result[0])
                        commit('L7changeLoadingStatus', false)
                    }
                    resolve(res)
                })
            })
        }
    }
}
