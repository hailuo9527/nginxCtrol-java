import { selL7ServerInfoAll } from "../../api/L7";

export default {
    state: {
        activeAside: {},
        asideList: [],
        listLoading: false,
        canSaveConfig: false,
        canSaveAndCopyConfig: false,
        configName: ''
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
        canSaveConfigStatus(state, data){
            state.canSaveConfig = data
        },
        canSaveAndCopyConfigStatus(state, data){
            state.canSaveConfig = data
        },
        changeConfigName (state, data)  {
            state.configName = data
        }


    },
    actions: {
        getL7AsideList({ commit }, shouldUpdateActiveAside) {
            return new Promise((resolve, reject) => {
                commit('L7changeLoadingStatus', true)
                selL7ServerInfoAll().then(res => {
                    if (res.data.code === 'success'){
                        let keys = Object.keys(res.data.result)
                        // console.log(keys)
                        commit('L7setAsideList', res.data.result || [])

                        //commit('L7setActiveAside', res.data.result[0])
                        if (shouldUpdateActiveAside) {
                            commit('L7setActiveAside', keys[0]? res.data.result[keys[0]][0]: {})
                        }
                        commit('L7changeLoadingStatus', false)
                    }
                    resolve(res)
                })
            })
        }
    }
}
