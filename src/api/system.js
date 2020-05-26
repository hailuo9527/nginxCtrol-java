/**   system板块接口 */

import axios from '@/libs/api.request'
import { getToken } from '../libs/util'


/**  License查询  */

export const selLicense = () => {
    return axios.request({
        url: '/selLicense',
        method: 'post'
    })
}


/**  License文件上传  */

export const uploadLicense = (file) => {
    return axios.request({
        url: '/uploadLicense',
        headers: {
            //'Content-Type': 'multipart/form-data;chartset=UTF-8'
            'Content-Type': 'application/x-www-form-urlencoded',
            AUTHORIZATION: getToken()
          },
        method: 'post',
        processData: false, // 告诉axios不要去处理发送的数据(重要参数)
        data: file
    })
}