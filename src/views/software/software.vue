<template>
  <div class="config-list">
    <div class="config_header">
      <span class="config_title">软件管理</span>
      <div>
      <Button type="info" size="large" icon="md-flash" @click="onlineInstall()">在线安装</Button>
      <Button type="primary" size="large" icon="md-add" @click="uploadModal = true" style="margin-left: 10px">上传文件</Button>
      </div>
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
    <Modal v-model="installModal" title="isOnline?'在线安装':'软件安装'" width="800" :closable="false" :mask-closable="false">
        <div slot='header'>
            <span v-if="isOnline" style="color: #fff">在线安装</span>
            <span v-if="!isOnline" style="color: #fff">软件安装</span>
             <Tooltip content="请输入需要安装的软件名称（譬如：nginx）,再选择需要安装的目标实例。确定即可" :transfer="true" theme="light" v-if="isOnline" max-width='500px' placement='right'>
            <Icon
              class="handle"
              size="20"
              type="md-information-circle"
              color="#01c864"
            />
          </Tooltip>
          <Icon type="md-close" class="close-icon" @click="closeModal()"/>
        </div>
        <div class="input-filename" v-if="isOnline">
            <div style="width: 66px;line-height: 32px;"><span>软件名称</span></div>
            <Input v-model="filename" placeholder="请输入软件名" style="width: 300px" />
            <Alert type="error" class="err-tip" v-if="isFileName" :closable="true" @on-close="closeInputAlert">
                软件名不能为空
                <Icon type="md-close" class="close" slot="close" />
            </Alert>
        </div>
      <Table :columns="serverListTableConfig" @on-selection-change="onSelectionChange" max-height="500" :loading="loading" :data="serverList">

      </Table>
      <Alert type="error" class="err-tips" v-if="isTableChoose" :closable="true" @on-close="closeTableAlert" :class="isOnline?'on-line':'not-online'">
            请勾选一个或多个实例
            <Icon type="md-close" class="close" slot="close" />
      </Alert>
      <div slot="footer">
        <Button @click="cancel()">取消</Button>
        <Button type="primary" @click="installNginx()" :loading="installLoading" v-if="!isOnline"
          >
          <span v-if="!installLoading">确定</span>
          <span v-else>安装中...</span>
          </Button
        >
        <Button type="primary" @click="onlineInstallConfirm()" :loading="installLoading" v-if="isOnline"
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
  import {installNginx, selOerationSystemVersion, selUploadFile, uploadFile, delFile, onInstall} from "../../api/upload";
  import {mapState,mapActions} from 'vuex'

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
              title: '文件大小',
              key: 'size'
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
        active: {}, //待安装文件
        filename: '',
        isOnline: false,
        isFileName: false,
        isTableChoose: false
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
        ...mapActions(["getL7AsideList"]),
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
            this.isTableChoose = false
            this.installLoading = true
            let res = await installNginx(this.selectedServer,{filePath: this.active.file_path})
            this.installLoading = false
            this.installModal = false
            if (this.asyncOk(res)) {
                this.$Message.success(res.data.result)
            }else {
                this.$Notice.error({desc: res.data.result, duration: 0})
            }
        } else {
            this.isTableChoose = true
        }

      },
      cancel() {
          this.installModal = false
          this.isOnline = false
      },
      closeModal() {
          this.installModal = false
          this.isOnline = false
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
        Promise.allSettled(promises).then(res => {
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
      //在线安装
      onlineInstall() {
          this.isOnline = true
          this.installModal = true
          this.filename = ""
          this.isFileName = false
          this.isTableChoose = false
      },
      //在线安装确认
      async onlineInstallConfirm() {
          if (this.filename !== '') {
              this.isFileName = false
            if (this.selectedServer.length>0) {
                this.isTableChoose = false
                let ipList = this.selectedServer.map(function (item) {
                    return item.l7ServerSSHIp
                })
                this.installLoading = true
                let res = await onInstall({fileName: this.filename}, ipList)
                this.installLoading = false
                this.installModal = false
                this.isOnline = false
                if (this.asyncOk(res)) {
                    this.$Message.success(res.data.result)
                }else {
                    this.$Notice.error({desc: res.data.result, duration: 0})
                }
            } else {
                this.isTableChoose = true
            }
          } else {
              this.isFileName = true
          }
      },
      closeInputAlert(event) {
          this.isFileName = false
      },
      closeTableAlert(event) {
          this.isTableChoose = false
      }
    },
    watch: {
        filename(val, oldVal) {
            if (val === '') {
                this.isFileName = true
            } else {
                this.isFileName = false
            }
        },
        selectedServer(val, oldVal) {
            if (val === []) {
                this.isTableChoose = true
            } else {
                this.isTableChoose = false
            }
        }
    },
    mounted() {
      this.selUploadFile()
      this.getVersionList()
      this.getL7AsideList()
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
  .input-filename {
      margin-bottom: 6px;
      display: flex;
      flex-direction: row;
  }
   .handle {
    font-weight: bold;
    cursor: pointer;
    // opacity: 0.2;
    transition: all 0.1s;
    margin-left: 10px;
    margin-top: -2px;
    // &:hover {
    //   opacity: 1 !important;
    // }
  }
  .err-tip{
  margin-bottom: 0!important;
  background: #ff5559;
  opacity: .95;
  border: none;
  border-radius: 0;
  font-size: 14px;
  color: #fff;
  position: absolute;
  top: 104px;
  left: 82px;
  z-index: 10;
  width: 300px;
  .close{
    font-size: 18px;
    color: #fff;
  }
}
.err-tips{
  margin-bottom: 0!important;
  background: #ff5559;
  opacity: .95;
  border: none;
  border-radius: 0;
  font-size: 14px;
  color: #fff;
  padding: 14px 40px;
  position: absolute;
  left: 16px;
  z-index: 10;
  width: 760px;
  .close{
    font-size: 18px;
    color: #fff;
  }
}
.on-line {
  top: 150px;
}
.not-online {
    top: 100px
}
.close-icon {
    cursor: pointer;
    float: right;
    font-size: 20px;
    color: #fff;
    margin-top: -2px;
}
</style>
