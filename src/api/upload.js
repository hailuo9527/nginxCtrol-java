import axios from '@/libs/api.request'

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
/* 文件上传 */
/*
*
* */
export const uploadFile = ({file, operation_system_verion_id}) => {
  return axios.request({
    url: '/uploadFile',
    method: 'post',
    data: {
      file
    },
    params: {
      operation_system_verion_id
    }
  })
}
