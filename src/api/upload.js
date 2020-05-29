import axios from '@/libs/api.request'
import { getToken } from '../libs/util'
/* 文件列表查询 */
/*
*
* */
export const selUploadFile = () => {
  return axios.request({
    url: '/selUploadFile',
    method: 'post',
  })
}
/*
* 删除文件
*
* */
export const delFile = ({ path, version }) => {
  return axios.request({
    url: '/delFile',
    method: 'post',
    params: {
      path, version
    }
  })
}

/* 文件上传 */
/*
*
* */
export const uploadFile = ({file, operation_system_verion_id}) => {
  return axios.request({
    url: '/uploadFile',
    method: 'post',
    headers: {
      //'Content-Type': 'multipart/form-data;chartset=UTF-8'
      'Content-Type': 'application/x-www-form-urlencoded',
      AUTHORIZATION: getToken()
    },
    processData: false, // 告诉axios不要去处理发送的数据(重要参数)
    data: file,
    params: {
      operation_system_verion_id
    }
  })
}

/* 文件安装 */
/*
*
* */
export const installNginx = ( l7ServerInfos,{ filePath}) => {
  return axios.request({
    url: '/installNginx',
    method: 'post',
    params: {
      filePath
    },
    data: l7ServerInfos
  })
}

/* 查询版本信息 */
/*
*
* */
export const selOerationSystemVersion = () => {
  return axios.request({
    url: '/selOerationSystemVersion',
    method: 'post',

  })
}


/**  在线安装 */

export const onInstall = ({fileName}, ipList) => {
    return axios.request({
        url: '/onInstall',
        method: 'post',
        params: { fileName },
        data: ipList
    })
}
