import { getDeviceManage } from "../../api/L4";

export default {
    state: {
        activeAside: {},
        asideList: [],
        listLoading: false,
    },
    mutations: {
        setActiveAside (state, item) {
            state.activeAside = item
        },
        setAsideList (state, list) {
            state.asideList = list
        },
        changeLoadingStatus(state, data) {
            state.listLoading = data
        }
    },
    actions: {
        getAsideList({ commit }) {
            return new Promise((resolve, reject) => {
                commit('changeLoadingStatus', true)
                getDeviceManage().then(res => {
                    if (res.data.message === 'ok'){
                        commit('setAsideList',res.data.data.L4_equip_list || [])
                        commit('setActiveAside',res.data.data.L4_equip_list[0])
                        commit('changeLoadingStatus', false)
                    }
                    resolve(res)
                })
            })
        }
    }
}
