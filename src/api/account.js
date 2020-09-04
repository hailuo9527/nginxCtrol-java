/** account板块接口 */

import axios from '@/libs/api.request'


/** 添加用户信息 */

export const insSysUersInso = ({user_name, user_no, password, tag, role_id}) => {
    return axios.request({
        url: '/insSysUersInso',
        method: 'post',
        data: {user_name, user_no, password, tag, role_id}
    })
}


/** 查询所有用户信息 */

export const selSysUersInfoAll = () => {
    return axios.request({
        url: '/selSysUersInfoAll',
        method: 'post',
    })
}


/** 删除用户信息 */

export const delSysUersInso = id => {
    return axios.request({
        url: '/delSysUersInso',
        method: 'post',
        params: { id }
    })
}


/** 修改用户信息 */

export const uptSysUersInso = ({user_name, user_no, password, tag, role_id, id}) => {
    return axios.request({
        url: '/uptSysUersInso',
        method: 'post',
        data: {user_name, user_no, password, tag, role_id, id}
    })
}


/** 获取角色信息 */

export const selRoleInfo = () => {
    return axios.request({
        url: '/selRoleInfo',
        method: 'post'
    })
}


/**  查询用户操作权限 */
export const selUserPermission = ({user_id}) => {
    return axios.request({
        url: '/selUserPermission',
        method: 'post',
        params: { user_id }
    })
}


/**  新增用户操作权限 */
export const insUserPermission = (data) => {
    return axios.request({
        url: '/insUserPermission',
        method: 'post',
        data: data
    })
}


/** 删除用户操作权限  */
export const delUserPermission = ({user_id}) => {
    return axios.request({
        url: '/delUserPermission',
        method: 'post',
        params: { user_id }
    })
}


/**  修改用户操作权限 */
export const uptUserPermission = (data) => {
    return axios.request({
        url: '/uptUserPermission',
        method: 'post',
        data: data
    })
}


/**  查询所有APP绑定权限信息 */
export const selPermissionByApp = () => {
    return axios.request({
        url: '/selPermissionByApp',
        method: 'post'
    })
}