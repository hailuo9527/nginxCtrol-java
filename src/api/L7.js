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


/* 获取单个配置信息 */
export const getConfigInfoByConfigName = () => {
    return axios.request({
        url: '/getConfigInfoByConfigName',
        method: 'post'
    })
}



/* 查询所有L7服务器配置信息 */
export const getNginxConfALL = (  ) => {
    return axios.request({
        url: '/getNginxConfALL',
        method: 'post',
    })
}

/* 查询指定Nginx的配置文件 */
export const getNginxConf = ({ nginx_conf_id, version_no }) => {
    return axios.request({
        url: '/getNginxConf',
        method: 'post',
        params: {
            nginx_conf_id, version_no
        }
    })
}

/* 查询nginx历史版本信息 */
export const selNgcVersionByConfId = ({ nginx_conf_id }) => {
    return axios.request({
        url: '/selNgcVersionByConfId',
        method: 'post',
        params: {
            nginx_conf_id
        }
    })
}

/* 编辑历史版本信息别名 */
export const updNgcVersionNameByConfId = ({ id, version_name }) => {
    return axios.request({
        url: '/updNgcVersionNameByConfId',
        method: 'post',
        params: {
            id, version_name
        }
    })
}

/* 编辑Nginx配置文件（添加/修改） */
export const editNginxConf = ( nginxConf ) => {
    return axios.request({
        url: '/editNginxConf',
        method: 'post',
        data: nginxConf
    })
}

/* 删除Nginx的配置 */
export const delNginxConf = ({ nginx_conf_id }) => {
    return axios.request({
        url: '/delNginxConf',
        method: 'post',
        params: {
            nginx_conf_id
        }
    })
}

/** 查询实例列表 */
export const selNgcInstanceList = ( nginx_conf_id ) => {
    return axios.request({
        url: '/selNgcInstanceList',
        method: 'post',
        params: {
            nginx_conf_id
        }
    })
}

/**添加实例 */
export const addInstance = ( nginx_conf_id, l7ServerIds ) => {
    return axios.request({
        url: '/addInstance',
        method: 'post',
        params: {nginx_conf_id},
        data: l7ServerIds
    })
}
/**删除实例 */
export const delInstance = ({nginx_conf_id}, ids) => {
    return axios.request({
        url: '/delInstance',
        method: 'post',
        params: {nginx_conf_id},
        data: ids,
    })
}