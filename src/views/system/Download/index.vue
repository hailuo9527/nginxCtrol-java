<template>
  <!-- <div class="btn-back-home">
      <Button icon="md-arrow-back" type="info" @click="backToHome()"
        >返回首页</Button
      >
    </div> -->
  <Row type="flex" justify="center">
    <div class="select-box">
      <div class="select-panel">
        <div class="title">
          选择填写信息或选择已填写
        </div>
        <div class="item">
          <h3>填写信息</h3>
          <p>
            下载前须填写一些相关信息
          </p>
          <div class="arrow" @click="register(1)">
            <Icon type="md-arrow-forward" color="#00a4ff" :size="40" />
          </div>
        </div>
        <div class="item">
          <h3>已填写</h3>
          <p>
            如果之前填写过请选择已填写
          </p>
          <div class="arrow" @click="register(2)">
            <Icon type="md-arrow-forward" :size="40" />
          </div>
        </div>
      </div>
    </div>
  </Row>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {};
  },
  methods: {
    backToHome() {
      this.$router.replace({ name: "home" });
    },
    register(num) {
      this.$emit("register", num);
    },
  },
};
</script>

<style lang="less" scoped>
.btn-back-home {
  position: absolute;
  top: 10px;
  right: 10px;
}
.select-box {
  width: 500px;
  .select-panel {
    display: flex;
    flex-direction: column;

    .title {
      text-align: center;
      margin-top: 20px;
    }
    .item {
      margin: 20px 0;
      padding: 20px;
      border: 1px solid #00a4ff;
      background: #f7f8fa;
      cursor: pointer;
      position: relative;

      width: 100%;
      box-sizing: border-box;
      transition: all 0.3s;
      h3 {
        font-size: 14px;
        color: #00a4ff;
      }
      p {
        color: #666;
      }
      .arrow {
        position: absolute;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        background: rgba(0, 0, 0, 0);
        transition: all 0.3s;
        display: flex;
        padding: 20px;
        justify-content: flex-end;
        align-items: center;
        visibility: hidden;
        .iconfont {
          transition: all 0.3s;
          visibility: hidden;
          color: #fff !important;
        }
      }
      &:hover {
        //border: none;
        .arrow {
          background: rgba(0, 0, 0, 0.7);
          visibility: visible;
          .iconfont {
            visibility: visible;
            color: #00a4ff !important;
          }
        }
      }
    }
  }
}
</style>
