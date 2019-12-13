import { getDeviceManage } from "../../api/L4";

export default {
    state: {
        activeAside: {},
        asideList: [],
        listLoading: false,
        chartFilter: {
            key: 1,
            value: 4
        }
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
        },
        changeChartFilter(state, data) {
            state.chartFilter = data
        }
    },
    actions: {
        getAsideList({ commit }) {
            return new Promise((resolve, reject) => {
                commit('changeLoadingStatus', true)
                getDeviceManage().then(res => {
                    //console.log(res)
                    if (res.data.code === 'success'){
                        commit('setAsideList',res.data.result || [])
                        commit('setActiveAside',res.data.result[0])
                        commit('changeLoadingStatus', false)
                    }
                    resolve(res)
                })
            })
        }
    }
}
