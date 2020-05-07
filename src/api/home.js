/**  home板块接口 */

import axios from '@/libs/api.request'


/**  查询首页信息 */

export const selOverViewInfo = () => {
    return axios.request({
        url: '/selOverViewInfo',
        method: 'post'
    })
}


/**  添加首页APP信息 */

export const addOverViewInfo = ({app_name, app_id}) => {
    return axios.request({
        url: 'addOverViewInfo',
        method: 'post',
        params: {app_name, app_id}
    })
}

/**  删除首页APP信息 */

export const delOverViewInfo = ({ app_id}) => {
    return axios.request({
        url: '/delOverViewInfo',
        method: 'post',
        params: { app_id}
    })
}
