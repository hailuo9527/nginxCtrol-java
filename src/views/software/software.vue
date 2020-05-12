<template>
  <div class="config-list">
    <div class="config_header">
      <span class="config_title">软件管理</span>
      <!--<Upload
              multiple
              type="drag"
              :format="['deb','rpm']"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :on-error="handleError"
              :headers="headers"
              :action="action">
        <Button type="primary" size="large" icon="md-add" >上传文件</Button>
      </Upload>-->
      <Button type="primary" size="large" icon="md-add" @click="uploadModal = true">上传文件</Button>
      <Modal v-model="uploadModal">
        <Upload action="/url" :before-upload="handleBeforeUpload" accept=".deb, .rpm">
          <Button
                  icon="ios-cloud-upload-outline"
                  :loading="uploadLoading"
                  @click="handleUploadFile"
          >上传文件</Button>
        </Upload>
        <Row>
          <div class="ivu-upload-list-file" v-if="file !== null">
            <Icon type="ios-stats"></Icon>
            {{ file.name }}
            <Icon
                    v-show="showRemoveFile"
                    type="ios-close"
                    class="ivu-upload-list-remove"
                    @click.native="handleRemove()"
            ></Icon>
          </div>
        </Row>
        <Row>
          <transition name="fade">
            <Progress v-if="showProgress" :percent="progressPercent" :stroke-width="2">
              <div v-if="progressPercent == 100">
                <Icon type="ios-checkmark-circle"></Icon>
                <span>成功</span>
              </div>
            </Progress>
          </transition>
        </Row>
      </Modal>

    </div>
    <div class="config_table_wrapper">
      <Table :columns="tableConfig" :loading="loading" :data="tableData">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="error" size="small" @click="install(index)">安装</Button>

        </template>
      </Table>
    </div>

  </div>
</template>
<script>
  import { selUploadFile, uploadFile } from "../../api/upload";
  import { getToken } from '@/libs/util'
  import config from '@/config'
  export default {
    data() {
      return{
        tableConfig: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '文件名',
            key: 'file_name'
          },
          {
            title: '文件路径',
            key: 'file_path'
          },
          {
            title: '上传时间',
            key: 'ctime'
          },
          {
            title: '操作',
            slot: 'action'
          }
        ],
        tableData: [],
        loading: false,
        uploadLoading: false,
        progressPercent: 0,
        showProgress: false,
        showRemoveFile: false,
        file: null,
        uploadModal: false
      }
    },
    computed:{
      headers: function () {
        return {
          AUTHORIZATION: getToken()
        }
      },
      action: function () {
        let url = process.env.NODE_ENV === 'development' ? config.uploadUrl : config.baseUrl.pro
        return url + '/uploadFile'
      }
    },
    methods: {
      // 获取文件列表
      async selUploadFile() {
        this.loading = true
        let res = await selUploadFile()
        this.loading = false
        console.log(res)
        if (this.asyncOk(res)) {
          this.tableData = res.data.result || []
        }
      },
     /* /!* 文件上传 *!/
      handleFormatError(file,fileList) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件' + file.name + ' 格式不正确, 请选择后缀为.deb或者.rpm的文件'
        });
      },
      handleMaxSize(file,fileList) {
        this.$Notice.warning({
          title: '文件大小不正确',
          desc: '文件  ' + file.name + ' 太大了,不能超过2M'
        });
      },
      handleError(error, file, fileList) {
        this.$Notice.error({
          title: '上传失败',
          desc: '文件  ' + file.name + '上传失败，'+ '错误信息：' + error
        });
      },*/
      async upload() {
        if (!this.file) return;
        let fileFormData = new FormData();
        fileFormData.append("file", this.file);
        let res = await uploadFile({ file: fileFormData, operation_system_verion_id: '123' });

        if (res.data.code === "success") {
          this.$Message.success("上传成功！");
          this.selUploadFile();
          this.initUpload();
        } else {
          this.$Message.error("上传失败！");
        }
      },
      initUpload() {
        this.file = null;
        this.showProgress = false;
        this.loadingProgress = 0;
      },
      handleUploadFile() {
        this.initUpload();
      },

      handleRemove() {
        this.initUpload();
        this.$Message.info("上传的文件已删除！");
      },
      handleBeforeUpload(file) {
        const fileExt = file.name
          .split(".")
          .pop()
          .toLocaleLowerCase();
        if (fileExt === "deb" || fileExt === "rpm") {
          this.readFile(file);
          this.file = file;
        } else {
          this.$Notice.warning({
            title: "文件类型错误",
            desc:
              "文件：" +
              file.name +
              "不是安装包"
          });
        }
        return false;
      },
      // 读取文件
      readFile(file) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadstart = e => {
          this.uploadLoading = true;
          this.showProgress = true;
        };
        reader.onprogress = e => {
          this.progressPercent = Math.round((e.loaded / e.total) * 100);
        };
        reader.onerror = e => {
          this.$Message.error("文件读取出错");
        };
        reader.onload = e => {
          this.$Message.info("文件读取成功");
          const data = e.target.result;

          this.uploadLoading = false;
          this.showRemoveFile = true;
        };
      },
    },
    mounted() {
      this.selUploadFile()
    }
  }
</script>
<style lang="less" scoped>
  .config-list{
    max-width: 1080px;
    height: 100%;
    margin: 0 auto;
    background: #f8f8f8;
    .config_header{
      display: flex;
      justify-content: space-between;
      padding: 18px 40px;
      border-bottom: 1px solid #d8d8d8;
      margin: 0 0 20px;
      .config_title{
        font-size: 22px;
        font-weight: bold;
        margin-top: 10px;
      }

    }
    .config_table_wrapper{
      height: calc(100% - 160px);
      overflow-y: auto;
      padding: 0 40px;
    }
  }
</style>
