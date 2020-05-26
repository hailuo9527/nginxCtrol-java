<template>
  <div class="container">
    <div class="header">
      <span style="font-size: 22px;font-weight: bold;">License管理</span>
    </div>
    <Upload multiple action="/url" :before-upload="handleUpload">
      <div class="upload">
        <div class="upload-content">
          <Icon
            type="ios-cloud-upload"
            size="52"
            style="color: #3399ff; margin-left: 14px"
          ></Icon>
          <p style="font-size: 16px;">添加许可证</p>
        </div>
      </div>
    </Upload>
    <div v-if="file !== null" style="text-align: center">
      <span style="font-weight: bold;">Upload file:</span
      ><span style="color: #01c864;font-weight: bold;margin-right: 4px">
        {{ file.name }}</span
      >
      <Button type="primary" @click="upload" :loading="loadingStatus">{{
        loadingStatus ? "上传中..." : "点击上传"
      }}</Button>
      <Button @click="cancel" style="margin-left: 4px">取消</Button>
    </div>
    <div class="message">
      <pre>
        {{ message }}
      </pre>

      <Loading v-if="loading" />
    </div>
  </div>
</template>

<script>
import { selLicense, uploadLicense } from "@/api/system";
import Loading from "@/components/common/loading.vue";
export default {
  components: { Loading },
  data() {
    return {
      message: "",
      file: null,
      loadingStatus: false,
      loading: false,
    };
  },
  methods: {
    async GetLicense() {
      this.loading = true;
      let res = await selLicense();
      if (res.data.code === "success") {
        this.loading = false;
        this.message = res.data.result;
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
  },
  mounted() {
    this.GetLicense();
  },
};
</script>

<style lang="less" scoped>
.container {
  max-width: 1080px;
  margin: 0 auto;
//   background: #f8f8f8;
  background: #fff;
  overflow-y: scroll;
  overflow-x: hidden;
}
.header {
  padding: 18px 40px;
  border-bottom: 1px solid #d8d8d8;
}
.upload {
  width: 1080px;
  cursor: pointer;
  position: relative;
  height: 160px;
  //   &:hover {
  //       border: 1px dashed #01c864;
  //   }
}
.upload-content {
  position: absolute;
  padding: 44px 0;
  height: 160px;
  transform: translateX(-50%);
  left: 50%;
}
.message {
    text-align: center;
}
</style>
