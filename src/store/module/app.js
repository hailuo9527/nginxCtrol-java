import { selAppInfoList } from "../../api/app";

export default {
    state: {
        activeAside: {},
        asideList: [],
        listLoading: false,
    },
    mutations: {
        appSetActiveAside (state, item) {
            state.activeAside = item
        },
        appSetAsideList (state, list) {
            state.asideList = list
        },
        appChangeLoadingStatus(state, data) {
            state.listLoading = data
        },


    },
    actions: {
        getAppAsideList({ commit }) {
            return new Promise((resolve, reject) => {
                commit('appChangeLoadingStatus', true)
                selAppInfoList().then(res => {
                    if (res.data.code === 'success'){
                         console.log(res)
                        commit('appSetAsideList', res.data.result || [])
                        commit('appSetActiveAside', res.data.result[0])
                        commit('appChangeLoadingStatus', false)
                    }
                    resolve(res)
                })
            })
        }
    }
}
