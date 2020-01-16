<template>
  <div class="father">
    <div class="inner">
      <div class="main-content">
        <router-link to="/L7/123/analysis">
          <Button class="back-button">
            <Icon type="md-arrow-back" style="font-size: 22px;margin: 0 10px 0 -6px;" />Back
          </Button>
        </router-link>
        <h1>Virtual servers</h1>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
.inner {
  width: 939px;
  left: 30px;
  top: 60px;
  background: #ffffff;
  -webkit-box-shadow: 0 10px 24px 0 rgba(0, 0, 0, 0.2);
  box-shadow: 0 10px 24px 0 rgba(0, 0, 0, 0.2);
  margin-right: 145px;
  max-width: 940px;
  padding: 20px 30px 30px;
  position: relative;
}
.router-link-active {
  position: -webkit-sticky;
  position: sticky;
  top: 63px;
  z-index: 10;
  display: block;
  max-width: 0;
  margin-bottom: -30px;
}
.back-button {
  font-weight: bold;
  line-height: 32px;
}
h1 {
  font: 36px "RobotoBold", Arial, sans-serif;
  font-weight: bold;
  color: #333333;
  letter-spacing: 0;
  margin: -50px -28px 13px -28px;
  padding: 79px 0 13px 28px;
  background: #ffffff;
  position: -webkit-sticky;
  position: sticky;
  top: 43px;
  z-index: 9;
  -webkit-box-shadow: 0 5px 2px 0 #ffffff;
  box-shadow: 0 5px 2px 0 #ffffff;
}
</style>