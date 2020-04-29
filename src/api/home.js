/**  home板块接口 */

import axios from '@/libs/api.request'


/**  查询首页信息 */

export const selOverViewInfo = () => {
    return axios.request({
        url: '/selOverViewInfo',
        method: 'post'
    })
}