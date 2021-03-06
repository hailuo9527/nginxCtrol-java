import axios from '@/libs/api.request'
import { getToken } from '../libs/util'


/* 查询所有实例配置信息 */
export const selL7ServerInfoAll = (  ) => {
    return axios.request({
        url: '/L7/selL7ServerInfoAll',
        method: 'post',
    })
}

/* 添加实例配置信息 */
export const addL7ServerInfo = ({l7ServerName, l7ServerSSHIp, l7ServerSSHName, l7ServerSSHPwd, l7ServerSSHPort, impConfFlag, remark}) => {
    return axios.request({
        url: '/L7/addL7ServerInfo',
        method: 'post',
        params: {
            l7ServerName, l7ServerSSHIp, l7ServerSSHName, l7ServerSSHPwd, l7ServerSSHPort, impConfFlag, remark
        }
    })
}

/* 删除实例信息接口 */
export const delL7ServerInfo = ({l7ServerId, is_init_conf}) => {
    return axios.request({
        url: '/L7/delL7ServerInfo',
        method: 'post',
        params: {
            l7ServerId, is_init_conf
        }
    })
}

/* 修改实例信息接口 */
export const updL7ServerInfo = ({l7ServerId, l7ServerName, l7ServerSSHIp, l7ServerSSHName, l7ServerSSHPwd, l7ServerSSHPort, remark }) => {
    return axios.request({
        url: '/L7/updL7ServerInfo',
        method: 'post',
        params: {
            l7ServerId, l7ServerName, l7ServerSSHIp, l7ServerSSHName, l7ServerSSHPwd, l7ServerSSHPort, remark
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



/* 查询所有实例配置信息 */
export const getNginxConfALL = (  ) => {
    return axios.request({
        url: '/getNginxConfALL',
        method: 'post',
    })
}


/**  查询所有有权限的Nginx配置方案 */
export const getNginxConfALLForPremission = () => {
    return axios.request({
        url: '/getNginxConfALLForPremission',
        method: 'post'
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
export const delInstance = ({nginx_conf_id, is_init_conf}, ids) => {
    return axios.request({
        url: '/delInstance',
        method: 'post',
        params: {nginx_conf_id, is_init_conf},
        data: ids,
    })
}

/* 预览配置 */
export const previewNginxConf = (config) => {
    return axios.request({
        url: '/previewNginxConf',
        method: 'post',
        data: config,
    })
}


/* 通过L7 id 查询配置*/
export const selNginxConfByL7ID = ({l7ServerId}) => {
    return axios.request({
        url: '/selNginxConfByL7ID',
        method: 'post',
        params: {
            l7ServerId
        }
    })
}
/* 通过app id 查询配置*/
export const selNginxConfByAPPID = ({app_service_id}) => {
    return axios.request({
        url: '/selNginxConfByAPPID',
        method: 'post',
        params: {
            app_service_id
        }
    })
}
/** 推送实例 */
export const pushInstance = (ngcInstanceInfos) => {
    return axios.request({
        url: '/pushInstance',
        method: 'post',
        data: ngcInstanceInfos
    })
}

/* 通过实例主键ID查询该实例是否与配置文件或者APP关联*/
export const getL7RelevanceConfig = ({l7ServerId}) => {
    return axios.request({
        url: '/getL7RelevanceConfig',
        method: 'post',
        params: {
            l7ServerId
        }
    })
}


/* 根据主键询实例配置明细信息*/
export const selL7ServerInfo = ({l7ServerId}) => {
    return axios.request({
        url: '/L7/selL7ServerInfo',
        method: 'post',
        params: {
            l7ServerId
        }
    })
}

/* 查询可用（空闲）的nginx实例*/
export const selUsableL7Server = ({ app_service_id }) => {
    return axios.request({
        url: '/L7/selUsableL7Server',
        method: 'post',
        params: {
            app_service_id
        }
    })
}


/**  获取所有未绑定APP的实例（导入生产APP时调用）  */
export const ListL7ServerInfoByImpApp = () => {
    return axios.request({
        url: '/L7/ListL7ServerInfoByImpApp',
        method: 'post'
    })
}


/* 发布时检查配置文件是否适用所选实例 */
export const pushCheck = ({ nginx_conf_id }, l7ServerIds) => {
    return axios.request({
        url: '/pushCheck',
        method: 'post',
        params: {
            nginx_conf_id
        },
        data: l7ServerIds
    })
}


/**  导入nginx配置文件 */

export const uploadNgConf = (file, {config_name}) => {
    return axios.request({
        url: '/uploadNgConf',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            AUTHORIZATION: getToken()
        },
        method: 'post',
        processData: false, // 告诉axios不要去处理发送的数据(重要参数)
        data: file,
        params: { config_name }
    })
}

/* 手动编辑保存配置 */
export const ManEditNginxConf = ({config_name, nginx_conf_id }, data) => {
    return axios.request({
        url: '/ManEditNginxConf',
        method: 'post',
        params: {
            config_name,
            nginx_conf_id
        },
        data: data
    })
}


/**  通过配置文件主键查询相关APP列表 */
export const selRelevantAPPList = ({nginx_conf_id}) => {
    return axios.request({
        url: '/selRelevantAPPList',
        method: 'post',
        params: {nginx_conf_id}
    })
}


/**  配置文件不同版本比较 */
export const nginxConfCompare = ({nginx_conf_id, version}) => {
    return axios.request({
        url: '/nginxConfCompare',
        method: 'post',
        params: {
            nginx_conf_id, version
        }
    })
}


/**  还原历史版本配置 */
export const nginxConfRestore = ({nginx_conf_id, version}) => {
    return axios.request({
        url: '/nginxConfRestore',
        method: 'post',
        params: {
            nginx_conf_id, version
        }
    })
}


/**  加锁 */
export const locking = ({primaryKey, type}) => {
    return axios.request({
        url: '/locking',
        method: 'post',
        params: {
            primaryKey, type
        }
    })
}


/**  解锁 */
export const unLock = ({ lock_id }) => {
    return axios.request({
        url: '/unLock',
        method: 'post',
        params: { lock_id }
    })
}