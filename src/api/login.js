import axios from '@/libs/api.request'
/*
*  示例
* */
export const demo = ({ data }) => {
    return axios.request({
        url: '/url',
        method: 'post',
        data: { // body
            data
        },
        params: { // query
            data
        }
    })
}
