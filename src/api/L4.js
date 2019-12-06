import axios from '@/libs/api.request'


/*
*   添加L4设备
*
* */
export const addDevice = ({ l4_code, l4_name, l4_remarks }) => {
    return axios.request({
        url: '/insConfiguration',
        method: 'post',
        data: {
            l4_code, l4_name, l4_remarks
        }
    })
}
/*
*   删除L4设备
*
* */
export const removeDevice = ({ l4_code }) => {
    return axios.request({
        url: '/delConfiguration',
        method: 'post',
        params: {
            l4_code
        }
    })
}
/* 查询设备 */
export const getDeviceManage = () => {
    return axios.request({
        url: '/selL4Info',
        method: 'post',
    })
}
/* 设备基础配置查询 */
export const getDeviceConfig = ({ l4_code }) => {
    return axios.request({
        url: '/selConfiguration',
        method: 'post',
        params: {
            l4_code
        }
    })
}
/* 设备基础配置修改 */
export const modifyDeviceConfig = (data) => {
    return axios.request({
        url: '/uptConfiguration',
        method: 'post',
        data: data
    })
}
/* 设备基础配置删除 */
export const delServerConfig = ({ l4_service_id }) => {
    return axios.request({
        url: '/delServerConfig',
        method: 'post',
        params: {
            l4_service_id
        }
    })
}
/* 查询业务配置 */
export const selServerConfig = ({ l4_code }) => {
    return axios.request({
        url: '/selServerConfig',
        method: 'post',
        params: {
           l4_code
        }
    })
}

/* 添加/修改 业务配置 */

export const serviceConfig = ( url, data ) => {
    return axios.request({
        url: url,
        method: 'post',
        data: data
    })
}
/* 修改 业务配置状态 */

export const uptServerConfigStatus = ( data, { l4_code } ) => {
    return axios.request({
        url: '/uptServerConfigStatus',
        method: 'post',
        data: data,
        params: { l4_code }
    })
}
