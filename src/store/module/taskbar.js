export default {
	state: {
		isTaskbarShow: false,
		taskbarList: []
	},
	mutations: {
		//  是否弹出状态
		updateIsTaskbarShow(state, flag) {
			state.isTaskbarShow = flag;
		},
		//  更新数据
		updateTaskbarList(state, data) {
			//  转成json对象
			data = JSON.parse(data);
			//  如果没有值
			if (state.taskbarList.length === 0) {
				state.taskbarList.push(data);
				return;
            }

			//  有值进行id判断，id一样就进行覆盖
			let flag = false;
			state.taskbarList = state.taskbarList.map((item) => {
				if (item.id === data.id) {
					item = data;
					flag = true;
				}
				return item;
			});

			if (!flag) {
				state.taskbarList.push(data);
            }

            setTimeout(() => {
				state.taskbarList = state.taskbarList.filter(item=>item.status === 'execution')
			}, 3 * 1000);
            
		},
		//  删除数据
		// removeTaskbarList(state) {
		// 	setTimeout(() => {
		// 		state.taskbarList = [];
		// 	}, 3 * 1000);
		// }
	},
	actions: {}
};
