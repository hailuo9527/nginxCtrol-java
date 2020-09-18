export default {
	title: 'NgController',
	homeName: 'home',
	baseUrl: {
		dev: `/api`,
		//pro: 'https://nc.naccenter.cn:8085'
		pro: `${window.location.protocol}//${window.location.hostname}:8085`
	},
	uploadUrl: 'http://192.168.1.49:8085',
	webSocketUrl: `ws://${
		process.env.NODE_ENV === 'development'
			? '192.168.1.48'
			: window.location.hostname
	}:8085/websocket/`
};
