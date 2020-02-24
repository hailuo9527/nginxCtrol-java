import axios from '@/libs/api.request'


/* 查询所有L7服务器配置信息 */
export const selL7ServerInfoAll = (  ) => {
    return axios.request({
        url: '/L7/selL7ServerInfoAll',
        method: 'post',
    })
}

/* 添加L7服务器配置信息 */
export const addL7ServerInfo = ({l7ServerName, l7ServerSSHIp, l7ServerSSHName, l7ServerSSHPwd, l7ServerSSHPort, remark}) => {
    return axios.request({
        url: '/L7/addL7ServerInfo',
        method: 'post',
        params: {
            l7ServerName, l7ServerSSHIp, l7ServerSSHName, l7ServerSSHPwd, l7ServerSSHPort, remark
        }
    })
}

/* 删除L7服务器信息接口 */
export const delL7ServerInfo = ({l7ServerId}) => {
    return axios.request({
        url: '/L7/delL7ServerInfo',
        method: 'post',
        params: {
            l7ServerId
        }
    })
}

/* 修改L7服务器信息接口 */
export const updL7ServerInfo = ({l7ServerId, l7ServerName, l7ServerSSHIp, l7ServerSSHName, l7ServerSSHPwd, l7ServerSSHPort }) => {
    return axios.request({
        url: '/L7/updL7ServerInfo',
        method: 'post',
        params: {
            l7ServerId, l7ServerName, l7ServerSSHIp, l7ServerSSHName, l7ServerSSHPwd, l7ServerSSHPort
        }
    })
}

/* 配置列表 */
export const getAllConfigInfo = () => {
    return axios.request({
        url: '/getAllConfigInfo',
        method: 'post'
    })
}

/* 获取单个配置信息 */
export const getConfigInfoByConfigName = () => {
    return axios.request({
        url: '/getConfigInfoByConfigName',
        method: 'post'
    })
}


/* 插入server配置 */
export const insConfigVirtualServer = (data) => {
    return axios.request({
        url: '/insConfigVirtualServer',
        method: 'post',
        data: data
    })
}

/* 修改server配置 */
export const uptConfigVirtualServer = (data) => {
    return axios.request({
        url: '/uptConfigVirtualServer',
        method: 'post',
        data: data
    })
}
