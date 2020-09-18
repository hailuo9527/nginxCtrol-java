import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import login from './module/login';
import app from './module/app';
import L4 from './module/L4';
import L7 from './module/L7';
import VMware from './module/VMware';
import common from './module/common';
import taskbar from './module/taskbar';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {},
	mutations: {},
	actions: {},
	modules: {
		login,
		L4,
		L7,
		common,
		app,
		VMware,
		taskbar
	},
	plugins: [
		createPersistedState({
			reducer(val) {
				return {
					login: val.login
				};
			}
		})
	]
});
