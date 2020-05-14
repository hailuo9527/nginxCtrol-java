<template>
  <div class="config-list">
    <div class="config_header">
      <span class="config_title">软件管理</span>

      <Button type="primary" size="large" icon="md-add" @click="uploadModal = true">上传文件</Button>
      <Modal v-model="uploadModal" title="文件上传" >
        <Form>
          <FormItem label='服务器版本'>
            <Select v-model="versionId" >
              <Option v-for="item in versionList" :value="item.operation_system_verion_id" :key="item.value">{{ item.operation_system_verion_name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="文件上传">
            <Upload action="/url"  multiple  :before-upload="handleBeforeUpload" accept=".deb, .rpm">
              <Button
                      icon="ios-cloud-upload-outline"
                      :loading="uploadLoading"
                      @click="handleUploadFile"
              >上传文件</Button>
            </Upload>

            <Row v-for="(item, index) in file" Key="index" v-if="file.length">
              <div class="ivu-upload-list-file" >
                <Icon type="ios-stats"></Icon>
                {{ item.name }}
                <Icon
                        v-show="showRemoveFile"
                        type="ios-close"
                        size="32"
                        class="ivu-upload-list-remove"
                        @click.native="handleRemove(index)"
                ></Icon>
              </div>
            </Row>
            <!--<Row>
              <transition name="fade">
                <Progress v-if="showProgress" :percent="progressPercent" :stroke-width="2">
                  <div v-if="progressPercent == 100">
                    <Icon type="ios-checkmark-circle"></Icon>
                    <span>完成</span>
                  </div>
                </Progress>
              </transition>
            </Row>-->
          </FormItem>
        </Form>

        <div slot="footer">
          <Button @click="uploadModal = false">取消</Button>
          <Button type="primary"  :loading="submitLoading" @click="upload">确定</Button>
        </div>
      </Modal>

    </div>
    <div class="config_table_wrapper">
      <Table :columns="tableConfig" :loading="loading" :data="tableData">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="info" size="small" @click="install(row)">安装</Button>
          <Poptip
                  transfer
                  confirm
                  title="确定要删除这个文件吗？"
                  @on-ok="delFile(row)"
                  >
            <Button  style="margin-left: 10px" type="error" size="small">删除</Button>
          </Poptip>

        </template>
      </Table>
    </div>
    <Modal v-model="installModal" title="软件安装" width="800" >
      <Table :columns="serverListTableConfig" @on-selection-change="onSelectionChange" max-height="500" :loading="loading" :data="serverList">

      </Table>
      <div slot="footer">
        <Button @click="cancel()">取消</Button>
        <Button type="primary" @click="installNginx()" :loading="installLoading"
          >
          <span v-if="!installLoading">确定</span>
          <span v-else>安装中...</span>
          </Button
        >
      </div>
    </Modal>
  </div>
</template>
<script>
  import {installNginx, selOerationSystemVersion, selUploadFile, uploadFile, delFile} from "../../api/upload";
  import {mapState} from 'vuex'

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
            title: '系统版本',
            key: 'operation_system_verion_name',
            filterMultiple: false,
          },
          {
            title: '操作',
            slot: 'action',
            align: 'center'
          }
        ],
        tableData: [],
        loading: false,
        uploadLoading: false,
        progressPercent: 0,
        showProgress: false,
        showRemoveFile: false,
        file: [],
        uploadModal: false,
        submitLoading: false,
        versionId: 1,
        versionList: [],
        installModal: false,
        serverListTableConfig: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '实例名',
            key: 'l7ServerName'
          },
          {
            title: '系统版本',
            key: 'system_name'
          },
          {
            title: 'NGINX版本',
            key: 'nginxVersion'
          },
        ],
        installLoading: false,
        selectedServer: [],
        active: {} //待安装文件
      }
    },
    computed: {
      ...mapState({
        asideList: state => state.L7.asideList,
      }),
      serverList() {
        let asideList = []
        Object.keys(this.asideList).map((item)=>{
          asideList.push(...this.asideList[item])
        })
        return asideList
      }
    },
    methods: {
      // 获取文件列表
      async selUploadFile() {
        this.loading = true
        let res = await selUploadFile()
        this.loading = false
        if (this.asyncOk(res)) {
          this.tableData = res.data.result || []
        }
      },
      // 删除文件
      async delFile(row) {
        let res =await delFile({path: row.file_path, version: row.operation_system_verion_id})
        console.log(res)
        if (this.asyncOk(res)) {
          this.$Message.success('删除成功！')
          this.selUploadFile()
        } else {
          this.$Message.error(res.data.result)
        }
      },
      // 获取版本列表
      async getVersionList() {
        let res = await selOerationSystemVersion()
        if (this.asyncOk(res)) {
          this.versionList = res.data.result || []
          let arr = this.versionList.map((item) => {
              return {
                label: item.operation_system_verion_name,
                value: item.operation_system_verion_name
              }
          })

          this.$set(this.tableConfig[4], 'filters', arr)
          let filterMethod  = function  (value, row){
            let str = row.operation_system_verion_name
            return str === value;
          }
          this.$set(this.tableConfig[4],'filterMethod',filterMethod )
        }
      },
      /* 安装 */
      install(row){
        this.installModal = true
        this.active = row
      },

      async installNginx() {
        if (this.selectedServer.length>0) {
            this.installLoading = true
            let res = await installNginx(this.selectedServer,{filePath: this.active.file_path})
            this.installLoading = false
            this.installModal = false
            if (this.asyncOk(res)) {
                this.$Message.success(res.data.result)
            }else {
                this.$Message.error(res.data.result)
            }
        } else {
            this.installModal = false
        }

      },
      cancel() {
          this.installModal = false
      },
      // 选择安装目标服务器
      onSelectionChange(selection) {
        this.selectedServer = selection
      },
      async upload() {
        if (!this.file.length) {
          this.$Message.error("请选择需要上传的文件文件！");
          return false
        }
        this.submitLoading = true
        let promises = this.file.map((item, index) => {
          let fileFormData = new FormData();
          fileFormData.append("file", item);
          return uploadFile({file: fileFormData, operation_system_verion_id: this.versionId}).then((res) => {
            if (res.data.code === "success") {
              this.$Message.success("文件 " + item.name + "上传成功！");

            } else {
              this.$Message.error("文件 " + item.name + "上传失败！"+ res.data.result);
            }
          })
        })
        Promise.all(promises).then(res => {
          this.submitLoading = false
          this.uploadModal = false
          this.selUploadFile();
          this.initUpload();
        })


      },
      initUpload() {
        this.file = [];
        this.showProgress = false;
        this.loadingProgress = 0;
      },
      handleUploadFile() {
        this.initUpload();
      },
      handleRemove(index) {
        //this.initUpload();
        console.log(index)
        this.file.splice(index, 1)
        //this.$Message.info("上传的文件已删除！");
      },

      handleBeforeUpload(file) {
        const fileExt = file.name
          .split(".")
          .pop()
          .toLocaleLowerCase();
        if (fileExt === "deb" || fileExt === "rpm") {
          if(file.size > 1024 * 1024 * 2){
            this.$Notice.warning({
              title: "文件大小错误",
              desc:
                "文件：" +
                file.name +
                "大小超过2M"
            });
            return
          }

          this.readFile(file);
          this.file.push(file)  ;
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
          //this.$Message.info("文件读取成功");
          const data = e.target.result;

          this.uploadLoading = false;
          this.showRemoveFile = true;
        };
      },
    },
    mounted() {
      this.selUploadFile()
      this.getVersionList()
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
  .ivu-upload-list-file{
    color: @green
  }
</style>
