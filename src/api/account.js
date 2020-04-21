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

export const selSysUersInfoAll = (tag=1) => {
    return axios.request({
        url: '/selSysUersInfoAll',
        method: 'post',
        params: { tag }
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