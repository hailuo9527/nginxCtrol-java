export default {
    state: {
        activeAside: {},
        asideList: [],
        shareLoading: false,
        AllValue: {}
    },
    mutations: {
        VMwareSetActiveAside (state, item) {
            state.activeAside = item
        },
        VMwareSetAsideList (state, list) {
            state.asideList = list
        },
        VMwareSetshareLoading (state, loading) {
            state.shareLoading = loading
        },
        VMwareSetAllValue (state, item) {
            state.AllValue = item
        }
    },
}