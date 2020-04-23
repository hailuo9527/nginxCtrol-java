import axios from '@/libs/api.request'
/*
*  示例
* */
export const loginInfo = ({ user_no, password }) => {
    return axios.request({
        url: '/loginInfo',
        method: 'post',
        params: { // query
            user_no, password
        }
    })
}
