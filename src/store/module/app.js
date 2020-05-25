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
        getAppAsideList({ commit },shouldUpdateActiveAside) { // shouldUpdateActiveAside为true时更新 appSetActiveAside
            shouldUpdateActiveAside = shouldUpdateActiveAside === true ? 'reset' : shouldUpdateActiveAside
            return new Promise((resolve, reject) => {
                commit('appChangeLoadingStatus', true)
                selAppInfoList().then(res => {
                    if (res.data.code === 'success'){
                        commit('appSetAsideList', res.data.result || [])
                        switch (shouldUpdateActiveAside) {
                            case 'reset':  // 重置侧栏
                                commit('appSetActiveAside', res.data.result[0])
                            break
                            case 'update':  // 更新当前侧栏选中项
                                let target = res.data.result.filter((item) => {
                                    return item.app_service_id === this.state.app.activeAside.app_service_id
                                })
                                commit('appSetActiveAside', target[0] || {})
                            break
                            default: break
                        }
                        commit('appChangeLoadingStatus', false)
                    }
                    resolve(res)
                })
            })
        }
    }
}
