/**  logfile板块接口 */


import axios from '@/libs/api.request'


/** 查询操作记录 */

export const selSystemLogInfo = ({page, size, moudle}) => {
    return axios.request({
        url: '/selSystemLogInfo',
        method: 'post',
        params: {page, size, moudle}
    })
}

/** 查询操作类型 */

export const selLogMoudel = () => {
    return axios.request({
        url: '/selLogMoudel',
        method: 'post',
    })
}