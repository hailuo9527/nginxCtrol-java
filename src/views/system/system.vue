<template>
  <div>
    <Layout :style="{ minHeight: '100vh' }">
      <!-- 侧边栏 -->
      <Sider
        collapsible
        :collapsed-width="78"
        v-model="isCollapsed"
        :width="245"
      >
        <Menu
          active-name="license"
          width="auto"
          :class="menuitemClasses"
          @on-select="GetMenuValue"
        >
          <MenuItem name="license">
            <Icon type="md-list" size="22" />
            <span>License管理</span>
          </MenuItem>
          <MenuItem name="systemId">
            <Icon type="md-ionitron" size="22" />
            <span>系统ID</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <div class="container" v-if="status === 1">
          <div class="header">
            <span style="font-size: 22px;font-weight: bold;">License管理</span>
          </div>
          <div class="message">
            <div style="padding: 16px 10px 0 40px;">
              <Icon
                type="md-bookmark"
                size="22"
                style="color: #39f;"
              />许可证信息:
            </div>
            <pre
              style="padding: 0 0 0 136px;margin-top: 0;height: 105px;overflow-y: scroll;"
              >{{ message }}</pre
            >
            <!-- <Loading v-if="loading" /> -->
          </div>
          <div style="position: absolute;bottom: 0;width: 100%">
            <div style="width: 278px;position: absolute;left: 28%;bottom: 0;">
              <Upload multiple action="/url" :before-upload="handleUpload">
                <div class="upload">
                  <div class="upload-content">
                    <Icon
                      type="ios-cloud-upload"
                      size="52"
                      style="color: #3399ff;"
                    ></Icon>
                    <p style="font-size: 16px;">添加许可证</p>
                  </div>
                </div>
              </Upload>
              <div v-if="file !== null" style="text-align: center">
                <span style="font-weight: bold;">Upload file:</span
                ><span
                  style="color: #01c864;font-weight: bold;margin-right: 4px"
                >
                  {{ file.name }}</span
                >
                <Button
                  type="primary"
                  @click="upload"
                  :loading="loadingStatus"
                  >{{ loadingStatus ? "上传中..." : "点击上传" }}</Button
                >
                <Button @click="cancel" style="margin-left: 4px">取消</Button>
              </div>
            </div>
          </div>
        </div>
        <div class="container" v-if="status === 2">
          <div class="header">
            <span style="font-size: 22px;font-weight: bold;">系统ID</span>
          </div>
          <div style="padding: 32px 40px;">
            <Icon type="md-key" v-if="!loading" size="26" />
            <span v-if="!loading">{{ msg }}</span>
            <Loading v-if="loading" />
          </div>
        </div>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import { selLicense, uploadLicense, selSysId } from "@/api/system";
import Loading from "@/components/common/loading.vue";
export default {
  components: { Loading },
  data() {
    return {
      message: "",
      file: null,
      loadingStatus: false,
      loading: false,
      isCollapsed: false,
      status: 1,
      msg: "",
    };
  },
  computed: {
    menuitemClasses: function() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
  },
  methods: {
    //License查询
    async GetLicense() {
      this.loading = true;
      let res = await selLicense();
      if (res.data.code === "success") {
        this.message = res.data.result;
        let strArr = this.message.split("\n");
        strArr = strArr.filter((item) => {
          return !/##.*##/.test(item);
        });
        this.message = strArr.join("\n");
        this.loading = false;
      } else {
        this.loading = false;
        this.$Message.error(`${res.data.result}`);
      }
    },
    //绑定 before-upload，并返回false，可以阻止默认上传流程，手动控制文件上传。
    handleUpload(file) {
      this.file = file;
      return false;
    },
    //License文件上传
    async upload() {
      this.loadingStatus = true;
      let file = new FormData();
      file.append("file", this.file);
      let res = await uploadLicense(file);
      if (res.data.code === "success") {
        this.loadingStatus = false;
        this.$Message.success("文件 " + this.file.name + "上传成功！");
        this.file = null;
        this.GetLicense();
      } else {
        this.loadingStatus = false;
        this.$Message.error(
          "文件 " + this.file.name + "上传失败！" + res.data.result
        );
        this.file = null;
      }
    },
    cancel() {
      this.file = null;
    },
    //获取系统ID
    async GetSysId() {
      this.loading = true;
      let res = await selSysId();
      if (res.data.code === "success") {
        this.msg = res.data.result;
        this.loading = false;
      } else {
        this.loading = false;
        this.$Message.error(`${res.data.result}`);
      }
    },
    //侧边栏切换更换相应内容
    GetMenuValue(name) {
      if (name === "license") {
        this.status = 1;
        this.GetLicense();
      } else {
        this.status = 2;
        this.GetSysId();
      }
    }
  },
  mounted() {
    this.GetLicense();
  },
};
</script>

<style lang="less" scoped>
.container {
  background: #fff;
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100%;
}
.header {
  padding: 23px 40px;
  border-bottom: 1px solid #d8d8d8;
}
.upload {
  cursor: pointer;
  padding: 80px 0 0 0;
  height: 160px;
  text-align: center;
}
.message {
  text-align: left;
  //   display: flex;
  //   flex: 1;
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 90px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
/deep/ .ivu-layout-sider-trigger,
.ivu-menu-light,
.ivu-layout-sider {
  background-color: #e8eaec;
}
/deep/ .ivu-icon-ios-arrow-back {
  color: #000;
}
/deep/ .ivu-menu {
  color: #000;
}
/deep/ .ivu-menu-item {
  height: 80px;
  line-height: 45px;
}
/deep/ .ivu-upload {
  text-align: center;
  padding: 78px 0 0 0;
}
/deep/.ivu-upload-select {
  cursor: pointer;
}
/deep/ .ivu-layout {
    overflow: hidden;
}
</style>
