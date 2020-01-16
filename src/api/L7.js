import axios from '@/libs/api.request'


/* 获取默认配置 */
export const selL7ServerInfoAll = (  ) => {
    return axios.request({
        url: '/L7/selL7ServerInfoAll',
        method: 'post',
    })
}

/* 获取默认配置 */
export const addL7ServerInfo = ({l7ServerName, l7ServerSSHIp, l7ServerSSHName, l7ServerSSHPwd, l7ServerSSHPort}) => {
    return axios.request({
        url: '/L7/addL7ServerInfo',
        method: 'post',
        params: {
            l7ServerName, l7ServerSSHIp, l7ServerSSHName, l7ServerSSHPwd, l7ServerSSHPort
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
export const updL7ServerInfo = ({ l7ServerName, l7ServerSSHIp, l7ServerSSHName, l7ServerSSHPwd, l7ServerSSHPort }) => {
    return axios.request({
        url: '/L7/updL7ServerInfo',
        method: 'post',
        params: {
            l7ServerName, l7ServerSSHIp, l7ServerSSHName, l7ServerSSHPwd, l7ServerSSHPort
        }
    })
}
