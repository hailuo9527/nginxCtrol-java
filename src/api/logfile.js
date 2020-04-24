/**  logfile板块接口 */


import axios from '@/libs/api.request'


/** 查询操作记录 */

export const selSystemLogInfo = () => {
    return axios.request({
        url: '/selSystemLogInfo',
        method: 'post'
    })
}