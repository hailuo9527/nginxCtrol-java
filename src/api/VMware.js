/**  VMware模块接口 */

import axios from '@/libs/api.request';

/**  刷新所有虚拟机信息 */
export const refurbishVCenterVoInfo = () => {
	return axios.request({
		url: '/refurbishVCenterVoInfo',
		method: 'post'
	});
};

/**  克隆虚拟机 */
export const cloneVMwareInfo = (json) => {
	return axios.request({
		url: '/cloneVMwareInfo',
		method: 'post',
		data: json
	});
};

/**  删除服务器连接信息  */
export const delVMConnection = ({ id }) => {
	return axios.request({
		url: '/delVMConnection',
		method: 'post',
		params: { id }
	});
};

/**  APP克隆虚拟机  */
export const appCloneVMware = (data) => {
	return axios.request({
		url: '/appCloneVMware',
		method: 'post',
		data: data
	});
};

/**  添加虚拟主机 */
export const insVMware = ({ url, userName, password }) => {
	return axios.request({
		url: '/insVMware',
		method: 'post',
		params: {
			url,
			userName,
			password
		}
	});
};

/**  查询虚拟机信息 */
export const selVMwareInfo = () => {
	return axios.request({
		url: '/selVMwareInfo',
		method: 'post'
	});
};

/**  修改虚拟机信息  */
export const updateVMwareInfo = (json) => {
	return axios.request({
		url: '/updateVMwareInfo',
		method: 'post',
		params: json
	});
};

/**  修改模板登录信息 */
export const uptVMwareTemplateLoginInfo = (json) => {
	return axios.request({
		url: '/uptVMwareTemplateLoginInfo',
		method: 'post',
		params: json
	});
};

/**  添加模板登录信息 */
export const insVMwareTemplateLoginInfo = (json) => {
	return axios.request({
		url: '/insVMwareTemplateLoginInfo',
		method: 'post',
		params: json
	});
};

/**  获取模板登录信息 */
export const selVMwareTemplateLoginInfo = ({ templateName }) => {
	return axios.request({
		url: '/selVMwareTemplateLoginInfo',
		method: 'post',
		params: { templateName }
	});
};
