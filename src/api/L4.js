import axios from '@/libs/api.request'
/*
*  L4设备 查询 管理
* */
export const getDeviceManage = () => {
    return axios.request({
        url: `/equip_manage/v1_0/equip_manage/l4_equip_manage_view/`,
        method: 'get'
    })
}
/*
*  L4设备  管理  设备
* */
export const deviceManage = (method, data) => {
    return axios.request({
        url: `/equip_manage/v1_0/equip_manage/l4_equip_manage_view/`,
        method: method,
        data: data
    })
}
/*
*  L4设备 基本配置查询
* */
export const getDeviceConfig = ({ L4_code }) => {
    return axios.request({
        url: `/equip_config/v1_0/equip_config/l4_equip_config_view/`,
        method: 'get',
        params: {
            L4_code
        }
    })
}
/*
*  L4设备 配置 修改
* */
export const modifyDeviceConfig = ({ L4_code }) => {
    return axios.request({
        url: `/equip_config/v1_0/equip_config/l4_equip_config_view/`,
        method: 'put',
        data: {
            L4_code
        }
    })
}

/*
*  业务配置 查询
*
* */
export const getServiceConfig = ({ L4_code }) => {
    return axios.request({
        url: `/service_conf/v1_0/service_conf/l4_service_conf_view/`,
        method: 'get',
        params: {
            L4_code
        }
    })
}

/*
*  业务配置
*
* */
export const serviceConfig = (method, data) => {
    return axios.request({
        url: `/service_conf/v1_0/service_conf/l4_service_conf_view/`,
        method: method,
        data: data
    })
}

/*
*  业务配置 删除
*
* */
export const removeServiceConfig = ({ L4_service_id }) => {
    return axios.request({
        url: `/service_conf/v1_0/service_conf/l4_service_conf_view/`,
        method: 'delete',
        params: {
            L4_service_id
        }
    })
}
